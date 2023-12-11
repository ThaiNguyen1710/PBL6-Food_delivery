import { motion } from "framer-motion";
import React from "react";
import { FaDongSign } from "react-icons/fa6";
import { buttonClick } from "../../animations";
import { BsFillBasket2Fill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { addNewItemToCart, baseURL, getAllCartItems } from "../../api";
import {
  alertDanger,
  alertNULL,
  alertSuccess,
} from "../../context/actions/alertActions";
import { setCartItems } from "../../context/actions/cartAction";
import { useNavigate } from "react-router-dom"; 

const SliderCard = ({ data, index }) => {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigateToProduct = () => {
    navigate(`/product/${data.id}`); 
  };

  const sendToCart = async () => {
    try {
      const newData = {
        product: data.id,
        user: user.user.userId,
      };
      console.log("New Data:", newData);
      const addedItem = await addNewItemToCart(newData);

      if (addedItem) {
        dispatch(alertDanger("Failed to add to cart"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      } else {
        dispatch(alertSuccess("Added to the cart"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
        const allCartItems = await getAllCartItems();
        if (allCartItems) {
          dispatch(setCartItems(allCartItems));
        }
      }
    } catch (error) {
      dispatch(alertDanger("Failed to add to cart"));
    }
  };
  return (
    <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-between relative px-4 py-2 w-full md:w-340 md:min-w-350 md:h-225 gap-3">
      <img
        alt=""
        src={baseURL + data.image}
        className="w-40 h-40 object-contain"
        onClick={navigateToProduct}
      />
      <div className="relative pt-8">
        <p className="text-xl text-center text-headingColor font-semibold">{data.name}</p>
        <p className=" text-lg font-semibold text-red-500 flex items-center justify-center gap-1">
          {parseFloat(data.price).toLocaleString("vi-VN")}
          <FaDongSign className="text-red-500" />{" "}
        </p>
        <p className="text-sm font-normal text-textColor text-center">
          {data.description}
        </p>
        <div className="flex gap-2">
          <p className="text-sm font-semibold text-black">Store: </p>
        <p className="text-sm font-normal text-textColor text-center">
        {" "} {data.user.store}
        </p>
        </div>
        
        <p className="text-sm font-normal text-textColor ">
           {data.user.address}
        </p>

        <motion.div
          {...buttonClick}
          onClick={sendToCart}
          className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center absolute -top-2 right-2 cursor-pointer"
        >
          <BsFillBasket2Fill className="text-2xl text-primary" />
        </motion.div>
      </div>
    </div>
  );
};

export default SliderCard;
