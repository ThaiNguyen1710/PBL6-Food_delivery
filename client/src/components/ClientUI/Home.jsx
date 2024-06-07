import { motion } from "framer-motion";
import React from "react";
import { delivery, heroBg } from "../../assets";
import { buttonClick, staggerFadeInOut } from "../../animations";
import { randomData } from "../../utils/styles";
import { FaDongSign } from "react-icons/fa6";

const Home = () => {
  return (
    <motion.div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className=" flex flex-col items-start justify-start gap-6">
        <div className="px-4 py-1 flex items-center justify-center gap-2 rounded-full bg-orange-200">
          <div className="text-lg font-semibold text-orange-500">
            Giao Hàng Tận Nơi
          </div>
          <div className="w-10 h-10 flex  bg-slate-100 rounded-full items-center justify-center">
            <img
              src={delivery}
              alt=""
              className="w-full h-full object-contain shadow-sm"
            />
          </div>
        </div>
        <p className="text-5xl text-headingColor md:text-4xl font-extrabold  tracking-wider">
          Giao hàng nhanh chóng tại{"  "}
          <span className="text-orange-500">Đà Nẵng</span>
        </p>
        <p className="text-textColor text-lg">
          Sử dụng App EatEase để có nhiều giảm giá và trải nghiệm tốt hơn
        </p>
        <motion.button
          {...buttonClick}
          className="bg-gradient-to-bl from-orange-400 to-orange-600 px-4 py-2 rounded-xl text-black text-base font-semibold "
        >
          Đặt Hàng Ngay
        </motion.button>
      </div>
      <div className="py-2  flex-1 flex items-center justify-center relative">
        <img
          alt=""
          src={heroBg}
          className="absolute top-0 left-0 w-full h-full md:w-full md:h-full"
        />
        <div className="w-full md:w-656  grid grid-cols-1 md:grid-cols-3 sm:grid-cols-3 items-center justify-start  gap-4 gap-y-14">
          {randomData &&
            randomData.map((data, i) => (
              <motion.div
                {...staggerFadeInOut(i)}
                key={i}
                className=" w-16 h-36 md:h-auto md:w-auto p-4 sm:w-auto  bg-cardOverlay backdrop-blur-md rounded-3xl flex flex-col items-center justify-center drop-shadow-lg"
              >
                <img
                  src={data.product_image}
                  className="w-12 h-12 md:w-32 md:h-32 md:-mt-16 object-contain"
                  alt=""
                />
                <p className="text-sm lg:text-xl font-semibold text-textColor">
                  {data.product_name.slice(0, 14)}
                </p>
                <p className="text-[12px] text-center md:text-base  font-semibold text-lighttextGray capitalize">
                  {data.product_category}
                </p>
                <p className="text-sm   font-semibold text-headingColor flex ">
                  {data.product_price}{" "}
                  <FaDongSign className="text-xs text-red-600" />
                </p>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
