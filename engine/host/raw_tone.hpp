// Native scene-linear ingress adjustment. No measured material is changed.
#pragma once
#include "image_io.hpp"
#include "raw_color.hpp"
#include <algorithm>
#include <cmath>
#include <stdexcept>
namespace spkhost {
struct RawToneCurve {
    std::vector<std::array<double,2>> points;
    std::vector<double> slopes;
    bool active=false;
    explicit RawToneCurve(const spk::Json& value) {
        const auto& a=value.at("points");
        if(value.is_null()) { points={{0,0},{1,1}}; }
        else {
            if(!a.is_array()||a.items().size()<2||a.items().size()>256)throw std::runtime_error("RAW tone: invalid curve");
            for(const auto& p:a.items()) {
                if(!p.is_array()||p.items().size()!=2||!p.items()[0].is_number()||!p.items()[1].is_number())throw std::runtime_error("RAW tone: invalid curve point");
                double x=p.items()[0].as_double(),y=p.items()[1].as_double();
                if(!std::isfinite(x)||!std::isfinite(y)||x<0||x>1||y<0||y>1||(!points.empty()&&x<=points.back()[0]))throw std::runtime_error("RAW tone: curve must increase in x within 0..1");
                points.push_back({x,y});
            }
        }
        active=points.size()!=2||points[0]!=std::array<double,2>{0,0}||points[1]!=std::array<double,2>{1,1};
        const size_t n=points.size();std::vector<double>d(n-1);slopes.resize(n);
        for(size_t i=0;i+1<n;i++)d[i]=(points[i+1][1]-points[i][1])/(points[i+1][0]-points[i][0]);
        slopes[0]=d[0];slopes[n-1]=d[n-2];
        for(size_t i=1;i+1<n;i++)slopes[i]=d[i-1]*d[i]<=0?0:(d[i-1]+d[i])*.5;
        for(size_t i=0;i+1<n;i++)if(d[i]!=0){double a=slopes[i]/d[i],b=slopes[i+1]/d[i],s=a*a+b*b;if(s>9){double t=3/std::sqrt(s);slopes[i]=t*a*d[i];slopes[i+1]=t*b*d[i];}}
    }
    double evaluate(double x) const {
        if(!active)return x;
        // Endpoint tangents preserve recoverable HDR instead of clipping to one.
        if(x<points.front()[0])return points.front()[1]+(x-points.front()[0])*std::clamp(slopes.front(),0.,8.);
        if(x>points.back()[0])return points.back()[1]+(x-points.back()[0])*std::clamp(slopes.back(),0.,8.);
        size_t i=0;while(i+2<points.size()&&x>points[i+1][0])i++;
        double h=points[i+1][0]-points[i][0],t=(x-points[i][0])/h,t2=t*t,t3=t2*t;
        return std::clamp((2*t3-3*t2+1)*points[i][1]+(t3-2*t2+t)*h*slopes[i]+(-2*t3+3*t2)*points[i+1][1]+(t3-t2)*h*slopes[i+1],0.,1.);
    }
    double linear(double v) const {
        if(!active)return v;
        const double sign=v<0?-1:1,k=std::log2(1+1/.18);
        return sign*.18*std::expm1(evaluate(std::log2(1+std::abs(v)/.18)/k)*k*std::log(2.));
    }
};
struct RawTone {
    RawColor color;
    double exposure=0,contrast=0,highlights=0,shadows=0,whites=0,blacks=0;
    std::array<RawToneCurve,5> curves;
    bool active=false;
    explicit RawTone(const spk::Json& j):color(j),curves{RawToneCurve(j.at("curves").at("rgb")),RawToneCurve(j.at("curves").at("luma")),RawToneCurve(j.at("curves").at("red")),RawToneCurve(j.at("curves").at("green")),RawToneCurve(j.at("curves").at("blue"))} {
        if(!j.is_null()&&!j.is_object())throw std::runtime_error("RAW tone must be an object");
        const char* keys[]={"exposure","contrast","highlights","shadows","whites","blacks"};double* values[]={&exposure,&contrast,&highlights,&shadows,&whites,&blacks};
        for(size_t i=0;i<6;i++){const auto& v=j.at(keys[i]);if(v.is_null())continue;double n=v.as_double(),limit=i==0?5:100;if(!v.is_number()||!std::isfinite(n)||std::abs(n)>limit)throw std::runtime_error("RAW tone: invalid control value");*values[i]=n;active|=n!=0;}
        for(const auto& c:curves)active|=c.active;
        active|=color.balance_active||color.hsl_active;
    }
    void apply(FloatImage& image) const {
        if(!active)return;
        if(!image.raw_metadata)throw std::runtime_error("RAW tone requires a RAW photograph");
        const double gain=std::exp2(exposure);
        for(size_t i=0;i<image.rgb.size();i+=3){
            double c[3]={image.rgb[i]*gain,image.rgb[i+1]*gain,image.rgb[i+2]*gain};
            double y=.28804*c[0]+.711874*c[1]+.000086*c[2];
            if(y>1e-12 && (contrast!=0||highlights!=0||shadows!=0||whites!=0||blacks!=0||curves[1].active)){double ev=std::log2(y/.18),s=1/(1+std::exp(ev+2)),h=1/(1+std::exp(-(ev-1)));
                double delta=contrast/100*.3*std::clamp(ev,-8.,8.)+shadows/100*1.5*s+highlights/100*1.5*h+
                    whites/100*2*std::clamp(ev/4,0.,1.)+blacks/100*2*std::clamp(-ev/6,0.,1.);
                double target=curves[1].linear(y*std::exp2(delta)),ratio=target/y;for(double& v:c)v*=ratio;
            }
            std::array<double,3> colored{};for(size_t ch=0;ch<3;ch++)colored[ch]=curves[ch+2].linear(curves[0].linear(c[ch]));
            colored=color.apply(colored);
            for(size_t ch=0;ch<3;ch++){
                double v=colored[ch];
                if(!std::isfinite(v)||std::abs(v)>1e12)throw std::runtime_error("RAW tone produced an unsupported radiance");
                image.rgb[i+ch]=float(v);
            }
        }
    }
};
}
