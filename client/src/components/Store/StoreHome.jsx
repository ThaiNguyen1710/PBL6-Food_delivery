import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseURL, getAllOrders, getAllProducts, getAllUsers } from "../../api";
import { setAllProducts } from "../../context/actions/productAction";
import { CChart } from "@coreui/react-chartjs";
import { bestSeller, budget, confirmOrders, menu } from "../../assets";
import { FaDongSign, FaFilter, FaStar, FaUserCheck } from "react-icons/fa6";
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
    ? orders.filter(
        (order) =>
          order.shippingAddress2 === user.user.store ||
          order.shippingAddress2 === user.user.address
      )
    : [];


    const totalPriceOrders = orderStore ? orderStore.map(order => {
      const orderTotal = order.orderLists.reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0) + 15000;
      return orderTotal;
  }) : [];



  const totalRevenue1 = totalPriceOrders.reduce((total, amount) => total + amount, 0);


  const totalRevenue = totalRevenue1 - (totalPriceOrders.length * 15000);
  // Best Seller
  const productSales = {};

  orderStore.forEach((order) => {
    order.orderLists.forEach((item) => {
      const productId = item.product.id;
      const quantitySold = item.quantity;
      const productName = item.product.name;
      const imageProduct = item.product.image;

      if (productSales[productId]) {
        productSales[productId].quantity += quantitySold;
      } else {
        productSales[productId] = {
          name: productName,
          quantity: quantitySold,
          image: imageProduct,
        };
      }
    });
  });

  const sortedProducts = Object.entries(productSales).sort(
    (a, b) => b[1].quantity - a[1].quantity
  );
  const bestSellers = sortedProducts.slice(0, 3);

  //sts Shipping

  const sts = orderStore ? orderStore.map((order) => order.status) : [];

  const countStatus = (status) => {
    return sts.reduce((count, currentStatus) => {
      return currentStatus === status ? count + 1 : count;
    }, 0);
  };

  const pendingCount = countStatus("Pending");
  const shippingCount = countStatus("Shipping");
  const doneCount = countStatus("Done");

  const numberPaypal = orderStore
    ? orderStore.filter((order) => order.isPay === true).length
    : [];
  const numberMoney = orderStore ? orderStore.length - numberPaypal : 0;

  const productStore = products
    ? products.filter((item) => item.user.id === user.user.userId)
    : [];

  //ratedProduct

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

  //category Count

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
  });

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const extractOrderData = () => {
    if (orderStore) {
      let groupedData = {};

      orderStore.forEach((order) => {
        const date = new Date(order.dateOrdered);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const timestamp = `${day}-${month}-${year}`;
        const totalPrice = totalPriceOrders[orders.indexOf(order)] || 0;

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
      <div className="flex items-center gap-1  w-full justify-between">
        <div className="flex gap-1 w-auto items-center justify-center">
          <p className="text-xl font-semibold">
            {parseFloat(ratedStore).toFixed(1)}
          </p>
          <FaStar className="w-6 h-6 text-yellow-400" />
          <motion.button className=" flex  items-center  gap-1 bg-gradient-to-bl from-orange-400 to-orange-600 px-2 py-1 rounded-xl text-black text-base font-semibold ">
            <FaUserCheck className="w-8 h-8 text-slate-100" />
            {numRated} +
          </motion.button>
        </div>
        <div className="items-start justify-start  gap-16 flex">
          <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-center  w-full md:w-225 relative  px-2 py-2">
            <img
              alt=""
              src={confirmOrders}
              className="w-12 h-12 object-contain items-center justify-center "
            />
            <div className="relative ">
              <p className="text-lg text-headingColor font-semibold">
                Tổng Đơn
              </p>
              <p className=" text-base font-semibold text-red-500 flex items-center justify-center gap-1">
                {orderStore?.length}
              </p>
            </div>
          </div>
          <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-center  w-full md:w-225 relative px-2 py-2">
            <img
              alt=""
              src={budget}
              className="w-12 h-12 object-contain items-center justify-center "
            />
            <div className="relative ">
              <p className="text-lg text-headingColor font-semibold">
                Doanh Thu
              </p>
              <p className=" text-base font-semibold text-red-500 flex items-center justify-center gap-1">
                {totalRevenue.toLocaleString("vi-VN")}
                <FaDongSign className="text-red-400" />
              </p>
            </div>
          </div>

          <div className="bg-cardOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-center  w-full md:w-225 relative  px-2 py-2">
            <img
              alt=""
              src={menu}
              className="w-12 h-12 object-contain items-center justify-center "
            />
            <div className="relative ">
              <p className="text-lg text-headingColor font-semibold">
                Sản Phẩm
              </p>
              <p className=" text-base font-semibold text-red-500 flex items-center justify-center gap-1">
                {productStore?.length}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-1 w-auto items-center justify-center">
          <motion.button
            className=" flex  items-center  gap-1 bg-gradient-to-bl from-gray-300 to-gray-500 px-2 py-1 rounded-xl text-black text-base font-semibold "
            onClick={exportToCSV}
          >
            {" "}
            Xuất CSV
          </motion.button>
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
          <div className=" w-full justify-end ">
            <div className="flex items-center w-80 justify-center bg-cardOverlay  gap-3 px-4 py-2 rounded-md backdrop-blur-md shadow-md">
              <FaFilter className="w-6 h-6 object-contain " />
              <select
                id="filterYear"
                onChange={(e) => setSelectedYear(e.target.value)}
                value={selectedYear || ""}
                className="border-none outline-none py-1 font-medium bg-transparent text-base text-textColor border shadow-md focus:border-red-400 "
              >
                <option value="">Chọn Năm</option>
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
          <div className="w-full md:w-[30%] border-gray-300 bg-cardOverlay rounded-md border">
            <CChart
              type="bar"
              data={{
                labels: category,
                datasets: [
                  {
                    label: "Số loại sản phẩm",
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
          <div
            className="w-full md:w-full items-center justify-center  border-gray-300 bg-cardOverlay rounded-md border"
            style={{ height: "100%" }}
          >
            <div className="w-full h-[20%] flex  items-center justify-start  ">
              {" "}
              <img
                alt=""
                src={bestSeller}
                className="w-12 h-8 object-contain"
              />
              <p className="text-headingColor font-semibold text-lg">
                Best Sellers
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              {bestSellers.map(([productId, productInfo]) => (
                <div
                  key={productId}
                  className=" items-center gap-2 justify-start  px-2  bg-white rounded-md border shadow-md border-gray-300 grid w-full grid-cols-1 md:grid-cols-3  "
                  style={{
                    display: "grid",
                    gridTemplateColumns: "30% 60% 10%",
                  }}
                >
                  <img
                    alt=""
                    src={baseURL + productInfo.image}
                    className="w-10 h-10 object-contain"
                    style={{ gridColumn: "1" }}
                  />
                  <p
                    style={{ gridColumn: "2" }}
                    className="text-base font-semibold "
                  >
                    {productInfo.name}
                  </p>
                  <p
                    style={{ gridColumn: "3" }}
                    className="text-base font-semibold "
                  >
                    {productInfo.quantity} +
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreHome;
