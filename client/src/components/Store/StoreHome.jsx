import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, getAllProducts, getAllUsers } from "../../api";
import { setAllProducts } from "../../context/actions/productAction";
import { CChart } from "@coreui/react-chartjs";
import { budget, confirmOrders, menu,  } from "../../assets";
import { FaDongSign, FaStar, FaUserCheck } from "react-icons/fa6";
import { setOrders } from "../../context/actions/orderAction";
import { setAllUserDetail } from "../../context/actions/allUsersAction";
import { motion } from "framer-motion";

const StoreHome = () => {
  const products = useSelector((state) => state.products);
  const orders = useSelector((state) => state.orders);
  const users = useSelector((state) => state.allUsers);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  

  const category = products
    ? [
        ...new Set(
          products
            .filter((item) => item.user.id === user.user.userId)
            .map((item) => item.category.name)
            .filter((name) => name !== "length")
        ),
      ]
    : [];
  const orderStore = orders
    ? orders.filter((order) => order.shippingAddress2 === user.user.store)
    : [];
  const totalRevenue = orderStore
    ? orderStore.reduce(
        (total, order) => total + (order.totalPrice * 1000 || 0),
        0
      )
    : 0;

  const sts = orderStore ? orderStore.map((order) => order.status) : [];

  const countStatus = (status) => {
    return sts.reduce((count, currentStatus) => {
      return currentStatus === status ? count + 1 : count;
    }, 0);
  };

  const pendingCount = countStatus("Pending");
  const shippingCount = countStatus("Shipping");
  const doneCount = countStatus("Done");

  const numberPaypal = orderStore?orderStore.filter(order => order.payed === true).length:[]
  const numberMoney =  orderStore? orderStore.length -numberPaypal :0;


  const productStore = products
    ? products.filter((item) => item.user.id === user.user.userId)
    : [];


    console.log(productStore)
    const ratedProducts = productStore
    ? productStore.filter((product) => product.numRated !== 0)
    : [];

  let ratedStore = 0;
  let totalRatings = 0;
  let numRated = 0;
  if (productStore.length > 0) {
    productStore.forEach((product) => {
      numRated += product.numRated;
    });
  }
  if (ratedProducts.length > 0) {
    let totalPoints = 0;

    ratedProducts.forEach((product) => {
      totalRatings++;

      totalPoints += product.ratings;
    });

    ratedStore = totalPoints / totalRatings;
  }

 
  const categoryCounts = {};
  if (productStore) {
    productStore.forEach((productStore) => {
      const category = productStore.category.name;

      if (categoryCounts[category]) {
        categoryCounts[category] += 1;
      } else {
        categoryCounts[category] = 1;
      }
    });
  }

  useEffect(() => {
    if (!products) {
      getAllProducts().then((data) => {
        dispatch(setAllProducts(data));
      });
    }
    if (!orders) {
      getAllOrders().then((data) => {
        dispatch(setOrders(data));
      });
    }
    if (!users) {
      getAllUsers().then((data) => {
        dispatch(setAllUserDetail(data));
      });
    }
  }, []);

  return (
    <div className="flex items-start justify-center flex-col pt-12 w-full  gap-8 h-full">
         <div className="pt-6 flex items-center gap-1">
                  <p className="text-xl font-semibold">
                    {parseFloat(ratedStore).toFixed(1)}
                  </p>
                  <FaStar className="w-6 h-6 text-yellow-400" />
                  <motion.button
                    
                    className=" flex  items-center  gap-1 bg-gradient-to-bl from-orange-400 to-orange-600 px-2 py-1 rounded-xl text-black text-base font-semibold "
                  >
                    <FaUserCheck className="w-8 h-8 text-slate-100" />
                   {numRated} + 
                  </motion.button>
             
                </div>
      <div className="items-start justify-start  gap-32 flex pt-12">
      
   
       
        <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-center  w-full md:w-225 relative  px-3 py-4">
          <img
            alt=""
            src={confirmOrders}
            className="w-20 h-20 object-contain items-center justify-center "
          />
          <div className="relative ">
            <p className="text-xl text-headingColor font-semibold">
              Total Orders
            </p>
            <p className=" text-lg font-semibold text-red-500 flex items-center justify-center gap-1">
              {orderStore?.length}
            </p>
          </div>
        </div>
        <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-center  w-full md:w-225 relative   py-4">
          <img
            alt=""
            src={budget}
            className="w-20 h-20 object-contain items-center justify-center "
          />
          <div className="relative ">
            <p className="text-xl text-headingColor font-semibold">
              Total Revenue
            </p>
            <p className=" text-lg font-semibold text-red-500 flex items-center justify-center gap-1">
              {totalRevenue.toLocaleString("vi-VN")}
              <FaDongSign className="text-red-400" />
            </p>
          </div>
        </div>

        <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-center  w-full md:w-225 relative  px-3 py-4">
          <img
            alt=""
            src={menu}
            className="w-20 h-20 object-contain items-center justify-center "
          />
          <div className="relative ">
            <p className="text-xl text-headingColor font-semibold">
              Total Product
            </p>
            <p className=" text-lg font-semibold text-red-500 flex items-center justify-center gap-1">
              {productStore?.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-20 h-full">
        <div className="flex items-center justify-center ">
          <div className="w-full md:w-full">
            <CChart
              type="bar"
              data={{
                labels: category,
                datasets: [
                  {
                    label: "Category Count",
                    backgroundColor: [
                      "#36A2EB",
                      "#FF6384",
                      "#4BC0C0",
                      "#FFCE56",
                      // "#E7E9ED",
                      "#36A2EB",
                    ],
                    data: categoryCounts,
                  },
                ],
              }}
              labels="category"
            />
          </div>
        </div>
        <div className="w-340 md:w-375 items-center justify-center">
        <CChart
            type="polarArea"
            data={{
              labels: ["Pending", "Shipping", "Done", "PayPal", "Money"],
              datasets: [
                {
                  data: [pendingCount,shippingCount , doneCount, numberPaypal, numberMoney],
                  backgroundColor: ["#FFCE56","#FF6384" , "#4BC0C0", "#1255e6","#45e31e"],
                },
              ],
            }}
          />
        </div>
        <div className="flex items-center justify-center w-full h-340  px-4 py-3 bg-cardOverlay  outline-none rounded-md  border shadow-md border-gray-600">
          <p>Best Seller</p>
        </div>
      </div>
    </div>
  );
};

export default StoreHome;
