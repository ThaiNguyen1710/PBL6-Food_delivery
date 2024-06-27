import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/bundle";
import "../../assets/css/swiperStyles.css";
import { useDispatch, useSelector } from "react-redux";
import SliderCard from "./SliderCard";
import { getAllOrders } from "../../api";
import { setOrders } from "../../context/actions/orderAction";

const Slider = () => {
  const products = useSelector((state) => state.products);
  const user = useSelector((state) => state.user);
  const orders = useSelector((state) => state.orders);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!orders) {
      getAllOrders().then((data) => {
        dispatch(setOrders(data));
      });
    }
  }, [orders, dispatch]);

  useEffect(() => {
    if (orders && user && user.user) {
      const userOrder = orders.filter((order) => order.user.id === user.user.userId);
      const productUser = userOrder.flatMap((order) => order.orderLists.map((item) => item.product));

      const productFrequency = {};
      productUser.forEach((product) => {
        if (productFrequency[product.id]) {
          productFrequency[product.id]++;
        } else {
          productFrequency[product.id] = 1;
        }
      });

      const sortedProducts = Object.keys(productFrequency).sort(
        (a, b) => productFrequency[b] - productFrequency[a]
      );

      if (products && sortedProducts.length > 0) {
        const topProducts = sortedProducts.slice(0, 10).map(id =>
          products.find(product => product.id === id)
        );
        setRecommendedProducts(topProducts);
      }
    }
  }, [products, orders, user]);

  return (
    <div className="w-full pt-12">
      <Swiper
        slidesPerView={4}
        centeredSlides={false}
        spaceBetween={30}
        grabCursor={true}
        className="mySwiper"
      >
        {recommendedProducts &&
          recommendedProducts.map((data, i) => (
            <SwiperSlide key={i}>
              <SliderCard key={i} data={data} index={i} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default Slider;
