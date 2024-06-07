import React from "react";
import { useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { baseURL } from "../api";

import Header from "./Header";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import { BiChevronsLeft } from "react-icons/bi";
import { MdAccessTimeFilled } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import Cart from "./Cart";
import Footer from "./Footer";
import { IoShieldCheckmark } from "react-icons/io5";
import { TbMinusVertical } from "react-icons/tb";
import { gradientStyle } from "../utils/styles";
import { FaUserCheck } from "react-icons/fa";

import StoreSection from "./Store/StoreSection";
import { FaStar } from "react-icons/fa6";

const StoreDetail = ({ closeStore }) => {
  const { id } = useParams();
  const product = useSelector((state) => state.products);
  const allUser = useSelector((state) => state.allUsers);
  const isCart = useSelector((state) => state.isCart);

  const selectedStore = allUser
    ? allUser.filter((store) => store.id === id)
    : [];
  const productStore = product
    ? product.filter((products) => products.user.id === selectedStore?.[0]?.id)
    : [];

  const ratedProducts = productStore
    ? productStore.filter((product) => product.numRated !== 0)
    : [];

  let ratedStore = 0;
  let totalRatings = 0;
  let numRated = 0;
  if (productStore.length > 0) {
    productStore.forEach((product) => {
      numRated += product.numRated;
    });
  }
  if (ratedProducts.length > 0) {
    let totalPoints = 0;

    ratedProducts.forEach((product) => {
      totalRatings++;

      totalPoints += product.ratings;
    });

    ratedStore = totalPoints / totalRatings;
  }

  const productList = product ? product.filter((item) => item.id === id) : [];
  const selectedProduct = productList.length > 0 ? productList[0] : null;

  const userProduct = allUser
    ? allUser.filter((user) => user?.id === selectedProduct?.user?.id)
    : [];

  const currentDate = new Date();
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");

  const currentTime = `${hours}:${minutes}`;

 

  return (
    <div className="w-screen min-h-screen flex justify-start items-center flex-col bg-primary">
      <Header />
      <div className="w-full flex flex-col items-center justify-center mt-32 px-6 md:px-24 2xl:px-40 gap-2 pb-24 ">
        <motion.div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className=" flex items-start justify-start gap-6">
            <motion.button
              {...buttonClick}
              className="bg-gradient-to-bl from-orange-400 to-orange-600 px-2 py-2 rounded-xl text-black text-base font-semibold "
            >
              <NavLink to={"/"} className="flex justify-start">
                <BiChevronsLeft className="text-[50px] text-black" />
                <p className="font-semibold text-3xl text-white mt-2"> Back</p>
              </NavLink>
            </motion.button>

            <img
              alt=""
              src={baseURL + selectedStore?.[0]?.imgStore}
              className="w-[80%] h-420 object-contain"
            ></img>
          </div>
          <div className=" flex flex-col items-center justify-start gap-16 ">
            <div className="w-508 h-370  items-center justify-center pt-8">
              <div className="text-blue-500 font-normal">
                <NavLink to={"/"}>Home &gt;&gt; </NavLink>
                <span className="text-blue-500 font-normal">
                  {selectedStore?.[0]?.store}
                </span>
                {" >> "}
                <span>{selectedStore?.[0]?.address}</span>
              </div>
              <div className=" pb-8 pt-8">
                <p className="text-5xl font-semibold">
                  {selectedStore?.[0]?.store}
                </p>
                <p className="text-xl text-gray-500 font-normal">
                  {selectedStore?.[0]?.address}
                </p>
                <div className="pt-6 flex items-center gap-1">
                  <p className="text-xl font-semibold">
                    {parseFloat(ratedStore).toFixed(1)}
                  </p>
                  <FaStar className="w-6 h-6 text-yellow-400" />
                  <motion.button
                    {...buttonClick}
                    className=" flex  items-center  gap-1 bg-gradient-to-bl from-orange-400 to-orange-600 px-2 py-1 rounded-xl text-black text-base font-semibold "
                  >
                    <FaUserCheck className="w-8 h-8 text-slate-100" />
                   {numRated} +
                  </motion.button>
                  <p className="text-lg font-normal ">{" "}đánh giá trên EatEase</p>
                </div>
              </div>
              <div className="gap-12 pb-8">
                <div className="text-xl font-normal flex items-center">
                  {currentTime >= selectedStore?.[0]?.openAt &&
                  currentTime <= selectedStore?.[0]?.closeAt ? (
                    <>
                      <GoDotFill className="text-xl text-green-500" />
                      <span className="text-xl font-semibold">
                        Mở Cửa <span>&nbsp;</span>{" "}
                      </span>
                      <div></div>
                      <MdAccessTimeFilled className="w-8 h-6 text-emerald-400" />
                    </>
                  ) : (
                    <MdAccessTimeFilled className="w-10 h-8 text-red-500" />
                  )}
                  {selectedStore?.[0]?.openAt} : {selectedStore?.[0]?.closeAt}
                </div>
                <p className="text-xl font-medium pb-6">
                  {userProduct?.[0]?.address}
                </p>

                <div className="w-[80%] h-[1px] rounded-md bg-gray-500 "></div>
                <div className=" w-full gap-6 flex items-center">
                  <motion.button
                    {...buttonClick}
                    className=" flex  items-center  gap-1 bg-gradient-to-bl from-amber-200 to-amber-400 px-2 py-1 rounded-xl text-black text-base font-semibold "
                  >
                    <IoShieldCheckmark className="w-8 h-8 text-slate-100" />
                    Quán đối tác
                  </motion.button>
                  <TbMinusVertical className="text-headingColor text-5xl" />
                  <div className=" w-auto h-full items-center justify-center">
                    <p className="text-base text-center font-normal text-slate-500 ">
                      Dịch vụ bởi
                    </p>
                    <p className="font-semibold text-3xl" style={gradientStyle}>
                      EatEase
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <StoreSection data={selectedStore} />
      </div>
      {isCart && <Cart />}
      <Footer />
    </div>
  );
};

export default StoreDetail;
