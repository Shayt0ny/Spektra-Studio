#pragma once
#include "raw_tone.hpp"

namespace spkhost {
constexpr size_t kRawSampleLimit=8192;
struct RawAnalysis { std::vector<float> white_balance,tone; };
inline std::vector<float> raw_samples(const FloatImage& image){
    const size_t pixels=image.rgb.size()/3,count=std::min(pixels,kRawSampleLimit);
    std::vector<float> samples;samples.reserve(count*3);
    for(size_t i=0;i<count;i++){const size_t p=((2*i+1)*pixels)/(2*count);samples.insert(samples.end(),image.rgb.begin()+p*3,image.rgb.begin()+p*3+3);}
    return samples;
}
inline spk::Json raw_auto_curve(std::vector<double> luminance){
    if(luminance.size()<32)throw std::runtime_error("not enough usable RAW samples for a curve");
    std::sort(luminance.begin(),luminance.end());
    const auto axis=[](double y){return std::log2(1+std::max(0.,y)/.18)/std::log2(1+1/.18);};
    const auto percentile=[&](double p){return luminance[size_t((luminance.size()-1)*p)];};
    const double lo=axis(percentile(.01)),hi=axis(percentile(.99)),mid=axis(percentile(.5));
    if(hi-lo<.01)throw std::runtime_error("RAW has too little tonal variation for an automatic curve");
    const double lift=std::clamp((axis(.18)-mid)*.55,-.1,.1),spread=std::clamp((.65-(hi-lo))*.15,-.035,.035);
    spk::Json points=spk::Json::array();double previous=0;size_t i=0;
    for(double x:{0.,.15,.35,.5,.7,.9,1.}){
        const double weight=std::sin(3.14159265358979323846*x);
        double y=x==0||x==1?x:std::clamp(x+lift*weight+spread*(x-.5)*weight,previous+.001,1-(6-i)*.001);
        spk::Json point=spk::Json::array();point.push(spk::Json(x));point.push(spk::Json(y));points.push(std::move(point));previous=y;i++;
    }
    spk::Json curve=spk::Json::object();curve.set("points",std::move(points));return curve;
}
}
