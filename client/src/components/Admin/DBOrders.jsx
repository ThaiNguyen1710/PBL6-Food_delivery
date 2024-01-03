import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "../../context/actions/orderAction";
import { getAllOrders } from "../../api";
import OrderData from "./OrderData";
import { BsToggles2 } from "react-icons/bs";
import { MdSearch } from "react-icons/md";
import { buttonClick } from "../../animations";
import { motion } from "framer-motion";
import { storeList } from "../../assets";

const DBOrders = () => {
  const orders = useSelector((state) => state.orders);
  const allUsers = useSelector((state) => state.allUsers);
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStatus, setSelectedStatus] = useState(null);

  const [selectedStoreOrders, setSelectedStoreOrders] = useState([]);

  const isStore = allUsers
    ? allUsers.filter((store) => store?.closeAt !== null)
    : [];

  useEffect(() => {
    if (!orders) {
      getAllOrders().then((data) => {
        dispatch(setOrders(data));
      });
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders
    ? orders.slice(indexOfFirstOrder, indexOfLastOrder)
    : [];
  const handleStoreClick = (storeId) => {
    if (isStore && isStore.length > 0) {
      const ordersOfSelectedStore = orders
        ? orders.filter((order) => {
            const store = isStore.find((store) => store.id === storeId);
            return store && order.shippingAddress2 === store.address;
          })
        : [];

      setSelectedStoreOrders(ordersOfSelectedStore);
    } else {
      // Xử lý khi không có dữ liệu store
    }
  };

  const handleFilterByDateAndCustomer = () => {
    if (!orders) {
      return [];
    }
    const filteredOrdersByDate = orders.filter((order) => {
      const orderDate = new Date(order.dateOrdered);
      return (
        (!startDate || orderDate >= new Date(startDate)) &&
        (!endDate || orderDate <= new Date(endDate))
      );
    });

    const ordersToDisplay =
      selectedStoreOrders.length > 0
        ? selectedStoreOrders
        : filteredOrdersByDate;

    // Lọc theo các tiêu chí tìm kiếm khác
    const filterOrders = ordersToDisplay.filter((order) => {
      const matchedStatus =
        selectedStatus === null || order.status === selectedStatus;

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

      return matchedStatus && (matchedShippingAddress || matchedPrice);
    });

    return filterOrders;
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filterOrders = orders ? handleFilterByDateAndCustomer() : [];
  console.log(filterOrders);
  return (
    <div className="flex items-center justify-center flex-col pt-4 w-full gap-3">
      <div className="w-full gap-6 items-start justify-start flex ">
        <p className="text-lg font-medium text-headingColor ">Cửa Hàng: </p>{" "}
        <motion.button
          className={`${
            selectedStoreOrders.length === 0 ? "bg-red-300" : "bg-cardOverlay "
          } px-3 py-1 rounded-md flex gap-2 items-center justify-center shadow-md hover:bg-red-200 `}
          {...buttonClick}
          onClick={() => handleStoreClick(null)}
        >
          All
        </motion.button>
        {isStore.map((store) => (
          <motion.button
            key={store.id}
            className={`${
              selectedStoreOrders.some(
                (order) => order.shippingAddress2 === store.address
              )
                ? "bg-red-300"
                : "bg-cardOverlay"
            } px-3 py-1 rounded-md flex gap-2 items-center justify-center shadow-md hover:bg-red-200 `}
            {...buttonClick}
            onClick={() => handleStoreClick(store.id)}
          >
            <motion.img src={storeList} className="w-6 h-6 object-contain" />
            {store.store}
          </motion.button>
        ))}
      </div>
      <div className="w-full justify-between items-center flex">
        <div className="flex items-center justify-center bg-cardOverlay gap-3 px-3 py-2 rounded-md backdrop-blur-md shadow-md">
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
              selectedStatus === null ? "bg-red-300" : "bg-gray-300"
            } px-3 py-1 rounded-md`}
            {...buttonClick}
            onClick={() => setSelectedStatus(null)}
          >
            All
          </motion.button>
          <motion.button
            className={`${
              selectedStatus === "Pending" ? "bg-red-300" : "bg-gray-300"
            } px-3 py-1 rounded-md`}
            {...buttonClick}
            onClick={() => setSelectedStatus("Pending")}
          >
            Pending
          </motion.button>
          <motion.button
            className={`${
              selectedStatus === "Shipping" ? "bg-red-300" : "bg-gray-300"
            } px-3 py-1 rounded-md`}
            {...buttonClick}
            onClick={() => setSelectedStatus("Shipping")}
          >
            Shipping
          </motion.button>
          <motion.button
            className={`${
              selectedStatus === "Done" ? "bg-red-300" : "bg-gray-300"
            } px-3 py-1 rounded-md`}
            {...buttonClick}
            onClick={() => setSelectedStatus("Done")}
          >
            Done
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
      <div className="w-full items-center justify-end flex">
        <p className="text-base font-medium text-headingColor">
          Tổng đơn:{" "}
          {filterOrders ? filterOrders.length : orders ? orders.length : null}
        </p>
      </div>

      {filterOrders.length > 0 ? (
        filterOrders
          .slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)
          .map((item, i) => (
            <OrderData key={i} index={i} data={item} admin={true} />
          ))
      ) : (
        <h1 className="text-[72px] text-headingColor font-bold">No Data</h1>
      )}

      <div className="flex items-center justify-center gap-4 pb-4">
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
            <button
              key={i + 1}
              onClick={() => handlePagination(i + 1)}
              className={`${
                currentPage === i + 1
                  ? "bg-cardOverlay  px-2 py-1 hover:bg-red-300 font-medium rounded-md backdrop-blur-md shadow-md"
                  : "bg-gray-300 text-black  px-2 py-1 hover:bg-red-300 font-medium rounded-md backdrop-blur-md shadow-md"
              } px-3 py-1 rounded-md`}
            >
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

export default DBOrders;
