#include "raw_tone.hpp"
#include "raw_auto.hpp"
#include <cstring>
#include <iostream>
using namespace spkhost;
static void check(bool yes,const char* message){if(!yes)throw std::runtime_error(message);}
static spk::Json json(const char* text){spk::Json value;std::string e;check(spk::Json::parse(text,value,e),e.c_str());return value;}
int main(){try{
 FloatImage image;image.width=3;image.height=1;image.raw_metadata.emplace();image.rgb={-.02f,.18f,4.f,.1f,.2f,.3f,0.f,0.f,0.f};
 const auto original=image.rgb;RawTone(json("{} ")).apply(image);check(image.rgb==original,"neutral RAW tone moved pixels");
 RawTone(json("{\"exposure\":1}")).apply(image);for(size_t i=0;i<original.size();i++)check(image.rgb[i]==original[i]*2,"RAW exposure is not linear gain or clipped headroom");
 image.rgb=original;RawTone(json("{\"curves\":{\"rgb\":{\"points\":[[0,0],[0.5,0.7],[1,1]]}}}")).apply(image);check(image.rgb[1]>.18f&&image.rgb[2]>1,"RAW curve did not precede film or clipped HDR");
 bool failed=false;try{RawTone bad(json("{\"exposure\":99}"));}catch(...){failed=true;}check(failed,"out-of-range RAW controls were accepted");
 image.rgb=original;RawTone(json("{\"colorBalance\":{\"master\":{\"hue\":90}},\"hsl\":{\"red\":{\"hue\":0,\"saturation\":0}}}")).apply(image);check(image.rgb==original,"zero colour strengths moved pixels");
 RawColor shift(json("{\"hsl\":{\"red\":{\"hue\":30}}}"));
 const auto orange=shift.apply({std::pow(.75,1.8),std::pow(.25,1.8),std::pow(.25,1.8)});
 check(std::abs(orange[0]-std::pow(.75,1.8))<1e-10&&std::abs(orange[1]-std::pow(.5,1.8))<1e-10&&std::abs(orange[2]-std::pow(.25,1.8))<1e-10,"RAW HSL is not applied in encoded working space and returned to linear");
 const auto grey=shift.apply({4,4,4});check(std::abs(grey[0]-4)<1e-10&&grey[0]==grey[1]&&grey[1]==grey[2],"HSL tinted or clipped HDR grey");
 const auto hdr=shift.apply({4,-.02,-.02});check(hdr[0]>1&&hdr[2]<0,"HSL clipped extended range");
 RawColor balance(json("{\"colorBalance\":{\"master\":{\"hue\":0,\"saturation\":0.4}}}"));
 const auto warm=balance.apply({.18,.18,.18});check(warm[0]>.18&&warm[1]<.18&&std::abs(warm[1]-warm[2])<1e-10,"RAW colour balance did not independently shape source colour");
 for(const char* request:{"{\"hsl\":{\"red\":{\"hue\":31}}}","{\"colorBalance\":{\"master\":{\"saturation\":2}}}","{\"hsl\":5}"}){failed=false;try{RawTone bad(json(request));}catch(...){failed=true;}check(failed,"invalid RAW colour accepted");}
 image.width=257;image.height=33;image.rgb.resize(size_t(image.width)*image.height*3,.18f);
 check(raw_samples(image).size()==kRawSampleLimit*3,"automatic RAW samples exceeded their bound");
 const auto automatic=raw_auto_curve({.01,.02,.03,.04,.05,.06,.07,.08,.09,.1,.11,.12,.13,.14,.15,.16,.17,.18,.19,.2,.21,.22,.23,.24,.25,.26,.27,.28,.29,.3,.4,.5,.7,1.,2.,4.});
 RawToneCurve tested(automatic);check(tested.points.size()==7&&tested.points.front()==std::array<double,2>{0,0}&&tested.points.back()==std::array<double,2>{1,1},"automatic curve endpoints changed");
 for(size_t i=1;i<tested.points.size();i++)check(tested.points[i][1]>tested.points[i-1][1],"automatic curve inverted tones");
 failed=false;try{raw_auto_curve(std::vector<double>(64,.18));}catch(...){failed=true;}check(failed,"flat input should retain the current RAW curve");
 std::cout<<"PASS RAW identity, linear exposure, HDR curves, HSL, colour balance, bounded auto samples/curve and validation\n";return 0;
 }catch(const std::exception& e){std::cerr<<e.what()<<'\n';return 1;}}
