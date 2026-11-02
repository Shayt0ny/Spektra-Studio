#include "pipeline/view.hpp"
#include <algorithm>
#include <cmath>
#include <cstdio>
#include <fstream>
#include <memory>
#include <stdexcept>
#include <string>
#include <vector>

namespace {
using namespace spk;
void check(bool ok, const std::string& e) { if (!ok) throw std::runtime_error(e); }
Json json(const char* s) { Json out; std::string e; check(Json::parse(s,out,e),e); return out; }
int code(const view::Result& r, size_t p, size_t c) {
    size_t i = 8*p+2*c; return int(r.pixels[i]) | int(r.pixels[i+1]) << 8;
}
int difference(const view::Result& a, const view::Result& b, size_t p) {
    int d=0; for(size_t c=0;c<3;++c) d=std::max(d,std::abs(code(a,p,c)-code(b,p,c))); return d;
}
void set(spk_session* s, const char* delta) {
    check(spk_set_params(s,delta,nullptr)==SPK_OK,spk_last_error(nullptr));
}
view::Result render(spk_session* s, const view::Request& q) {
    view::Result r;std::string e;check(view::render(s,q,r,e),e);return r;
}
} // namespace

int main(int argc,char** argv) {
    try {
        check(argc==2 || argc==3,"usage: spk_vulkan_decorations <resources> [dump-prefix]");
        using Engine=std::unique_ptr<spk_engine,decltype(&spk_engine_destroy)>;
        using Session=std::unique_ptr<spk_session,decltype(&spk_session_release)>;
        Engine engine(spk_engine_create(argv[1],nullptr),spk_engine_destroy);
        check(bool(engine),spk_last_error(nullptr));
        constexpr uint32_t w=1024,h=683;
        std::vector<float> pixels(size_t(w)*h*3,.184f);
        spk_image image{pixels.data(),w,h,3};
        const char* params=R"({"film_stock":"kodak_portra_400","print_stock":"kodak_portra_endura","grain_active":false,"glare_active":false,"halation_active":false,"auto_exposure":false,"scanner_unsharp_amount":0,"overscan_active":true,"overscan_format":"135","overscan_frame_seed":1234,"overscan_camera_seed":17,"date_imprint_active":false,"date_imprint_text":"26 11 02 18:45","date_imprint_corner":"br","date_imprint_size":1})";
        Session session(spk_open(engine.get(),&image,params,nullptr),spk_session_release);
        check(bool(session),spk_last_error(engine.get()));
        view::Request q;q.target_space="ProPhoto RGB";q.rgba16=true;q.adjustments=json(R"({"enabled":false})");
        const auto plain=render(session.get(),q);
        set(session.get(),R"({"date_imprint_active":true})");
        const auto baseline=render(session.get(),q);
        if(argc==3) {
            std::ofstream file(std::string(argv[2])+"-baseline.rgba16",std::ios::binary);
            file.write(reinterpret_cast<const char*>(baseline.pixels.data()),baseline.pixels.size());
        }
        char* text=nullptr;check(spk_overscan_geometry(session.get(),&text)==SPK_OK,spk_last_error(engine.get()));
        const Json layout=json(text);spk_string_free(text);
        const auto& corners=layout.at("gates").items().at(0).items();
        double x0=1,y0=1,x1=0,y1=0;
        for(size_t k=0;k<4;++k) {x0=std::min(x0,corners.at(2*k).as_double());x1=std::max(x1,corners.at(2*k).as_double());
            y0=std::min(y0,corners.at(2*k+1).as_double());y1=std::max(y1,corners.at(2*k+1).as_double());}
        std::vector<size_t> border,date;
        for(uint32_t y=0;y<baseline.height;++y)for(uint32_t x=0;x<baseline.width;++x) {
            const size_t p=size_t(y)*baseline.width+x;const double xx=double(x)/baseline.width,yy=double(y)/baseline.height;
            const int hi=std::max({code(baseline,p,0),code(baseline,p,1),code(baseline,p,2)});
            if((xx<x0-.01||xx>x1+.01||yy<y0-.01||yy>y1+.01)&&hi>1000&&hi<64000)border.push_back(p);
            if(xx>x0+.01&&xx<x1-.01&&yy>y0+.01&&yy<y1-.01&&difference(baseline,plain,p)>8000)date.push_back(p);
        }
        check(border.size()>100,"test has no nonblack film-border samples");
        check(date.size()>100,"test has no visible in-picture date samples");
        const uint32_t mid=baseline.width/2, top=uint32_t(std::lround(y0*baseline.height));
        int seam_overshoot=0;
        for(int dy=-3;dy<=3;++dy)for(size_t c=0;c<3;++c) {
            const int inside=code(baseline,size_t(top+8)*baseline.width+mid,c);
            const int outside=code(baseline,size_t(top-8)*baseline.width+mid,c);
            seam_overshoot=std::max(seam_overshoot,code(baseline,size_t(int(top)+dy)*baseline.width+mid,c)-std::max(inside,outside));
        }
        std::printf("flat-photo gate seam: overshoot %d RGB16 codes\n",seam_overshoot);
        check(seam_overshoot<=128,"gate seam adds a bright/colored fringe to a flat photograph");
        // Antialiased edges intentionally contain some background photograph.
        // Compare the high-coverage ink cores for color independence instead.
        std::vector<bool> ink(size_t(baseline.width)*baseline.height,false);
        for(size_t p:date)ink[p]=true;
        date.erase(std::remove_if(date.begin(),date.end(),[&](size_t p){
            for(int y=-2;y<=2;++y)for(int x=-2;x<=2;++x)
                if(!ink[size_t(ptrdiff_t(p)+ptrdiff_t(y)*baseline.width+x)])return true;
            return false;
        }),date.end());
        std::printf("opaque date core: %zu samples\n",date.size());
        check(date.size()>=100,"test has no high-coverage date ink samples");
        q.adjustments=json(R"({"enabled":true,"exposure":1.5,"temperature":70,"tint":-40,"saturation":-50})");
        const auto graded=render(session.get(),q);
        int border_error=0;for(size_t p:border)border_error=std::max(border_error,difference(baseline,graded,p));
        int ink_error=0;for(size_t p:date)ink_error=std::max(ink_error,difference(baseline,graded,p));
        std::printf("border after photo grade: max RGB16 difference %d (%zu samples)\n",border_error,border.size());
        std::printf("date core after photo grade: max RGB16 difference %d\n",ink_error);
        check(border_error<=1,"photo grading recolors the film border");
        check(ink_error<=1,"photo grading recolors opaque date ink");
        q.adjustments=json(R"({"enabled":false})");q.film_strength=0;
        const auto zero=render(session.get(),q);
        size_t retained=0;for(size_t p:date) if(difference(baseline,zero,p)<1000)++retained;
        std::printf("date at zero film strength: %zu/%zu samples retained\n",retained,date.size());
        check(retained>date.size()*9/10,"film-strength blend erases or recolors the date");
        q.film_strength=1;
        set(session.get(),R"({"exposure_compensation_ev":2,"print_exposure":0.5,"m_filter_shift":0.1})");
        const auto exposed=render(session.get(),q);
        border_error=0;for(size_t p:border)border_error=std::max(border_error,difference(baseline,exposed,p));
        check(border_error<=1,"photo exposure or enlarger filter recolors the film border");
        retained=0;for(size_t p:date)if(difference(baseline,exposed,p)<1000)++retained;
        std::printf("date after photo exposure/filter: %zu/%zu samples retained\n",retained,date.size());
        check(retained>date.size()*9/10,"photo exposure or enlarger filter recolors the date");
        set(session.get(),R"({"date_imprint_size":1.8,"date_imprint_ev":1.5})");
        const auto resized=render(session.get(),q);
        check(resized.pixels!=exposed.pixels,"the date's own size and brightness stopped working");
        std::string e;
        check(view::suspend(session.get(),e),e);
        check(view::resume(session.get(),e),e);
        check(render(session.get(),q).pixels==resized.pixels,"decoration cache did not survive suspension exactly");
        spk_result legacy{};
        check(spk_render(session.get(),"full",&legacy)==SPK_OK,spk_last_error(engine.get()));
        spk_result_free(&legacy);
        check(render(session.get(),q).pixels==resized.pixels,"legacy render contaminated the separate date/photograph caches");
        q.target_space="sRGB";
        const auto display=render(session.get(),q);q.export_intent=true;
        check(render(session.get(),q).pixels==display.pixels,"date/border preview and export do not share the same composite");
        if(argc==3)for(const auto& item:std::vector<std::pair<const char*,const view::Result*>>{{"baseline",&baseline},{"grade",&graded},{"zero",&zero},{"exposure",&exposed},{"resized",&resized}}) {
            std::ofstream file(std::string(argv[2])+"-"+item.first+".rgba16",std::ios::binary);
            file.write(reinterpret_cast<const char*>(item.second->pixels.data()),item.second->pixels.size());
            std::printf("dump %s %ux%u\n",item.first,item.second->width,item.second->height);
        }
        std::puts("decoration independence and date controls passed");return 0;
    }catch(const std::exception& e){std::fprintf(stderr,"decorations: %s\n",e.what());return 1;}
}
