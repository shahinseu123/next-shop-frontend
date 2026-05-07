"use client"; 

import Slider from "react-slick";
import { SliderType } from "@/type/shop";
import { SliderItem } from "./SliderItem";


export default function SimpleSlider({ sliders }: { sliders: SliderType[] }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    dotsClass: "custom-dots",
  };

  return (
    <div>
      <Slider {...settings}>
        {sliders && sliders.length && sliders?.map((slide) => (
          <SliderItem key={slide.id} slide={slide} />
        ))}
      </Slider>
    </div>
  );
}