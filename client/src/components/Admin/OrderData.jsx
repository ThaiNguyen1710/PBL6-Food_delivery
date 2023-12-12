import { motion } from "framer-motion";
import React, { useState } from "react";
import { staggerFadeInOut } from "../../animations";
import { FaDongSign, FaStar } from "react-icons/fa6";
import { baseURL, ratingProduct, updatedOrder } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { alertNULL, alertSuccess } from "../../context/actions/alertActions";

const OrderData = ({ index, data, admin }) => {
  const allUser = useSelector((state) => state.allUsers);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  console.log(data);
  const store = allUser
    ? allUser.filter((store) => store.store === data.shippingAddress2)
    : [];

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

  const [rated, setRated] = useState(
    localStorage.getItem(`rated_${data._id}`) === "true"
  );

  const [rating, setRating] = useState(
    localStorage.getItem(`rating_${data._id}`) || 0
  );

  const handleRating = async (orderId, productId) => {
    try {
      for (const item of data.orderLists) {
        const orderDataWithRating = {
          order: orderId,
          product: item.product.id,
          quantity: rating,
          user: user.user.userId,
          comment: "Default comment",
        };
        const ratedData = await ratingProduct(orderDataWithRating);
        if (!ratedData) {
          dispatch(alertSuccess("Đánh giá thành công!"));
          setTimeout(() => {
            dispatch(alertNULL());
          }, 3000);
        }
      }

      setRated(true);
      localStorage.setItem(`rated_${orderId}`, true);
      const newDataForOrder = {
        isRate: true,
      };
      const updatedOrderData = await updatedOrder(orderId, newDataForOrder);
      console.log(updatedOrderData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      {...staggerFadeInOut(index)}
      className="w-full flex flex-col items-start justify-start px-3 py-2 border relative border-gray-300 bg-cardOverlay drop-shadow-md rounded-md gap-4"
    >
      <div className="w-full flex items-center justify-between">
        <h1 className="text-xl text-headingColor font-semibold">Order</h1>
        <div className="flex items-center gap-4">
          <p className="flex items-center gap-1 text-textColor">
            Thanh toán:{" "}
            {data?.isPay ? (
              <span className=" font-bold text-teal-400">PayPal</span>
            ) : (
              <span className="font-bold text-emerald-500">Tiền Mặt</span>
            )}
          </p>
          <p className="flex items-center gap-1 text-textColor">
            Total:
            <span className="text-headingColor font-bold">
              {parseFloat(data?.totalPrice * 1000).toLocaleString("vi-VN")}
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
            {data?.status}
          </p>

          <div>
            {data.isRate ? (
              <div className="flex justify-center items-center gap-1 text-base font-normal">
                Đã đánh giá: 
                <p className=" font-bold text-headingColor">{rating}{" "}</p>
                <FaStar className="text-orange-400 text-base font-normal" />
              </div>
            ) : (
              <div className="not-rated-content">
                <div className=" justify-center items-center text-xl ">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => {
                        setRating(star);
                        localStorage.setItem(`rating_${data._id}`, star);
                      }}
                      style={{
                        cursor: "pointer",
                        color: star <= rating ? "orange" : "gray",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {!rated && (
                  <motion.button
                    onClick={() =>
                      handleRating(data._id, data.orderLists[0].product.id)
                    }
                    className="text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md text-orange-400"
                  >
                    Đánh giá
                  </motion.button>
                )}
                {rated && (
                  <div className="flex justify-center items-center gap-1 text-base font-normal">
                    Đã đánh giá: {rating}{" "}
                    <FaStar className="text-orange-400 text-base font-normal" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-start flex-wrap w-full">
        <div className="flex items-center justify-start w-full gap-4">
          <h1 className="text-xl font-semibold text-red-500 -mt-2">
            {data.shippingAddress2} {">>"} {store?.[0]?.address}
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
                  src={baseURL + item.product.image}
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
        <div className="flex items-start justify-start flex-col gap-2 ml-auto w-full md:w-508">
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
            <p className="text-base text-rose-600 -mt-2">
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
