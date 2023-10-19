import React from "react";
import DBHeader from "./DBHeader";
import { Route, Routes } from "react-router-dom";
import DBOrders from "./DBOrders";
import DBHome from "./DBHome";

import DBNewItem from "./DBNewItem";
import DBUsers from "./DBUsers";
import DBItems from "./DBItems";

const DBRightSection = () => {
  return (
    <div className="py-6 px-12 flex flex-col flex-1 h-full">
      <DBHeader />
      <div className="flex flex-col flex-1 overflow-y-scroll scrollbar-none">
        <Routes>
          <Route path="/home" element={<DBHome />} />
          <Route path="/orders" element={<DBOrders />} />
          <Route path="/items" element={<DBItems/>} />
          <Route path="/newItem" element={<DBNewItem />} />
          <Route path="/users" element={<DBUsers />} />
        </Routes>
      </div>
    </div>
  );
};

export default DBRightSection;
