import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "../../context/actions/orderAction";
import { getAllOrders } from "../../api";
import OrderData from "../Admin/OrderData";


const StoreOrder = () => {
  const orders = useSelector((state) => state.orders);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!orders) {
      getAllOrders().then((data) => {
        dispatch(setOrders(data));
      });
    }
  });


  const orderStore = orders
  ? orders.filter((order) => order.shippingAddress2 === user.user.store)
  : [];
  
  return (
    <div className="flex items-center justify-center flex-col pt-6 w-full gap-4">
      {orderStore ? (
        <>
          {orderStore.map((item, i)=>(
            <OrderData  key={i} index={i} data={item} admin={true}/>
          ))}
        </>
      ) : (
        <>
          <h1 className="text-[72px] text-headingColor font-bold ">No Data</h1>
        </>
      )}
    </div>
  );
};

export default StoreOrder;
