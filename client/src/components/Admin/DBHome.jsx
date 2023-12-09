import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, getAllProducts, getAllUsers } from "../../api";
import { setAllProducts } from "../../context/actions/productAction";
import { CChart } from "@coreui/react-chartjs";
import { budget, confirmOrders, store, totalUser } from "../../assets";
import { FaDongSign } from "react-icons/fa6";
import { setOrders } from "../../context/actions/orderAction";
import { setAllUserDetail } from "../../context/actions/allUsersAction";

const DBHome = () => {
  const products = useSelector((state) => state.products);
  const orders = useSelector((state) => state.orders);
  const users = useSelector((state) => state.allUsers);
  const dispatch = useDispatch();

  const category = products
    ? [
        ...new Set(
          products
            .filter((item) => item && item.category && item.category.name) // Lọc các phần tử không null hoặc không undefined
            .map((item) => item.category.name)
            .filter((name) => name !== "length") // Loại bỏ các phần tử có giá trị 'length'
        ),
      ]
    : [];

  const sts = orders ? orders.map((order) => order.sts) : [];

  const countStatus = (status) => {
    return sts.reduce((count, currentStatus) => {
      return currentStatus === status ? count + 1 : count;
    }, 0);
  };

  const preparingCount = countStatus("preparing");
  const cancelledCount = countStatus("cancelled");
  const deliveredCount = countStatus("delivered");
  const categoryCounts = {};
  if (products) {
    products.forEach((product) => {
      const category = product.category.name;

      if (categoryCounts[category]) {
        categoryCounts[category] += 1;
      } else {
        categoryCounts[category] = 1;
      }
    });
  }
  const isStore = users
  ? users.filter((store) => store?.isStore === true)
  : [];

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
      <div className="items-start justify-start  gap-16 flex pt-12">
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
              {orders?.length}
            </p>
          </div>
        </div>
        <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-center  w-full md:w-225 relative   py-4">
          <img
            alt=""
            src={budget}
            className="w-20 h-20 object-contain items-center justify-center "
          />
          {/* <div className="relative ">
            <p className="text-xl text-headingColor font-semibold">
              Total Revenue
            </p>
            <p className=" text-lg font-semibold text-red-500 flex items-center justify-center gap-1">
              {orders
                ?.reduce(
                  (total, order) =>
                    total +
                    parseFloat(order.total.replace(".", "").replace(",", ".")),
                  0
                )
                .toLocaleString("vi-VN")}
              <FaDongSign className="text-red-400" />
            </p>
          </div> */}
        </div>

        <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-center  w-full md:w-225 relative  px-3 py-4">
          <img
            alt=""
            src={totalUser}
            className="w-20 h-20 object-contain items-center justify-center "
          />
          <div className="relative ">
            <p className="text-xl text-headingColor font-semibold">
              Total Users
            </p>
            <p className=" text-lg font-semibold text-red-500 flex items-center justify-center gap-1">
              {users?.length}
            </p>
          </div>
        </div>
        <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-center  w-full md:w-225 relative  px-3 py-4">
          <img
            alt=""
            src={store}
            className="w-20 h-20 object-contain items-center justify-center "
          />
          <div className="relative ">
            <p className="text-xl text-headingColor font-semibold">
              Total Stores
            </p>
            <p className=" text-lg font-semibold text-red-500 flex items-center justify-center gap-1">
              {isStore?.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-40 h-full">
        <div className="flex items-center justify-center ">
          <div className="w-508 md:w-656">
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
              labels: ["Preparing", "Delivered", "Cancelled"],
              datasets: [
                {
                  data: [preparingCount, deliveredCount, cancelledCount],
                  backgroundColor: ["#FF6384", "#4BC0C0", "#FFCE56"],
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DBHome;
