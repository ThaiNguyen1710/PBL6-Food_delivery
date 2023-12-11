import React, { useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../api";
import { setOrders } from "../../context/actions/orderAction";
import OrderData from "../Admin/OrderData";

const UserOrder = () => {
  const user = useSelector((state) => state.user);
  const orders = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!orders) {
      getAllOrders().then((data) => {
        dispatch(setOrders(data));
      });
    }
  }, [orders]);
  const filterOrder = orders
    ? orders.filter((order) => order.user.id === user.user.userId)
    : [];

 

  return (
    <main className="w-screen min-h-screen flex justify-start items-center flex-col bg-primary">
      <Header />
      <div className="w-full flex flex-col items-start justify-center mt-32 px-6 md:px-24 2xl:px-40 gap-12 pb-24 ">
      {filterOrder?.length > 0 ? (
  filterOrder.map((item, i) => (
    <OrderData key={i} index={i} data={item} admin={false} />
  ))
) : (
  <h1 className="text-[72px] text-headingColor text-center font-bold">
    No Order
  </h1>
)}
      </div>

      <div className="w-full min-h-screen justify-end  flex   items-end">
        <Footer />
      </div>
    </main>
  );
};

export default UserOrder;
