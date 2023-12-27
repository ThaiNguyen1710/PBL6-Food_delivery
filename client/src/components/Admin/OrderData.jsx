import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { buttonClick, staggerFadeInOut } from "../../animations";
import { FaDongSign, FaStar } from "react-icons/fa6";
import { baseURL, getAllUsers, ratingProduct, updatedOrder } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { alertNULL, alertSuccess } from "../../context/actions/alertActions";
import { delivery, shipperCome } from "../../assets";
import { setAllUserDetail } from "../../context/actions/allUsersAction";

const OrderData = ({ index, data, admin }) => {
  const allUser = useSelector((state) => state.allUsers);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!allUser) {
      getAllUsers().then((data) => {
        dispatch(setAllUserDetail(data));
      });
    }
  });

  const store = allUser
    ? allUser.filter((store) => store.address === data.shippingAddress2)
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

  return (
    <motion.div
      {...staggerFadeInOut(index)}
      className="w-full flex flex-col items-start justify-start px-3 py-2 border relative border-gray-300 bg-cardOverlay drop-shadow-md rounded-md gap-1"
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
        </div>
      </div>
      <div className="flex items-center justify-start flex-wrap w-full">
        <div className="flex items-center justify-start w-full gap-4">
          <h1 className="text-xl font-semibold text-red-500 -mt-2">
            {store?.[0]?.store}
            {">>"} {data.shippingAddress2}
          </h1>
        </div>
      </div>
      <motion.div className="w-full flex gap-4 flex-wrap">
        <div
          className="flex md:w-300 flex-wrap items-center justify-start gap-4 px-4 py-2 col-1"
          style={{
            flex: "0 0 calc(35% - 10px)",
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
                  className="w-10 h-10 object-contain "
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
        <div className="flex items-start justify-center flex-col gap-2  w-full md:w-508">
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
             <div className="flex items-center justify-center ">
             <motion.img
               src={shipperCome}
               className="w-24 h-30 object-contain"
             />
             <p className="text-base font-semibold text-headingColor">
               Tài xế đang đến!
             </p>
           </div>
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
                  <div className="w-full px-4 py-3 bg-cardOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400 resize-none">
                    {data.mess}
                  </div>
                ) : (
                  <>
                    <div className="w-full px-4 py-3 bg-cardOverlay  text-gray-300 shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400 resize-none">
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
                  <div className="w-full px-4 py-3 bg-cardOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400 resize-none">
                    {comment}
                  </div>
                ) : (
                  <>
                    <div className="w-full px-4 py-3 bg-cardOverlay  text-gray-300 shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400 resize-none">
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
        className="w-full px-4 py-3 bg-cardOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400 resize-none" //
        value={stateValue}
        onChange={(e) => stateFunc(e.target.value)}
      />
    </>
  );
};
export default OrderData;
