import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, getAllProducts, getAllUsers } from "../../api";
import { setAllProducts } from "../../context/actions/productAction";
import { CChart } from "@coreui/react-chartjs";
import { budget, confirmOrders, store, totalUser } from "../../assets";
import { FaDongSign } from "react-icons/fa6";
import { setOrders } from "../../context/actions/orderAction";
import { setAllUserDetail } from "../../context/actions/allUsersAction";
import { FaFilter } from "react-icons/fa";

const DBHome = () => {
  const products = useSelector((state) => state.products);
  const orders = useSelector((state) => state.orders);
  const users = useSelector((state) => state.allUsers);
  const dispatch = useDispatch();

  const category = products
    ? [
        ...new Set(
          products
            .filter((item) => item && item.category && item.category.name)
            .map((item) => item.category.name)
            .filter((name) => name !== "length")
        ),
      ]
    : [];

  const sts = orders ? orders.map((order) => order.status) : [];

  const countStatus = (status) => {
    return sts.reduce((count, currentStatus) => {
      return currentStatus === status ? count + 1 : count;
    }, 0);
  };

  const preparingCount = countStatus("Pending");
  const cancelledCount = countStatus("Shipping");
  const deliveredCount = countStatus("Done");
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
  const isStore = users ? users.filter((store) => store?.isStore === true) : [];

  const totalRevenue = orders
    ? orders.reduce((total, order) => total + (order.totalPrice * 1000 || 0), 0)
    : 0;

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const extractOrderData = () => {
    if (orders) {
      let groupedData = {};

      orders.forEach((order) => {
        const date = new Date(order.dateOrdered);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const timestamp = `${day}-${month}-${year}`;
        const totalPrice = order.totalPrice * 1000 || 0;

        if (!groupedData[timestamp]) {
          groupedData[timestamp] = totalPrice;
        } else {
          groupedData[timestamp] += totalPrice;
        }
      });

      // Lọc và sắp xếp theo yêu cầu của bộ lọc
      let filteredData = Object.entries(groupedData).map(
        ([timestamp, totalPrice]) => ({
          timestamp,
          totalPrice,
        })
      );
      if (selectedYear) {
        filteredData = filteredData.filter(
          (data) => data.timestamp.split("-")[2] === selectedYear.toString()
        );
      }
      if (selectedMonth) {
        filteredData = filteredData.filter(
          (data) => data.timestamp.split("-")[1] === selectedMonth.toString()
        );
      }

      filteredData = filteredData.reverse();

      return filteredData;
    } else {
      console.log("Không có dữ liệu đơn hàng.");
      return null;
    }
  };

  const orderData = extractOrderData();

  const lineChartData = {
    labels: orderData ? orderData.map((data) => data.timestamp) : [],
    datasets: [
      {
        label: "Total Price",
        backgroundColor: "rgba(179,181,198,0.2)",
        borderColor:"#FF6384",
        pointBackgroundColor: "rgba(179,181,198,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(179,181,198,1)",
        tooltipLabelColor: "rgba(179,181,198,1)",
        data: orderData ? orderData.map((data) => data.totalPrice) : [],
      },
    ],
  };
  const numberPaypal = orders
    ? orders.filter((order) => order.isPay === true).length
    : [];
  const numberMoney = orders ? orders.length - numberPaypal : 0;

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
  });

  return (
    <div className="flex items-start justify-center flex-col pt-44 w-full   gap-8 h-full">
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
      <div className="w-full md:w-full items-center justify-center">
        <div className="flex items-center w-80 justify-center bg-cardOverlay  gap-3 px-4 py-2 rounded-md backdrop-blur-md shadow-md">
 
          <FaFilter className="w-6 h-6 object-contain "/>
          <select
            id="filterYear"
            onChange={(e) => setSelectedYear(e.target.value)}
            value={selectedYear || ""}
            className="border-none outline-none py-1 font-medium bg-transparent text-base text-textColor border shadow-md focus:border-red-400 "
          >

           
            <option value="">Select Year</option>
            {Array.from({ length: 4 }, (_, index) => {
              const year = 2021 + index;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
          <select
            id="filterMonth"
            onChange={(e) => setSelectedMonth(e.target.value)}
            value={selectedMonth || ""}
            className="border-none outline-none py-1 font-medium bg-transparent text-base text-textColor border shadow-md focus:border-red-400 "
          >
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, index) => {
              const month = index + 1;
              return (
                <option key={month} value={month}>
                  {month}
                </option>
              );
            })}
          </select>
        </div>

        <CChart
          type="line"
          data={lineChartData}
          options={{
            aspectRatio: 1.5,
            tooltips: {
              enabled: true,
            },
          }}
          style={{ maxHeight: "225px" }}
        />
      </div>

      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-20 px-12 h-full">
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

        <div className="w-340 md:w-375 items-center justify-center ">
          <CChart
            type="polarArea"
            data={{
              labels: ["Pending", "Shipping", "Done", "PayPal", "Money"],
              datasets: [
                {
                  data: [
                    preparingCount,
                
                    cancelledCount,
                    deliveredCount,
                    numberPaypal,
                    numberMoney,
                  ],
                  backgroundColor: [
                    "#FF6384",
                    "#4BC0C0",
                    "#FFCE56",
                    "#1255e6",
                    "#45e31e",
                  ],
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
