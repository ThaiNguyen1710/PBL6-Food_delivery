import React, { useEffect, useState } from "react";
import Header from "./Header";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { buttonClick } from "../animations";
import { BiChevronsLeft } from "react-icons/bi";
import {
  baseURL,
  clearAllCart,
  getAllCartItems,
  getAllOrders,
  handleCheckOut,
  handleCheckOutByMoney,
} from "../api";
import { useDispatch, useSelector } from "react-redux";
import { FaDongSign } from "react-icons/fa6";
import Cart from "./Cart";
import {
  alertInfo,
  alertNULL,
  alertSuccess,
} from "../context/actions/alertActions";
import { setOrders } from "../context/actions/orderAction";
import { BsCashCoin } from "react-icons/bs";
import { paypal } from "../assets";
import { setCartItems } from "../context/actions/cartAction";
import axios from "axios";

const CheckOutSuccess = () => {
  const user = useSelector((state) => state.user);
  const product = useSelector((state) => state.products);
  const cart = useSelector((state) => state.cart);
  const isCart = useSelector((state) => state.isCart);

  const [userCart, setUserCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [shippingFee, setShippingFee] = useState(15000);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const order = cart
    ? cart.filter((item) => item.user.id === user.user.userId)
    : [];
 
  useEffect(() => {
    let total = 0;
    let totalQuantity = 0;
    let totalOrder = 0;

    const filteredCart = cart
      ? cart.filter((item) => item.user.id === user.user.userId)
      : [];
    setUserCart(filteredCart);

    if (filteredCart && filteredCart.length > 0) {
      filteredCart.forEach((data) => {
        total += data.product.price * data.quantity;
        totalOrder = total + shippingFee;
        totalQuantity += data.quantity;
      });

      setTotal(total.toLocaleString("vi-VN"));
      setTotalQuantity(totalQuantity);
      setTotalOrder(totalOrder.toLocaleString("vi-VN"));
    }
  }, [cart, user]);

  if (!product) {
    navigate("/", { replace: true });
  }
  const currentTime = Date.now();
  const estimatedTimes = [15, 20, 30];
  let randomTime;

  if (!randomTime) {
    randomTime =
      estimatedTimes[Math.floor(Math.random() * estimatedTimes.length)];
  }

  const deliveryTime = new Date(currentTime + randomTime * 60 * 1000);

  const checkOutByMoney = async () => {
    try {
      const orderData = {
        user: user.user.userId,
        shippingAddress1: order?.[0]?.user?.address,
        shippingAddress2: order?.[0]?.product?.user?.address,
        totalPrice: totalOrder,
        phone: order?.[0]?.user?.phone,
      };

      const createdOrder = await handleCheckOutByMoney(orderData);

      console.log(createdOrder);

      if (createdOrder) {
        dispatch(alertInfo("Đơn hàng đang được xử lý!"));
        clearAllCart(user?.user?.userId).then((data) => {
          getAllCartItems().then((items) => {
            dispatch(setCartItems(items));
            let totalQuantity = 0;
            setTotalQuantity(totalQuantity);
            setTimeout(() => {
              dispatch(alertNULL());
            }, 3000);
          });
        });

        const allCartItems = await getAllOrders();
        console.log(allCartItems);
        if (allCartItems) {
          dispatch(setOrders(allCartItems));
          dispatch(alertSuccess("Thanh toán hoàn tất! "));
          setTimeout(() => {
           
            // window.location.reload()
            navigate("/user-orders", { replace: true });
          }, 3000);
        }
      } else {
        throw new Error("Failed to update user information");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkOutByPayPal = async () => {
    try {
      const orderData = {
        user: user.user.userId,
        shippingAddress1: order?.[0]?.user?.address,
        shippingAddress2: order?.[0]?.product?.user?.address,
        totalPrice: totalOrder,
        phone: order?.[0]?.user?.phone,
      };

      const createdOrder = await handleCheckOut(orderData);
      console.log(createdOrder);
      if (createdOrder) {
        dispatch(alertInfo("Đơn hàng đang được xử lý!"));
        await clearAllCart(user?.user?.userId);
        const items = await getAllCartItems();
        dispatch(setCartItems(items));
        setTotalQuantity(0);
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);

        const allCartItems = await getAllOrders();
        if (allCartItems) {
          dispatch(setOrders(allCartItems));
          setTimeout(async () => {
            dispatch(alertSuccess("Thanh toan"));
            try {
              const paymentResponse = await axios.post(
                `${baseURL}/pbl6/paypal/${createdOrder.id}`
              );
              console.log(paymentResponse);
              if (
                paymentResponse.data.links &&
                paymentResponse.data.links.length > 0
              ) {
                const redirectLink = paymentResponse.data.links.find(
                  (link) => link.method === "REDIRECT"
                );
                if (redirectLink) {
                  window.open(redirectLink.href, "_blank");
                }
              }
            } catch (err) {
              console.error(err);
            }
          }, 3000);
        }
        navigate("/user-orders", { replace: true });
      } else {
        throw new Error("Failed to update user information");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };
  return (
    <main className="w-screen min-h-screen flex items-center justify-start flex-col bg-primary ">
      <Header />
      <div className="w-screen h-800 flex justify-start items-center flex-col bg-primary">
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
                  <p className="font-semibold text-3xl text-white mt-2">
                    {" "}
                    Back
                  </p>
                </NavLink>
              </motion.button>

              <div className="flex flex-wrap gap-4 pt-16">
                <p className="text-2xl font-semibold">
                  {order?.[0]?.product?.user?.store} {">"}
                </p>
                <p className="text-2xl font-normal">
                  {order?.[0]?.product?.user?.address}
                </p>

                {order.map((item, index) => (
                  <img
                    key={index}
                    alt={`Sản phẩm ${index}`}
                    src={baseURL + item.product.image}
                    className="w-[40%] h-225 object-contain flex"
                  />
                ))}
              </div>
            </div>
            <div className=" flex flex-col items-center justify-start gap-16 ">
              <div className="w-508 h-370  items-center justify-center pt-8">
                <p className="text-blue-500 font-normal">
                  Home {">> "}
                  Order
                </p>
                <div className=" pb-8 pt-8">
                  <p className="text-2xl font-serif">
                    Sản phẩm: {totalQuantity}
                  </p>
                  <p className="text-2xl font-semibold">
                    Đồ ăn | {order.map((item) => item.product.name).join(", ")}{" "}
                    -
                  </p>
                  <p className="text-xl text-gray-500 font-serif flex">
                    Tổng: {total}
                    <FaDongSign className="text-red-500" />{" "}
                  </p>
                </div>
                <div className="gap-12">
                  <p className="text-2xl font-semibold">Giao hàng đến</p>
                </div>
                <p className="text-xl font-semibold text-red-500 flex gap-4">
                  {order?.[0]?.user?.name}
                </p>
                <p className="text-xl font-semibold text-red-500 flex gap-4">
                  {order?.[0]?.user?.address} | {order?.[0]?.user?.phone}
                  <NavLink
                    to="/profile"
                    className="bg-gradient-to-bl from-blue-400 to-yellow-500 px-4 py-1 rounded-xl text-black text-base font-semibold"
                  >
                    Chỉnh sửa
                  </NavLink>
                </p>
                <p className=" text-xl font-normal flex gap-1 pb-12">
                  Thời gian giao: {deliveryTime.toLocaleTimeString()} (
                  {randomTime} phút)
                </p>
                <div className="gap-12 flex">
                  <p className="text-2xl font-semibold">
                    Thanh toán: ({totalQuantity} món)
                  </p>
                  <p className="text-2xl font-semibold">{total}</p>
                </div>
                <div className="gap-32 flex pb-6">
                  <p className="text-2xl font-serif">Phí giao hàng </p>
                  <p className="text-2xl font-serif">15.000</p>
                </div>
                <div className="w-[75%] h-[1px] rounded-md bg-gray-500 "></div>
                <div className="gap-52 flex pt-4 pb-6">
                  <p className="text-2xl font-serif">Tổng </p>
                  <p className="text-2xl font-serif flex">
                    {totalOrder}
                    <FaDongSign className="text-red-500" />{" "}
                  </p>
                </div>
                <div className="flex gap-6 w-full">
                  <motion.button
                    {...buttonClick}
                    className="bg-gradient-to-bl from-orange-400 to-orange-500 px-4 py-2 gap-8 rounded-xl text-black text-base font-semibold flex items-center justify-start "
                    onClick={checkOutByMoney}
                  >
                    <BsCashCoin className="text-3xl text-green-500" />
                    Thanh toán tiền mặt
                  </motion.button>
                  <motion.button
                    {...buttonClick}
                    className="bg-gradient-to-bl from-orange-400 to-orange-500  py-2 px-2 rounded-xl text-black text-base font-semibold flex items-center justify-start "
                    onClick={checkOutByPayPal}
                  >
                    <img
                      alt=""
                      src={paypal}
                      className="object-contain w-24 h-16"
                    />
                    Thanh toán PayPal
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        {isCart && <Cart />}
      </div>
    </main>
  );
};

export default CheckOutSuccess;
