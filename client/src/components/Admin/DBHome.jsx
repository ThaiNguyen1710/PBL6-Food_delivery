import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrders,
  getAllProducts,
  getAllShipper,
  getAllUsers,
} from "../../api";
import { setAllProducts } from "../../context/actions/productAction";
import { CChart } from "@coreui/react-chartjs";
import {
  budget,
  confirmOrders,
  delivery,
  store,
  totalUser,
} from "../../assets";
import { FaDongSign } from "react-icons/fa6";
import { setOrders } from "../../context/actions/orderAction";
import { setAllUserDetail } from "../../context/actions/allUsersAction";
import { FaFilter } from "react-icons/fa";
import { setAllShipper } from "../../context/actions/allShipperAction";
import { motion } from "framer-motion";

const DBHome = () => {
  const products = useSelector((state) => state.products);
  const orders = useSelector((state) => state.orders);
  const users = useSelector((state) => state.allUsers);
  const shipper = useSelector((state) => state.shipper);
  const dispatch = useDispatch();

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
    if (!shipper) {
      getAllShipper().then((data) => {
        dispatch(setAllShipper(data));
      });
    }
  });

  //Value

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

  const pendingCount = countStatus("Pending");
  const shippingCount = countStatus("Shipping");
  const doneCount = countStatus("Done");
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
  const orderTotalAmounts = orders ? orders.map(order => {
    const orderTotal = order.orderLists.reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0) + 15000;
    return orderTotal;
}) : [];




const totalRevenue1 = orderTotalAmounts.reduce((total, amount) => total + amount, 0);

