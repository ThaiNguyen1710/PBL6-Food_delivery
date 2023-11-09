import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { buttonClick, slideIn, staggerFadeInOut } from "../animations";
import { BiChevronsRight } from "react-icons/bi";
import { FcClearFilters } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { setCartOff } from "../context/actions/displayCartAction";
import { useState } from "react";
import { FaDongSign } from "react-icons/fa6";
import { alertNULL, alertSuccess } from "../context/actions/alertActions";
import { getAllCartItems, incrementItemQuantity } from "../api";
import { setCartItems } from "../context/actions/cartAction";
const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    let total = 0;
    if (Cart) {
      cart.map((data) => {
        total = total + data.product_price * data.quantity;
        setTotal(total);
      });
    }
  });

  return (
    <motion.div
      {...slideIn}
      className="fixed z-50 -top-10 right-0 w-300 md:w-508 bg-cardOverlay backdrop-blur-md shadow-md h-screen"
    >
      <div className="w-full flex items-center justify-between py-4 pb-8 px-3">
        <motion.i
          {...buttonClick}
          onClick={() => dispatch(setCartOff())}
          className="cursor-pointer"
        >
          <BiChevronsRight className="text-[50px] text-textColor" />
        </motion.i>
        <p className="text-2xl text-headingColor font-semibold">Giỏ Hàng</p>
        <motion.i className="cursor-pointer" {...buttonClick}>
          <FcClearFilters className="text-[30px] text-headingColor" />
        </motion.i>
      </div>
      <div className=" flex-1 flex flex-col w-full items-start justify-start rounded-t-3xl bg-zinc-900 h-full py-6 gap-3 relative">
        {cart && cart?.length > 0 ? (
          <>
            <div className=" flex flex-col w-full items-start justify-start gap-3 h-[65%] overflow-y-scroll scrollbar-none px-4">
              {cart &&
                cart?.length > 0 &&
                cart?.map((item, i) => (
                  <CartItemCard key={i} index={i} data={item} />
                ))}
            </div>
            <div className="bg-zinc-800 rounded-t-[60px] w-full h-[35%] flex flex-col items-center justify-center px-4 py-6 gap-24">
              <div className=" w-full flex items-center justify-evenly">
                <p className="text-3xl text-zinc-50 font-semibold">Tổng: </p>
                <p className="text-3xl text-orange-500 font-semibold flex items-center justify-center gap-1">
                  {total}
                  <FaDongSign className="text-primary" />
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl text-primary font-bold"> Empty Cart</h1>
          </>
        )}
      </div>
    </motion.div>
  );
};
export const CartItemCard = ({ index, data }) => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const [itemTotal, setItemTotal] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    setItemTotal(data.product_price * data.quantity);
  }, [itemTotal, cart]);

  const decrementCart = (productId) => {
    
    incrementItemQuantity(user?.user_id, productId, "decrement").then(
      (data) => {
        getAllCartItems(user?.user_id).then((items) => {
          dispatch(setCartItems(items));
          dispatch(alertSuccess("Update the cart"));
          setInterval(() => {
            dispatch(alertNULL());
          }, 3000);
        });
      }
    );
  };

  const incrementCart = (productId) => {
   
    incrementItemQuantity(user?.user_id, productId, "increment").then(
      (data) => {
        getAllCartItems(user?.user_id).then((items) => {
          dispatch(setCartItems(items));
          dispatch(alertSuccess("Update the cart"));
          setInterval(() => {
            dispatch(alertNULL());
          }, 3000);
          
        });
      }
    );
  };

  return (
    <motion.div
      key={index}
      {...staggerFadeInOut(index)}
      className="w-full flex items-center justify-start bg-zinc-800 rounded-md drop-shadow-md px-4 gap-4"
    >
      <img
        src={data?.product_image}
        className="w-24 min-w-[94px] h-24 object-contain"
        alt=""
      />
      <div className="flex items-center justify-start gap-1 w-full">
        <p className=" text-lg text-primary font-semibold">
          {data?.product_name}
          <span className=" text-sm block font-semibold text-gray-400 ">
            {data?.product_category}
          </span>
        </p>
        <p className="flex text-sm font-semibold text-red-400 ml-auto">
          {itemTotal}
          <FaDongSign className="text-sm" />
        </p>
      </div>
      <div className=" ml-auto flex items-center justify-center gap-3">
        <motion.div
          {...buttonClick}
          onClick={() => decrementCart(data?.productId)}
          className="w-8 h-8 flex items-center justify-center rounded-md drop-shadow-md bg-zinc-900 cursor-pointer"
        >
          <p className="text-xl font-semibold text-primary">--</p>
        </motion.div>
        <p className=" text-lg text-primary font-semibold">{data?.quantity}</p>
        <motion.div
          {...buttonClick}
          onClick={() => incrementCart(data?.productId)}
          className="w-8 h-8 flex items-center justify-center rounded-md drop-shadow-md bg-zinc-900 cursor-pointer"
        >
          <p className="text-xl font-semibold text-primary">+</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;
