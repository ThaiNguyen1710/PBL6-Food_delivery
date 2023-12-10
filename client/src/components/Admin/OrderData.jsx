import { motion } from "framer-motion";
import React from "react";
import { buttonClick, staggerFadeInOut } from "../../animations";
import { FaDongSign } from "react-icons/fa6";
import { baseURL, getAllOrders, updatedOrderSts } from "../../api";
import { useDispatch } from "react-redux";
import { setOrders } from "../../context/actions/orderAction";

const OrderData = ({ index, data, admin }) => {
  const dispatch = useDispatch();

  const handleClick = (orderId, status) => {
    console.log(orderId);
    updatedOrderSts(orderId).then((res) => {
      getAllOrders().then((data) => {
        dispatch(setOrders(data));
      });
    });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Sử dụng hàm formatDate với data.dateOrdered
  const formattedDate = formatDate(data.dateOrdered);

  return (
    <motion.div
      {...staggerFadeInOut(index)}
      className="w-full flex flex-col items-start justify-start px-3 py-2 border relative border-gray-300 bg-cardOverlay drop-shadow-md rounded-md gap-4"
    >
      <div className="w-full flex items-center justify-between">
        <h1 className="text-xl text-headingColor font-semibold">Order</h1>
        <div className="flex items-center gap-4">
          <p className="flex items-center gap-1 text-textColor">
            Total:
            <span className="text-headingColor font-bold">
              {parseFloat(data?.totalPrice).toLocaleString("vi-VN")}
            </span>
            <FaDongSign className="text-lg text-red-500" />
          </p>
          {/* <p className="px-2 py-[2px] text-sm text-headingColor font-semibold capitalize rounded-md bg-emerald-400 drop-shadow-md">
            {data?.status}
          </p> */}
          <p
            className={`text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md ${
              (data.status === "Pending" && "text-orange-500 bg-orange-100") ||
              (data.status === "Cancelled" && "text-red-500 bg-red-100") ||
              (data.status === "Delivered" && "text-emerald-500 bg-emerald-100")
            }`}
          >
            {data?.status}
          </p>
          {admin && (
            <div className="flex items-center justify-center gap-2">
              <p className="text-lg font-semibold text-headingColor">Mark As</p>
              <motion.p
                {...buttonClick}
                onClick={() => handleClick(data._id, "Preparing")}
                className={`text-orange-500 text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md cursor-pointer`}
              >
                Preparing
              </motion.p>
              <motion.p
                {...buttonClick}
                onClick={() => handleClick(data._id, "Cancelled")}
                className={`text-red-500 text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md cursor-pointer`}
              >
                Cancelled
              </motion.p>
              <motion.p
                {...buttonClick}
                onClick={() => handleClick(data._id, "Delivered")}
                className={`text-emerald-500 text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md cursor-pointer`}
              >
                Delivered
              </motion.p>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-start flex-wrap w-full">
        <div className="flex items-center justify-start w-full gap-4">
          <h1 className="text-xl font-semibold text-red-500 -mt-2">
            {data.shippingAddress2} {">>"} 
          </h1>
        </div>
      </div>
      <div className="flex items-center justify-start flex-wrap w-full">
        <div className="flex items-center justify-center gap-4">
          {data?.orderLists &&
            data.orderLists.map((item, j) => (
              <motion.div
                {...staggerFadeInOut(j)}
                key={j}
                className="flex items-center justify-center gap-1"
              >
                <img
                  src={baseURL +item.product.image}
                  alt=""
                  className="w-10 h-10 object-contain"
                />
                <div className="flex items-start flex-col">
                  <p className="text-base font-semibold text-headingColor">
                    {item.product.name}
                  </p>
                  <p className="flex items-start gap-2">
                    {" "}
                    Quantity: {item.quantity}
                  </p>
                  <p className="flex items-center gap-1 text-textColor">
                    {parseFloat(item.product.price).toLocaleString("vi-VN")}
                    <FaDongSign className="text-red-400" />
                  </p>
                </div>
              </motion.div>
            ))}
        </div>
        <div className="flex items-start justify-start flex-col gap-2 px-6 ml-auto w-full md:w-460">
          
          <h1 className="text-lg text-headingColor -mt-2">
            {data.user.name} - {data.phone}
          </h1>
          <div className="flex ">
            <p className="text-base font-semibold text-headingColor -mt-2">
              Giao hàng đến:
            </p>
            <p className="text-base text-textColor -mt-2">
              <span>&nbsp;</span>
              {data.shippingAddress1}
            </p>
          </div>

          <div className="flex ">
            <p className="text-base font-semibold text-headingColor -mt-2">
              Thời gian hoàn thành:
            </p>
            <p className="text-base text-textColor -mt-2">
              <span>&nbsp;</span>
              {formattedDate}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderData;