// Trừ đi khoản phí cố định cho mỗi đơn hàng
const totalRevenue = totalRevenue1 - (orderTotalAmounts.length * 15000);

  //Line Bar

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
        const totalPrice = orderTotalAmounts[orders.indexOf(order)] || 0;
    
        if (!groupedData[timestamp]) {
            groupedData[timestamp] = totalPrice;
        } else {
            groupedData[timestamp] += totalPrice;
        }
    });
    

    let filteredData = Object.entries(groupedData).map(
      ([timestamp, totalPrice]) => ({
        timestamp,
        totalPrice,
      })
    );
    
    if (selectedYear && selectedMonth) {
      filteredData = filteredData.filter(
        (data) =>
          data.timestamp.split("-")[2] === selectedYear.toString() &&
          data.timestamp.split("-")[1] === selectedMonth.toString()
      );
    } else if (selectedYear) {
      filteredData = filteredData.filter(
        (data) => data.timestamp.split("-")[2] === selectedYear.toString()
      );
    } else if (selectedMonth) {
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
        label: "Doanh Thu",
        backgroundColor: "rgba(179,181,198,0.2)",
        borderColor: "#FF6384",
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

  //Bar Chart
  const extractOrderDataByMonth = () => {
    if (orders) {
      let monthlyOrderCounts = Array.from({ length: 12 }).fill(0);

      orders.forEach((order) => {
        const date = new Date(order.dateOrdered);
        const month = date.getMonth();

        monthlyOrderCounts[month] += 1;
      });

      return monthlyOrderCounts;
    } else {
      console.log("Không có dữ liệu đơn hàng.");
      return null;
    }
  };

  const orderDataByMonth = extractOrderDataByMonth();

  const lineChartDataOrdersByMonth = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: "Tổng Đơn Hàng Theo Tháng",
        backgroundColor: "#4BC0C0",
        borderColor: "#FF6384",
        data: orderDataByMonth,
      },
    ],
  };

  const lineCategory = {
    labels: category.filter((item) => typeof item === "string"),
    datasets: [
      {
        label: "Số Danh Mục Sản Phẩm",
        backgroundColor: "#45e31e",
        borderColor: "#45e31e",
        pointBackgroundColor: "rgba(179,181,198,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(179,181,198,1)",
        tooltipLabelColor: "rgba(179,181,198,1)",
        data: categoryCounts,
      },
    ],
  };

  //Export CSV

  const generateCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    const header = ["Time", "Revenue"];
    csvContent += header.join(",") + "\n";

    orderData.forEach((data) => {
      const row = [encodeURIComponent(data.timestamp), data.totalPrice];
      csvContent += row.join(",") + "\n";
    });

    return csvContent;
  };

  const exportToCSV = () => {
    const csvContent = generateCSV();

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "thong_ke.csv");

    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="flex items-start justify-center flex-col  w-full  gap-8   h-full ">
      <div className="items-start justify-start  gap-6 flex ">
        <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-center  w-full md:w-225 relative  px-2 py-2">
          <img
            alt=""
            src={confirmOrders}
            className="w-12 h-12 object-contain items-center justify-center "
          />
          <div className="relative ">
            <p className="text-xl text-headingColor font-semibold">Tổng Đơn</p>
            <p className=" text-lg font-semibold text-red-500 flex items-center justify-center gap-1">
              {orders?.length}
            </p>
          </div>
        </div>
        <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-center  w-full md:w-225 relative  px-2 py-2">
          <img
            alt=""
            src={budget}
            className="w-12 h-12 object-contain items-center justify-center "
          />
          <div className="relative ">
            <p className="text-xl text-headingColor font-semibold">Doanh Thu</p>
            <p className=" text-lg font-semibold text-red-500 flex items-center justify-center gap-1">
              {totalRevenue.toLocaleString("vi-VN")}
              <FaDongSign className="text-red-400" />
            </p>
          </div>
        </div>

        <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-center  w-full md:w-225 relative  px-2 py-2">
          <img
            alt=""
            src={totalUser}
            className="w-12 h-12 object-contain items-center justify-center "
          />
          <div className="relative ">
            <p className="text-xl text-headingColor font-semibold">
              Người Dùng
            </p>
            <p className=" text-lg font-semibold text-red-500 flex items-center justify-center gap-1">
              {users?.length}
            </p>
          </div>
        </div>
        <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-center  w-full md:w-225 relative  px-2 py-2">
          <img
            alt=""
            src={store}
            className="w-12 h-12 object-contain items-center justify-center "
          />
          <div className="relative ">
            <p className="text-xl text-headingColor font-semibold">Cửa Hàng</p>
            <p className=" text-lg font-semibold text-red-500 flex items-center justify-center gap-1">
              {isStore?.length}
            </p>
          </div>
        </div>
        <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-center  w-full md:w-225 relative  px-2 py-2">
          <img
            alt=""
            src={delivery}
            className="w-12 h-12 object-contain items-center justify-center "
          />
          <div className="relative ">
            <p className="text-xl text-headingColor font-semibold">Shipper</p>
            <p className=" text-lg font-semibold text-red-500 flex items-center justify-center gap-1">
              {shipper?.length}
            </p>
          </div>
        </div>
      </div>
      <div className=" w-full h-[80%]  " id="content-to-export">
        <div className="w-full  gap-2 flex h-[60%]  pb-2">
          <div className="w-275 md:w-275 items-center justify-center  border-gray-300 bg-cardOverlay rounded-md border">
            <CChart
              type="pie"
              data={{
                labels: [
                  "Đang chờ",
                  "Đang giao",
                  "Hoàn Thành",
                  "PayPal",
                  "Tiền mặt",
                ],
                datasets: [
                  {
                    data: [
                      pendingCount,
                      shippingCount,
                      doneCount,
                      numberPaypal,
                      numberMoney,
                    ],
                    backgroundColor: [
                      "#FFCE56",
                      "#FF6384",
                      "#4BC0C0",
                      "#1255e6",
                      "#45e31e",
                    ],
                  },
                ],
              }}
            />
          </div>
          <div className=" w-full  ">
            <div className="flex w-full justify-between">

            <div className="flex items-center w-80 justify-center bg-cardOverlay  gap-3 px-4 py-2 rounded-md backdrop-blur-md shadow-md">
              <FaFilter className="w-6 h-6 object-contain " />
              <select
                id="filterYear"
                onChange={(e) => setSelectedYear(e.target.value)}
                value={selectedYear || ""}
                className="border-none outline-none py-1 font-medium bg-transparent text-base text-textColor border shadow-md focus:border-red-400 "
              >
                <option value="">Chọn Năm</option>
                {Array.from({ length: 2 }, (_, index) => {
                  const year = 2024 + index;
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
                <option value="">Chọn Tháng</option>
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
            <motion.button
            className=" flex  items-center bg-gradient-to-bl from-gray-300 to-gray-500 px-2 py-1 rounded-xl text-black text-base font-semibold "
            onClick={exportToCSV}
          >
            Xuất CSV
          </motion.button>
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
              style={{ maxHeight: "190px" }}
            />
          </div>
        </div>
        <div className="w-full  gap-2 flex h-[40%] ">
          <div className="w-full md:w-[70%] border-gray-300 bg-cardOverlay rounded-md border">
            <CChart
              type="bar"
              data={lineCategory}
              options={{
                aspectRatio: 1.5,
                tooltips: {
                  enabled: true,
                },
                plugins: {
                  datalabels: {
                    display: true,
                    anchor: "end",
                    align: "top",
                    formatter: (value) => value,
                  },
                },
              }}
              style={{ maxHeight: "190px" }}
            />
          </div>
          <div
            className="w-full md:w-full items-center justify-center  border-gray-300 bg-cardOverlay rounded-md border"
            style={{ height: "100%" }}
          >
            <CChart
              type="bar"
              data={lineChartDataOrdersByMonth}
              options={{
                aspectRatio: 1.5,
                tooltips: {
                  enabled: true,
                },
                plugins: {
                  datalabels: {
                    anchor: "end",
                    align: "top",
                    formatter: (value) => value,
                    color: "#000", // Màu sắc của số liệu trên cột
                    labels: {
                      title: {
                        font: {
                          weight: "bold",
                        },
                      },
                    },
                  },
                },
              }}
              style={{ maxHeight: "190px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBHome;
