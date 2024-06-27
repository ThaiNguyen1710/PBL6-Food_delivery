import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { buttonClick, staggerFadeInOut } from "../../animations";
import { FaDongSign, FaStar } from "react-icons/fa6";
import {
  baseURL,
  getAllOrders,
  getAllShipper,
  getAllUsers,
  ratingProduct,
  updatedOrder,
} from "../../api";
import { useDispatch, useSelector } from "react-redux";
import {
  alertInfo,
  alertNULL,
  alertSuccess,
} from "../../context/actions/alertActions";
import { avatar, delivery, shipperCome } from "../../assets";
import { setAllUserDetail } from "../../context/actions/allUsersAction";
import { setOrders } from "../../context/actions/orderAction";
import axios from "axios";
import { setAllShipper } from "../../context/actions/allShipperAction";

const OrderData = ({ index, data, admin }) => {
  const allUser = useSelector((state) => state.allUsers);
  const shipper = useSelector((state) => state.shipper);
  const user = useSelector((state) => state.user);
  console.log(data);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUsersAndOrders = async () => {
      if (!allUser) {
        const users = await getAllUsers();
        dispatch(setAllUserDetail(users));
      }
      if (!shipper) {
        const shippers = await getAllShipper();
        dispatch(setAllShipper(shippers));
      }
      if (!data) {
        const orders = await getAllOrders();
        dispatch(setOrders(orders));
      }
    };

    fetchUsersAndOrders();
  }, [allUser, data, dispatch, shipper]);

  const store = allUser
    ? allUser.filter((store) => store.address === data.shippingAddress2)
    : [];
  const totalPrice = data
    ? data.orderLists.reduce(
        (acc, curr) => acc + curr.quantity * curr.product.price,
        0
      ) + 15000
    : 0;

    const shippers = shipper && data.shipper 
    ? shipper.filter((shipper) => shipper.id === data.shipper.id)
    : [];

  console.log(shippers);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formattedDate = formatDate(data.dateOrdered);

  const [rated, setRated] = useState(false);

  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState("");

  const handleRating = async (orderId, productId) => {
    try {
      for (const item of data.orderLists) {
        const orderDataWithRating = {
          order: orderId,
          product: item.product.id,
          quantity: rating,
          user: user.user.userId,
          comment: comment,
        };
        const ratedData = await ratingProduct(orderDataWithRating);
        console.log(ratedData);
        if (!ratedData) {
          dispatch(alertSuccess("Đánh giá thành công!"));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        }
      }
      setComment(comment);
      setRated(true);
      setRating(rating);

      const newDataForOrder = {
        isRate: true,
        ratings: rating,
        mess: comment,
      };
      const updatedOrderData = await updatedOrder(orderId, newDataForOrder);
      console.log(updatedOrderData);
    } catch (error) {
      console.log(error);
    }
  };
  if (!data || !data.user || !data.user.name) {
    return null;
  }

  const checkOutByPayPal = async () => {
    try {
      const orderId = data?.id;
      console.log(orderId);
      if (orderId) {
        getAllOrders().then((data) => {
          dispatch(setOrders(data));
        });

        setTimeout(async () => {
          try {
            const paymentResponse = await axios.post(
              `${baseURL}/pbl6/paypal/${orderId}`
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

        dispatch(alertInfo("Đang chuyển hướng!"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <motion.div
      {...staggerFadeInOut(index)}
      className="w-full flex flex-col items-start justify-start px-2 py-1 border relative border-gray-300 bg-cardOverlay drop-shadow-md rounded-md gap-1"
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex w-[60%] items-center gap-2 -mt-2">
          {" "}
          <motion.img
            src={baseURL + store?.[0]?.imgStore}
            className="w-16 h-full object-contain"
          />
          <div className="w-full">
            <h1 className="text-lg font-semibold text-red-500 ">
              {store?.[0]?.store}
            </h1>
            <p className="text-base text-textColor"> {data.shippingAddress2}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="flex items-center gap-1 text-textColor">
            Thanh toán:{" "}
            {data?.isPay === true && data?.payed === true ? (
              <span className="font-bold text-teal-400">PayPal</span>
            ) : data?.isPay === true && data?.payed === false ? (
              <span className="font-bold text-teal-400">
                PayPal{" "}
                <span className="font-bold text-red-500">
                  (Chưa thanh toán)
                </span>
                <motion.button
                  {...buttonClick}
                  className="bg-gradient-to-bl from-orange-400 to-orange-500 py-2 px-2 rounded-xl text-black text-base font-semibold flex items-center justify-start"
                  onClick={checkOutByPayPal}
                >
                  Thanh toán lại
                </motion.button>
              </span>
            ) : data?.isPay === false ? (
              <span className="font-bold text-emerald-500">Tiền Mặt</span>
            ) : (
              <span className="font-bold">Một trạng thái khác</span>
            )}
          </p>

          <p className="flex items-center gap-1 text-textColor">
            Total:
            <span className="text-headingColor font-bold">
              {parseFloat(totalPrice).toLocaleString("vi-VN")}
            </span>
            <FaDongSign className="text-lg text-red-500" />
          </p>

          <p
            className={`text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md ${
              (data.status === "Pending" && "text-orange-500 bg-orange-100") ||
              (data.status === "Shipping" && "text-red-500 bg-red-100") ||
              (data.status === "Done" && "text-emerald-500 bg-emerald-100")
            }`}
          >
            {data?.status === "Pending"
              ? "Đang Chờ"
              : data?.status === "Shipping"
              ? "Đang Giao"
              : data?.status === "Done"
              ? "Hoàn Thành"
              : data?.status}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-start flex-wrap w-full">
        <div className="flex items-center justify-start w-full gap-3"></div>
      </div>
      <motion.div className="w-full flex gap-2 flex-wrap">
        <div
          className="flex md:w-300 flex-wrap items-center justify-start gap-1 px-2 py-1 col-1"
          style={{
            flex: "0 0 calc(35% - 8px)",
          }}
        >
          {data?.orderLists &&
            data.orderLists.map((item, j) => (
              <motion.div
                {...staggerFadeInOut(j)}
                key={j}
                className="flex items-center justify-center gap-1"
              >
                <img
                  src={baseURL + item.product.image}
                  alt=""
                  className="w-6 h-6 object-contain "
                />
                <div className="flex items-start flex-col">
                  <p className="text-sm font-semibold text-headingColor">
                    {item.product.name}
                  </p>
                  <p className="flex items-start gap-1 text-sm ">
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
        <div className="flex items-start justify-center flex-col gap-1  w-full md:w-508">
          <h1 className="text-lg text-headingColor -mt-1">
            {data.user.name} - {data.phone}
          </h1>
          <div className="flex ">
            <p className="text-base font-semibold text-headingColor -mt-1">
              Giao hàng đến:
            </p>
            <p className="text-base text-textColor -mt-1">
              <span>&nbsp;</span>
              {data.shippingAddress1}
            </p>
          </div>

          <div className="flex ">
            <p className="text-base font-semibold text-headingColor -mt-1">
              Thời gian hoàn thành:
            </p>
            <p className="text-base text-rose-600 -mt-1">
              <span>&nbsp;</span>
              {formattedDate}
            </p>
          </div>
        </div>
        <div className="w-full h-auto md:w-225 justify-center items-center">
          {data.status === "Pending" && (
            <>
              <div className="flex items-center justify-center ">
                <motion.img
                  src={delivery}
                  className="w-16 h-20 object-contain"
                />
                <p className="text-base font-semibold text-headingColor">
                  Tài xế đang lấy đơn
                </p>
              </div>
            </>
          )}
          {data.status === "Shipping" && (
            <>
              <div className="flex items-center justify-center gap-2 ">
                <motion.img  src={baseURL + shippers[0].image} className="w-12 h-12 object-cover rounded-full" />
                <div className="items-center justify-center">
                  <p className="text-base font-semibold text-headingColor">
                    {data.shipper.name}
                  </p>
                  <p className="text-sm font-semibold text-gray-400">
                    {data.shipper.phone} - {data.shipper.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center ">
                <motion.img
                  src={shipperCome}
                  className="w-24 h-30 object-contain"
                />
                <p className="text-base font-semibold text-headingColor">
                  Tài xế đang đến!
                </p>
              </div>
            </>
          )}
          {data.status === "Done" &&
            (data.isRate ? (
              <>
                {" "}
                <div className="flex justify-center items-center gap-1 text-base font-normal">
                  Đã đánh giá:
                  <p className=" font-bold text-headingColor">
                    {data.ratings}{" "}
                  </p>
                  <FaStar className="text-orange-400 text-base font-normal" />
                </div>
                {data.mess !== "" && data.mess !== null ? (
                  <div className="w-full px-2 py-2 bg-cardOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400 resize-none">
                    {data.mess}
                  </div>
                ) : (
                  <>
                    <div className="w-full px-2 py-2 bg-cardOverlay  text-gray-300 shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400 resize-none">
                      No Comment
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className=" w-full gap-1 text-base font-normal">
                <div className=" justify-center flex items-center text-xl ">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      onClick={() => {
                        setRating(star);
                      }}
                      style={{
                        cursor: "pointer",
                        color: star <= rating ? "orange" : "gray",
                      }}
                    >
                      ★
                    </div>
                  ))}
                </div>
                {!rated && (
                  <>
                    <div className="w-full  items-center justify-center gap-2">
                      <InputContent
                        type="text"
                        placeholder={
                          "Hãy đóng góp ý kiến của bạn cho cửa hàng!"
                        }
                        stateValue={comment}
                        stateFunc={setComment}
                      />
                      <motion.button
                        onClick={() =>
                          handleRating(data._id, data.orderLists[0].product.id)
                        }
                        className="text-base font-semibold hover:bg-gray-200 hover:text-orange-300 border border-gray-300 px-2 py-[2px] rounded-md text-orange-400"
                        {...buttonClick}
                      >
                        Đánh giá
                      </motion.button>
                    </div>
                  </>
                )}
                {rated && (
                  <>
                    {" "}
                    <div className="flex justify-center items-center gap-1 text-base font-normal">
                      Đã đánh giá: {rating}{" "}
                      <FaStar className="text-orange-400 text-base font-normal" />
                    </div>
                    {comment !== "" && comment !== null ? (
                      <div className="w-full px-2 py-2 bg-cardOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400 resize-none">
                        {comment}
                      </div>
                    ) : (
                      <>
                        <div className="w-full px-2 py-2 bg-cardOverlay  text-gray-300 shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400 resize-none">
                          No Comment
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
export const InputContent = ({ type, placeholder, stateValue, stateFunc }) => {
  return (
    <>
      <textarea
        rows={2}
        placeholder={placeholder}
        className="w-full px-2 py-2 bg-cardOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400 resize-none" //
        value={stateValue}
        onChange={(e) => stateFunc(e.target.value)}
      />
    </>
  );
};
export default OrderData;
