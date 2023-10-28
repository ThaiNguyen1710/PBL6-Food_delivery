import { motion } from "framer-motion";
import React from "react";
import { delivery, heroBg } from "../../assets";
import { buttonClick } from "../../animations";

const Home = () => {
  return (
    <motion.div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className=" flex  flex-col items-start justify-start gap-6">
        <div className="px-4 py-1 flex items-center justify-center gap-2 rounded-full bg-orange-200">
          <div className="text-lg font-semibold text-orange-500">
            Free Delivery
          </div>
          <div className="w-10 h-10 flex  bg-slate-100 rounded-full items-center justify-center">
            <img
              src={delivery}
              alt=""
              className="w-full h-full object-contain shadow-sm"
            />
          </div>
        </div>
        <p className="text-6xl text-headingColor md:text-5xl font-extrabold ">
          Giao hàng nhanh chóng tại{"  "}
          <span className="text-orange-500">Đà Nẵng</span>
        </p>
        <p className="text-textColor text-lg">
          Sử dụng App 6Food để có nhiều giảm giá và trải nghiệm tốt hơn
        </p>
        <motion.button  {...buttonClick} className="bg-gradient-to-bl from-orange-400 to-orange-600 px-4 py-2 rounded-xl text-black text-base font-semibold ">
            Order Now
        </motion.button>
      </div>
      <div className="py-2 flex-1 flex items-center justify-end relative">
        <img alt="" src={heroBg} className="absolute top-0 right-0 md:-right-12 w-full h-420 md:w-auto md:h650" />
      </div>
    </motion.div>
  );
};

export default Home;
