import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/bundle";
import "../../assets/css/swiperStyles.css";
import { useSelector } from "react-redux";
import SliderCard from "./SliderCard";

const Slider = () => {
  const products = useSelector((state) => state.products);
  const [randomProducts, setRandomProducts] = useState([]);

  useEffect(() => {
    if (products) {
      const numberOfRandomProducts = 10;

      const randomIndexes = [];
      while (randomIndexes.length < numberOfRandomProducts) {
        const randomIndex = Math.floor(Math.random() * products.length);
        if (!randomIndexes.includes(randomIndex)) {
          randomIndexes.push(randomIndex);
        }
      }

      // Lấy các sản phẩm tương ứng với các index ngẫu nhiên
      const selectedProducts = randomIndexes.map((index) => products[index]);

      setRandomProducts(selectedProducts);
    }
  }, [products]);

  return (
    <div className=" w-full  pt-12">
      <Swiper
        slidesPerView={4}
        centeredSlides={false}
        spaceBetween={30}
        grabCursor={true}
        className="mySwiper"
      >
        {randomProducts &&
          randomProducts.map((data, i) => (
            <SwiperSlide key={i}>
              <SliderCard key={i} data={data} index={i} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default Slider;
