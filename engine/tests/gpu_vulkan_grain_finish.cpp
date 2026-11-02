// Test output grain appearance on the same cached physical realization, plus
// independent luminance/edge invariants. No material or density noise is altered.
#include "pipeline/view.hpp"
#include "gpu/gpu.hpp"
#include "gpu_vulkan_read.hpp"
#include <algorithm>
#include <array>
#include <cmath>
#include <cstdio>
#include <fstream>
#include <memory>
#include <stdexcept>
#include <string>
#include <vector>

namespace {
using namespace spk;
using gpu::Arg;
constexpr double yweights[]={.2880402,.7118741,.0000857};
void check(bool ok,const std::string& error){if(!ok)throw std::runtime_error(error);}
double y(const float* c){return c[0]*yweights[0]+c[1]*yweights[1]+c[2]*yweights[2];}
std::vector<float> finish(gpu::Gpu& gpu,const std::vector<float>& values,uint32_t w,uint32_t h){
    std::string e;auto original=gpu.upload(values.data(),values.size()*sizeof(float),e);
    std::vector<float> guard(values.size()+17,-12345.f);
    auto a=gpu.upload(guard.data(),guard.size()*sizeof(float),e),b=gpu.upload(guard.data(),guard.size()*sizeof(float),e);
    check(original&&a&&b,e);const float cfg[]={1};
    for(uint32_t axis=0;axis<2;++axis){const uint32_t n[]={w*h,w,h,axis};
        check(gpu.dispatch("spk_view_grain_chroma",{Arg::buf(axis==0?original:a),Arg::inline_bytes(cfg,1),
              Arg::inline_bytes(n,4),Arg::buf(axis==0?a:b)},w*h,e)&&gpu.flush(e),e);}
    std::vector<float> got;check(read_test_buffer(&gpu,b,got,e),e);
    for(size_t i=values.size();i<got.size();++i)check(got[i]==-12345.f,"grain finish wrote beyond output");
    got.resize(values.size());return got;
}
void invariants(const std::string& resources){
    std::string e;std::unique_ptr<gpu::Gpu> gpu(gpu::Gpu::create_vulkan(resources+"/vulkan",e));check(bool(gpu),e);
    constexpr uint32_t w=257,h=61;std::vector<float> values(size_t(w)*h*3);
    uint32_t seed=123;
    for(size_t i=0;i<values.size()/3;++i){
        for(size_t c=0;c<3;++c){seed=1664525u*seed+1013904223u;values[3*i+c]=.45f+.16f*(float(seed>>8)/16777216.f-.5f);}
    }
    auto got=finish(*gpu,values,w,h);double peak=0;
    for(size_t i=0;i<values.size()/3;++i){peak=std::max(peak,std::abs(y(&values[3*i])-y(&got[3*i])));
        for(size_t c=0;c<3;++c)check(std::isfinite(got[3*i+c])&&got[3*i+c]>=0&&got[3*i+c]<=1,"grain finish left RGB bounds");}
    check(peak<3e-7,"chroma finish changed per-pixel brightness grain");
    const std::array<float,3> colors[]={{0,0,0},{1,1,1},{.62f,.43f,.33f},{.2f,.2f,.9f},{.8f,.15f,.05f},{.05f,.7f,.1f}};
    for(uint32_t row=0;row<h;++row)for(uint32_t x=0;x<w;++x)
        for(size_t c=0;c<3;++c)values[3*(size_t(row)*w+x)+c]=colors[std::min<size_t>(5,size_t(x)*6/w)][c];
    got=finish(*gpu,values,w,h);double edge_error=0;
    for(size_t i=0;i<values.size();++i)edge_error=std::max(edge_error,std::abs(double(values[i])-got[i]));
    check(edge_error<2e-6,"chroma finish softened distinct color edges or shifted flat skin/sky patches");
    std::printf("grain finish invariants: max brightness error %.9g, flat/color-edge error %.9g, guards intact\n",peak,edge_error);
}
std::vector<float> pixels(const view::Result& r){
    std::vector<float> out(size_t(r.width)*r.height*3);
    for(size_t p=0;p<out.size()/3;++p)for(size_t c=0;c<3;++c){size_t k=8*p+2*c;out[3*p+c]=float(uint16_t(r.pixels[k])|uint16_t(r.pixels[k+1])<<8)/65535.f;}
    return out;
}
struct Stats {double yy=0,chroma=0;std::array<double,3> mean{};};
Stats stats(const std::vector<float>& a){
    Stats s;double sum_y=0,sum_y2=0,cc[2]={},cc2[2]={};size_t n=a.size()/3;
    for(size_t p=0;p<n;++p){double v=y(&a[3*p]);sum_y+=v;sum_y2+=v*v;
        for(size_t c=0;c<3;++c)s.mean[c]+=a[3*p+c]/n;
        const double ch[]={double(a[3*p])-a[3*p+1],double(a[3*p+2])-a[3*p+1]};
        for(size_t c=0;c<2;++c){cc[c]+=ch[c];cc2[c]+=ch[c]*ch[c];}}
    s.yy=std::sqrt(std::max(0.,sum_y2/n-(sum_y/n)*(sum_y/n)));
    for(size_t c=0;c<2;++c)s.chroma+=.5*std::max(0.,cc2[c]/n-(cc[c]/n)*(cc[c]/n));
    s.chroma=std::sqrt(s.chroma);return s;
}
void actual_grain(const std::string& resources,bool unfiltered,const char* dump){
    std::string e;std::unique_ptr<spk_engine,decltype(&spk_engine_destroy)> engine(spk_engine_create(resources.c_str(),nullptr),spk_engine_destroy);
    check(bool(engine),spk_last_error(nullptr));
    constexpr uint32_t w=1024,h=1024;std::vector<float> flat(size_t(w)*h*3,.184f);spk_image image{flat.data(),w,h,3};
    for(const char* stock:{"kodak_portra_400","kodak_portra_800"}){
        const std::string params=std::string(R"({"film_stock":")")+stock+R"(","print_stock":"kodak_portra_endura","film_format_mm":4.465116,"grain_active":true,"glare_active":false,"halation_active":false,"auto_exposure":false})";
        std::unique_ptr<spk_session,decltype(&spk_session_release)> s(spk_open(engine.get(),&image,params.c_str(),nullptr),spk_session_release);
        check(bool(s),spk_last_error(engine.get()));
        view::Request q;q.target_space="ProPhoto RGB";q.rgba16=true;q.adjustments.set("enabled",Json(false));q.finish_grain=false;
        view::Result raw,finished;check(view::render(s.get(),q,raw,e),e);
        q.finish_grain=!unfiltered;check(view::render(s.get(),q,finished,e),e);check(finished.print_cached,"grain finish regenerated the physical random realization");
        const auto a=pixels(raw),b=pixels(finished);const auto before=stats(a),after=stats(b);
        double max_y=0,mean_shift=0;
        for(size_t i=0;i<a.size()/3;++i)max_y=std::max(max_y,std::abs(y(&a[3*i])-y(&b[3*i])));
        for(size_t c=0;c<3;++c)mean_shift=std::max(mean_shift,std::abs(before.mean[c]-after.mean[c]));
        std::printf("%s: chroma std %.9g -> %.9g; Y std %.9g -> %.9g; max Y delta %.9g, mean RGB shift %.9g\n",
                    stock,before.chroma,after.chroma,before.yy,after.yy,max_y,mean_shift);
        check(before.yy>.005&&before.chroma>.01,"grain fixture has no grain to exercise");
        check(max_y<2./65535,"grain chroma finish changed the brightness-grain realization");
        check(mean_shift<.002,"grain finish shifted the stock's average color");
        if(dump){for(const auto& item:std::vector<std::pair<const char*,const view::Result*>>{{"raw",&raw},{"finished",&finished}}){
            std::ofstream file(std::string(dump)+"-"+stock+"-"+item.first+".rgba16",std::ios::binary);file.write(reinterpret_cast<const char*>(item.second->pixels.data()),item.second->pixels.size());}
            q.target_space="sRGB";
            for(bool enabled:{false,true}){q.finish_grain=enabled;view::Result shown;check(view::render(s.get(),q,shown,e),e);
                std::ofstream file(std::string(dump)+"-"+stock+"-srgb-"+(enabled?"finished":"raw")+".rgba16",std::ios::binary);
                file.write(reinterpret_cast<const char*>(shown.pixels.data()),shown.pixels.size());}}
        check(after.chroma<before.chroma*.6,"dense color speckle is not reduced on the same physical grain");
        q.no_film=true;q.finish_grain=false;check(view::render(s.get(),q,raw,e),e);
        q.finish_grain=true;check(view::render(s.get(),q,finished,e),e);
        check(raw.pixels==finished.pixels,"grain finishing changed the decoded original");
    }
    // Rich source chroma makes the bypass witnesses meaningful: a constant
    // grey source would also pass if an unwanted chroma filter were enabled.
    std::vector<float> colorful(257*61*3);uint32_t seed=98;
    for(auto& v:colorful){seed=1664525u*seed+1013904223u;v=.1f+.5f*float(seed>>8)/16777216.f;}
    spk_image rich{colorful.data(),257,61,3};
    std::unique_ptr<spk_session,decltype(&spk_session_release)> control(spk_open(engine.get(),&rich,R"({"grain_active":false,"glare_active":false,"halation_active":false,"auto_exposure":false})",nullptr),spk_session_release);
    check(bool(control),spk_last_error(engine.get()));
    for(bool no_film:{true,false}){
        view::Request q;q.no_film=no_film;q.rgba16=true;q.target_space="ProPhoto RGB";q.finish_grain=false;
        q.adjustments.set("enabled",Json(false));view::Result a,b;
        check(view::render(control.get(),q,a,e),e);q.finish_grain=true;check(view::render(control.get(),q,b,e),e);
        check(a.pixels==b.pixels,no_film?"decoded-source chroma was denoised":"grain-disabled photograph was denoised");
    }
}
} // namespace
int main(int argc,char**argv){try{
    check(argc>=2&&argc<=4,"usage: spk_vulkan_grain_finish <resources> [--unfiltered] [dump-prefix]");
    const bool unfiltered=argc>2&&std::string(argv[2])=="--unfiltered";
    const char* dump=argc>2&&!unfiltered?argv[2]:argc>3?argv[3]:nullptr;
    invariants(argv[1]);actual_grain(argv[1],unfiltered,dump);
    std::puts("grain finish: luminance, color, edge, cache and source-isolation gates passed");return 0;
}catch(const std::exception&e){std::fprintf(stderr,"grain finish: %s\n",e.what());return 1;}}
