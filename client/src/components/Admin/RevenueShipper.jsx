import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../api";
import { setOrders } from "../../context/actions/orderAction";
import { CChart } from "@coreui/react-chartjs";
import { FaFilter } from "react-icons/fa6";

const RevenueShipper = ({ shipperData, onClose }) => {
  const orders = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1); // Current month

  useEffect(() => {
    if (!orders) {
      getAllOrders().then((data) => {
        dispatch(setOrders(data));
      });
    }
  }, [orders, dispatch]);

  const filteredOrders = orders
    ? orders.filter(
        (order) => order.shipper && order.shipper.id === shipperData.id
      )
    : [];

  // Filter orders based on selected year and month
  const filteredOrdersByDate = filteredOrders.filter((order) => {
    const orderDate = new Date(order.dateOrdered);
    const year = orderDate.getFullYear();
    const month = orderDate.getMonth() + 1;
    return year === filterYear && month === filterMonth;
  });
  const dataByMonth = filteredOrders.reduce((acc, order) => {
    const orderDate = new Date(order.dateOrdered);
    const year = orderDate.getFullYear();
    const month = orderDate.getMonth() + 1;
    if (year === filterYear) {
      acc[month] = acc[month] || 0;
      acc[month] += 1;
    }
    return acc;
  }, {});
  // Group orders by day and calculate total revenue for each day
  const dataByDay = filteredOrdersByDate.reduce((acc, order) => {
    const orderDate = new Date(order.dateOrdered);
    const day = orderDate.getDate();
    acc[day] = acc[day] || 0;
    acc[day] += order.orderLists.length * 15000;
    return acc;
  }, {});

  // Prepare data for line chart
  const lineChartData = {
    labels: Object.keys(dataByDay).map(
      (day) => `${day}/${filterMonth}/${filterYear}`
    ),
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
        data: Object.values(dataByDay),
      },
    ],
  };

  const columnChartData = {
    labels: Object.keys(dataByMonth).map((month) => `Tháng ${month}`),
    datasets: [
      {
        label: "Số đơn hàng",
        backgroundColor: "#007bff",
        data: Object.values(dataByMonth),
      },
    ],
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[50%]">
        <div className="justify-between items-center flex">
        <h2 className="text-xl font-semibold mb-4">
          Doanh thu của {shipperData.name}
        </h2>
        <p className="text-base text-lighttextGray">Tổng đơn hàng: {filteredOrders.length}</p>
        </div>
       
        <div className="flex items-center mb-4">
          <div className="flex items-center w-auto justify-center bg-cardOverlay  gap-3 px-4 py-2 rounded-md backdrop-blur-md shadow-md">
            <FaFilter className="w-6 h-6 object-contain mr-2" />
            <label htmlFor="filterYear" className="">
              Năm:
            </label>
            <select
              id="filterYear"
              value={filterYear}
              onChange={(e) => setFilterYear(Number(e.target.value))}
              className="border-none outline-none py-1 font-medium bg-transparent text-base text-textColor border shadow-md focus:border-red-400 "
            >
              {/* <option value={2023}>2023</option> */}
              <option value={2024}>2024</option>
              <option value={2024}>2025</option>
            </select>
            <label htmlFor="filterMonth" className="">
              Tháng:
            </label>
            <select
              id="filterMonth"
              value={filterMonth}
              className="border-none outline-none py-1 font-medium bg-transparent text-base text-textColor border shadow-md focus:border-red-400 "
              onChange={(e) => setFilterMonth(Number(e.target.value))}
            >
              {/* <option value={1}>Tháng 1</option>
              <option value={2}>Tháng 2</option>
              <option value={3}>Tháng 3</option>
              <option value={4}>Tháng 4</option> */}
              <option value={5}>Tháng 5</option>
              <option value={6}>Tháng 6</option>
              {/* <option value={7}>Tháng 7</option>
              <option value={8}>Tháng 8</option>
              <option value={9}>Tháng 9</option>
              <option value={10}>Tháng 10</option>
              <option value={11}>Tháng 11</option>
              <option value={12}>Tháng 12</option> */}
            </select>
          </div>
        </div>
        <div className="mt-4">
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
        <div className="mt-4">
          <CChart
            type="bar"
            data={columnChartData}
            options={{
              aspectRatio: 1.5,
              tooltips: {
                enabled: true,
              },
            }}
            style={{ maxHeight: "190px" }}
          />
        </div>
        <div className="flex items-center justify-end">
        <button
          className="mt-12 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={onClose}
        >
          Đóng
        </button>
        </div>
        
      </div>
    </div>
  );
};

export default RevenueShipper;
