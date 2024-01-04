import React from "react";
import DBHeader from "./DBHeader";
import { Route, Routes } from "react-router-dom";
import DBOrders from "./DBOrders";
import DBHome from "./DBHome";


import DBUsers from "./DBUsers";
import DBItems from "./DBItems";
import DBShipper from "./DBShipper";
import DBStore from "./DBStore";
import ListStoreConfirm from "./ListStoreConfirm";
import ContactUser from "./ContactUser";

const DBRightSection = () => {
  return (
    <div className="py-3 px-8 flex flex-col flex-1 h-full">
      <DBHeader />
      <div className="flex flex-col flex-1 overflow-y-scroll scrollbar-none">
        <Routes>
          <Route path="/home" element={<DBHome />} />
          <Route path="/orders" element={<DBOrders />} />
          <Route path="/items" element={<DBItems/>} />
          {/* <Route path="/newItem" element={<DBNewItem />} /> */}
          <Route path="/users" element={<DBUsers />} />
          <Route path="/store" element={<DBStore />} />
          <Route path="/contacts" element={<ContactUser />} />
          <Route path="/store-confirm" element={<ListStoreConfirm />} />
          <Route path="/shipper" element={<DBShipper />} />
         
        </Routes>
      </div>
    </div>
  );
};

export default DBRightSection;
