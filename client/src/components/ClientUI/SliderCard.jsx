import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaDongSign } from "react-icons/fa6";
import { buttonClick } from "../../animations";
import { BsFillBasket2Fill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { addNewItemToCart, getAllCartItems } from "../../api";
import { alertNULL, alertSuccess } from "../../context/actions/alertActions";
import { setCartItems } from "../../context/actions/cartAction";
import ProductInfor from "./ProductInfor";
import { BiChevronsRight } from "react-icons/bi";

const SliderCard = ({ data, index }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const sendToCart = () => {
    addNewItemToCart(user?.user_id, data).then((res) => {
      dispatch(alertSuccess("Added to the cart"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      getAllCartItems(user?.user_id).then((items) => {
        dispatch(setCartItems(items));
      });
    });
  };
  const showProduct = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div
      className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-between relative px-4 py-2 w-full md:w-340 md:min-w-350 gap-3"
      onClick={showProduct}
    >
      {showModal && (
        <div className="modal">
          <div className="modal-content">
         
            <motion.i
              {...buttonClick}
              onClick={closeModal}
              className="cursor-pointer"
            >
              <BiChevronsRight className="text-[50px] text-textColor" />
            </motion.i>
            <p>Thông tin sản phẩm</p>
            <ProductInfor />
          </div>
        </div>
      )}
      <img
        alt=""
        src={data.product_image}
        className="w-40 h-40 object-contain"
      />
      <div className="relative pt-12">
        <p className="text-xl text-headingColor font-semibold">
          {data.product_name}
        </p>
        <p className=" text-lg font-semibold text-red-500 flex items-center justify-center gap-1">
          {parseFloat(data.product_price).toLocaleString("vi-VN")}
          <FaDongSign className="text-red-500" />{" "}
        </p>
        <p className="text-sm font-normal text-textColor text-center">
          {data.product_information}
        </p>
        <motion.div
          {...buttonClick}
          onClick={sendToCart}
          className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center absolute -top-4 right-2 cursor-pointer"
        >
          <BsFillBasket2Fill className="text-2xl text-primary" />
        </motion.div>
      </div>
    </div>
  );
};

export default SliderCard;
