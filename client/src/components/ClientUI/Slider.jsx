import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/bundle";
import "../../assets/css/swiperStyles.css";
import { useSelector } from "react-redux";
import SliderCard from "./SliderCard";

const Slider = () => {
  const products = useSelector((state) => state.products);
  const [fruits, setFruits] = useState(null);
  useEffect(() => {
    setFruits(products?.filter((data) => data.product_category === "Cơm"));
    
  }, [products]);
  return (
    <div className=" w-full pt-12">
      <Swiper
        slidesPerView={3}
        centeredSlides={false}
        spaceBetween={30}
        grabCursor={true}
        className="mySwiper"
      >
        {fruits&&
         fruits.map((data, i) => (
            <SwiperSlide key={i}>
              <SliderCard key={i} data={data} index={i} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default Slider;
