import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../api";
import { setOrders } from "../../context/actions/orderAction";
import OrderData from "../Admin/OrderData";
import { MdSearch } from "react-icons/md";
import { BsToggles2 } from "react-icons/bs";
import { motion } from "framer-motion";
import { buttonClick } from "../../animations";
import HomeSlider from "./HomeSlider";
import { menu } from "../../assets";

const UserOrder = () => {
  const user = useSelector((state) => state.user);
  const orders = useSelector((state) => state.orders);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  const [isRate, setIsRate] = useState(false);

  const userOrders = orders
    ? orders.filter((order) => order.user.id === user.user.userId)
    : [];

  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch orders initially
    getAllOrders().then((data) => {
      dispatch(setOrders(data));
    });
  }, [dispatch]);

  useEffect(() => {
    // Set up a subscription to re-fetch orders when `orders` state changes
    const fetchOrders = () => {
      getAllOrders().then((data) => {
        dispatch(setOrders(data));
      });
    };
    fetchOrders();
  }, [orders, dispatch]); // Depend on `orders` to trigger re-fetch on change

  const handleFilterByDateAndCustomer = () => {
    const filteredOrdersByDate = userOrders.filter((order) => {
      const orderDate = new Date(order.dateOrdered);
      return (
        (!startDate || orderDate >= new Date(startDate)) &&
        (!endDate || orderDate <= new Date(endDate))
      );
    });

    const filteredOrdersByCustomer = filteredOrdersByDate.filter((order) => {
      const matchedPayed = isRate === null || order.isRate === isRate;
      const matchedShippingAddress = order.shippingAddress2
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchedPrice = order.orderLists.some((item) => {
        if (item.product && item.product.name) {
          return item.product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }
        return false;
      });

      return matchedPayed && (matchedShippingAddress || matchedPrice);
    });

    return filteredOrdersByCustomer;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filterOrders = orders ? handleFilterByDateAndCustomer() : [];

  return (
    <main className="w-screen min-h-screen flex justify-start items-center flex-col bg-primary">
      <Header />
      <div className="w-full flex flex-col items-start justify-center mt-24 px-4 md:px-24 2xl:px-40 gap-6 ">
        <div className="w-full justify-between items-center flex">
          <div className="flex items-center justify-center bg-cardOverlay gap-3 px-4 py-2 rounded-md backdrop-blur-md shadow-md">
            <p className="text-base font-semibold"> Từ:</p>
            <input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-none outline-none font-medium bg-transparent text-base text-textColor border shadow-md focus:border-red-400 "
            />
            <p className="text-base font-semibold"> Đến:</p>
            <input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-none outline-none font-medium bg-transparent text-base text-textColor border shadow-md  "
            />
          </div>
          <div className="flex items-center justify-center gap-4 ">
            <motion.button
              className={`${
                isRate === false ? "bg-red-300" : "bg-gray-300"
              } px-3 py-1 rounded-md w-150 hover:bg-red-200`}
              {...buttonClick}
              onClick={() => setIsRate(false)}
            >
              Chưa Đánh Giá
            </motion.button>
            <motion.button
              className={`${
                isRate === true ? "bg-red-300" : "bg-gray-300"
              } px-3 py-1 rounded-md w-150 hover:bg-red-200`}
              {...buttonClick}
              onClick={() => setIsRate(true)}
            >
              Đã đánh giá
            </motion.button>
          </div>
          <div className="flex items-center justify-center bg-cardOverlay gap-3 px-4 py-2 rounded-md backdrop-blur-md shadow-md ">
            <MdSearch className="text-gray-400 text-2xl" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search Here"
              className="border-none outline-none font-medium bg-transparent text-base text-textColor "
            />
            <BsToggles2 className="text-gray-400 text-2xl" />
          </div>
        </div>
        {filterOrders.length > 0 ? (
        <div className="flex flex-col w-full h-auto">
        {filterOrders
          .slice(
            (currentPage - 1) * ordersPerPage,
            currentPage * ordersPerPage
          )
          .map((item, i) => (
            <OrderData key={i} index={i} data={item} />
          ))}
        <div className="flex items-center justify-center gap-4 mt-4">
          <motion.button
            onClick={() => handlePagination(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-xl font-semibold cursor-pointer hover:text-red-400"
            {...buttonClick}
          >
            Prev
          </motion.button>
          {Array.from(
            { length: Math.ceil(filterOrders.length / ordersPerPage) },
            (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePagination(i + 1)}
                className={`${
                  currentPage === i + 1
                    ? "bg-cardOverlay px-2 py-1 hover:bg-red-300 font-medium rounded-md backdrop-blur-md shadow-md"
                    : "bg-gray-300 text-black px-2 py-1 hover:bg-red-300 font-medium rounded-md backdrop-blur-md shadow-md"
                } px-3 py-1 rounded-md`}
              >
                {i + 1}
              </button>
            )
          )}
          <motion.button
            onClick={() => handlePagination(currentPage + 1)}
            disabled={currentPage * ordersPerPage >= filterOrders.length}
            className="text-xl font-semibold cursor-pointer hover:text-red-400"
            {...buttonClick}
          >
            Next 
          </motion.button>
        </div>
      </div>
        ) : (
          <div className=" flex-col flex items-center justify-center w-full h-auto gap-4">
             <img
              alt=""
              src={menu}
              className="w-[20%] h-[20%] object-contain items-center justify-center "
            />
          <p className="text-4xl text-textColor font-medium">Không có đơn hàng</p>
        </div>
        )}
      </div>

      <section className="w-full h-auto justify-end items-end pt-4 px-4">
        <HomeSlider />
      </section>
    </main>
  );
};

export default UserOrder;
