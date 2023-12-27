import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "../../context/actions/orderAction";
import { getAllOrders } from "../../api";
import OrderData from "../Admin/OrderData";
import { BsToggles2 } from "react-icons/bs";
import { MdSearch } from "react-icons/md";
import { motion } from "framer-motion";
import { buttonClick } from "../../animations";


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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3; 

  const orderStore = orders
    ? orders.filter((order) => order.shippingAddress2 === user.user.store||order.shippingAddress2 === user.user.address)
    : [];

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orderStore.slice(indexOfFirstOrder, indexOfLastOrder);

 

  const handleFilterByDateAndCustomer = () => {
    const filteredOrdersByDate = orderStore.filter((order) => {
      const orderDate = new Date(order.dateOrdered);
      return (
        (!startDate || orderDate >= new Date(startDate)) &&
        (!endDate || orderDate <= new Date(endDate))
      );
    });

    const filteredOrdersByCustomer = filteredOrdersByDate.filter((order) => {
      const matchedShippingAddress = order.user.name
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

      return matchedShippingAddress || matchedPrice;
    });

    return filteredOrdersByCustomer;
  };

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterOrders = orders ? handleFilterByDateAndCustomer() : [];

  return (
    <div className="flex items-center justify-center flex-col pt-6 w-full gap-4">
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
        <>
          {filterOrders
            .slice(
              (currentPage - 1) * ordersPerPage,
              currentPage * ordersPerPage
            )
            .map((item, i) => (
              <OrderData key={i} index={i} data={item} admin={true} />
            ))}
        </>
      ) : (
        <>
          {currentOrders.length > 0 ? (
            <>
              {currentOrders.map((item, i) => (
                <OrderData key={i} index={i} data={item} admin={true} />
              ))}
            </>
          ) : (
            <>
              <h1 className="text-[72px] text-headingColor font-bold ">
                No Data
              </h1>
            </>
          )}
        </>
      )}

      {/* Nút chuyển trang */}
      <div className="flex items-center justify-center gap-4 pb-4 ">
        <motion.button
          onClick={() => handlePagination(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-xl font-semibold cursor-pointer hover:text-red-400 "
          {...buttonClick}
        >
          Prev
        </motion.button>
        {Array.from(
          { length: Math.ceil(filterOrders.length / ordersPerPage) },
          (_, i) => (
            <button key={i + 1} onClick={() => handlePagination(i + 1)}     
            className={`${
              currentPage === i + 1 ? "bg-cardOverlay  px-2 py-1 hover:bg-red-300 font-medium rounded-md backdrop-blur-md shadow-md" : "bg-gray-300 text-black  px-2 py-1 hover:bg-red-300 font-medium rounded-md backdrop-blur-md shadow-md"
            } px-3 py-1 rounded-md`}>
              {i + 1}
              
            </button>
          )
        )}
        <motion.button
          onClick={() => handlePagination(currentPage + 1)}
          disabled={currentPage * ordersPerPage >= filterOrders.length}
          className="text-xl font-semibold cursor-pointer hover:text-red-400 "
          {...buttonClick}
        >
          Next
        </motion.button>
      </div>
    </div>
  );
};

export default StoreOrder;
