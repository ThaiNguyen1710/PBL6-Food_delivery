import React from "react";
import { FaStar } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";
import { baseURL } from "../../api";
import { useNavigate } from "react-router-dom";
import { buttonClick } from "../../animations";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const StoreCard = ({ data }) => {
  const product = useSelector((state) => state.products);
  const productStore = product
    ? product.filter((products) => products.user.id === data.id)
    : [];

  const ratedProducts = productStore
    ? productStore.filter((product) => product.numRated !== 0)
    : [];

  let ratedStore = 0;
  let totalRatings = 0;
  if (ratedProducts.length > 0) {
    let totalPoints = 0;

    ratedProducts.forEach((product) => {
      totalRatings++;

      totalPoints += product.ratings;
    });

    ratedStore = totalPoints / totalRatings;
  }

  const currentDate = new Date();
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const currentTime = `${hours}:${minutes}`;

  const navigate = useNavigate();

  const navigateToStore = () => {
    if (data.openAt <= currentTime && currentTime <= data.closeAt) {
      navigate(`/store/${data.id}`);
    }
  };

  const isClosed = !(data.openAt <= currentTime && currentTime <= data.closeAt);

  return (
    <div
      className={`${
        isClosed ? "closed-store" : ""
      } bg-gray-200 hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center flex-col justify-between relative px-4 py-2 w-full md:w-375 md:min-w-350`}
      onClick={isClosed ? null : navigateToStore}
    >
      {isClosed ? (
        <>
          
          <div className="closed-overlay">
            <div className="font-semibold absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <motion.button
                {...buttonClick}
                className="bg-gradient-to-bl from-red-500 to-red-700 px-8 py-6 rounded-xl text-slate-100 font-semibold  text-2xl"
              >
                Đóng Cửa
              </motion.button>
            </div>
            <img
              alt=""
              src={baseURL + data.imgStore}
              className="w-full h-150 object-contain cursor-pointer opacity-50"
            />
          </div>
        </>
      ) : (
        <>
          <img
            alt=""
            src={baseURL + data.imgStore}
            className="w-full h-150 object-contain cursor-pointer"
          />
        </>
      )}

      <div className="w-full px-2 items-start justify-center">
        <p className="text-xl text-headingColor font-semibold">{data.store} </p>
        <p className="text-sm font-normal text-textColor">{data.address}</p>
      </div>
      <div className="w-full h-[1px] rounded-md bg-gray-500"></div>
      <div className="w-full flex">
        <div className="w-32 flex items-center gap-1">
          <p className="text-xl font-semibold">
            {parseFloat(ratedStore).toFixed(1)}
            
          </p>
          <FaStar className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="w-full flex items-center justify-end gap-1">
          {isClosed ? (
            <>
              <div className="flex w-full">
               
                <p className="text-red-500 font-semibold">
                  Đặt hàng vào ngày mai lúc: {data.openAt}
                </p>
              </div>
            </>
          ) : (
            <>
              {currentTime >= data.openAt && currentTime <= data.closeAt ? (
                <MdAccessTimeFilled className="w-10 h-8 text-green-500" />
              ) : (
                <MdAccessTimeFilled className="w-10 h-8 text-red-500" />
              )}
              {data.openAt} - {data.closeAt}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
