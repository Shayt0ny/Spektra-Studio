// Copyright (C) 2026 shayt0ny. SPDX-License-Identifier: GPL-3.0-or-later
// Source colour controls return to linear float radiance before the film.
#pragma once
#include "core/json.hpp"
#include <array>
#include <algorithm>
#include <cmath>
#include <stdexcept>
namespace spkhost {
struct RawColor {
    std::array<std::array<double,3>,4> zones{};
    std::array<std::array<double,3>,8> bands{};
    bool balance_active=false,hsl_active=false;
    static double number(const spk::Json& j,const char* key,double limit){
        const auto& v=j.at(key);if(v.is_null())return 0;double n=v.as_double();
        if(!v.is_number()||!std::isfinite(n)||std::abs(n)>limit)throw std::runtime_error("RAW colour: invalid control value");return n;
    }
    explicit RawColor(const spk::Json& tone){
        const auto& cb=tone.at("colorBalance");const auto& hsl=tone.at("hsl");
        if((!cb.is_null()&&!cb.is_object())||(!hsl.is_null()&&!hsl.is_object()))throw std::runtime_error("RAW colour: expected an object");
        const char* names[]={"master","shadows","midtones","highlights"};
        for(size_t i=0;i<4;i++){
            const auto& z=cb.at(names[i]);if(!z.is_null()&&!z.is_object())throw std::runtime_error("RAW colour: invalid balance zone");
            zones[i]={number(z,"hue",360),number(z,"saturation",1),number(z,"luminance",1)};
            balance_active|=zones[i][1]!=0||zones[i][2]!=0;
        }
        const char* colors[]={"red","orange","yellow","green","aqua","blue","purple","magenta"};
        for(size_t i=0;i<8;i++){
            const auto& z=hsl.at(colors[i]);if(!z.is_null()&&!z.is_object())throw std::runtime_error("RAW colour: invalid HSL band");
            bands[i]={number(z,"hue",30),number(z,"saturation",100)/100,number(z,"luminance",100)/100};
            for(double v:bands[i])hsl_active|=v!=0;
        }
    }
    static double encode(double v){return v<1./512?16*v:std::pow(v,1./1.8);}
    static double decode(double v){return v<1./32?v/16:std::pow(v,1.8);}
    std::array<double,3> apply(std::array<double,3> linear) const {
        if(!balance_active&&!hsl_active)return linear;
        std::array<double,3> c={encode(linear[0]),encode(linear[1]),encode(linear[2])};
        if(balance_active){
            const double l=.2126*c[0]+.7152*c[1]+.0722*c[2],mid=.3857;
            const double p=std::clamp(l<=mid?.5*l/mid:.5+.5*(l-mid)/(1-mid),0.,1.),ws=(1-p)*(1-p),wh=p*p;
            const double weights[]={1,ws,std::max(0.,1-ws-wh),wh};double gain=1;
            for(size_t z=0;z<4;z++)gain+=weights[z]*zones[z][2]*.25;
            constexpr double pi=3.14159265358979323846;
            for(size_t ch=0;ch<3;ch++){double offset=0;for(size_t z=0;z<4;z++)offset+=weights[z]*std::cos(zones[z][0]*pi/180-2*pi*ch/3)*zones[z][1]*.25;c[ch]=(c[ch]+offset)*gain;}
        }
        if(hsl_active){
            // Extend the HSL interval over negative/HDR values instead of clipping.
            const double low=std::min(0.,*std::min_element(c.begin(),c.end())),high=std::max(1.,*std::max_element(c.begin(),c.end())),span=high-low;
            std::array<double,3> n;for(size_t ch=0;ch<3;ch++)n[ch]=(c[ch]-low)/span;
            const double hi=*std::max_element(n.begin(),n.end()),lo=*std::min_element(n.begin(),n.end()),d=hi-lo;
            if(d>1e-9){
                double h=std::fmod((hi==n[0]?(n[1]-n[2])/d:hi==n[1]?(n[2]-n[0])/d+2:(n[0]-n[1])/d+4)*60+360,360),l=(hi+lo)/2,s=d/std::max(1e-9,1-std::abs(2*l-1));
                const double centers[]={0,30,60,120,180,240,270,300};std::array<double,3> delta{};double total=0;
                for(size_t i=0;i<8;i++){double distance=std::fmod(h-centers[i]+540,360)-180;
                    double width=distance<0?std::fmod(centers[i]-centers[(i+7)%8]+360,360):std::fmod(centers[(i+1)%8]-centers[i]+360,360);
                    double w=std::max(0.,1-std::abs(distance)/width);total+=w;for(size_t ch=0;ch<3;ch++)delta[ch]+=w*bands[i][ch];}
                const double chroma=std::clamp(s/.15,0.,1.)/std::max(total,1e-9);
                h=std::fmod(h+delta[0]*chroma+360,360);s=std::clamp(s*(1+delta[1]*chroma),0.,1.);l=std::clamp(l+.25*delta[2]*chroma,0.,1.);
                const double cc=(1-std::abs(2*l-1))*s,x=cc*(1-std::abs(std::fmod(h/60,2)-1)),m=l-cc/2;
                n=h<60?std::array<double,3>{cc,x,0}:h<120?std::array<double,3>{x,cc,0}:h<180?std::array<double,3>{0,cc,x}:h<240?std::array<double,3>{0,x,cc}:h<300?std::array<double,3>{x,0,cc}:std::array<double,3>{cc,0,x};
                for(size_t ch=0;ch<3;ch++)c[ch]=low+span*(n[ch]+m);
            }
        }
        for(size_t ch=0;ch<3;ch++)linear[ch]=decode(c[ch]);return linear;
    }
};
}
