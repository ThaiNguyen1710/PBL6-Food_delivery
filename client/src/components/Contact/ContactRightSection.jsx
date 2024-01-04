import React from "react";
import { Route, Routes } from "react-router-dom";

import AboutUs from "./AboutUs";

import RegisStore from "./RegisStore";

import ContactHeader from "./ContactHeader";


const ContactRightSection = () => {
  return (
    <div className="py-6 px-6 flex flex-col flex-1 h-full">
      <ContactHeader/>
      <div className="flex flex-col flex-1 overflow-y-scroll scrollbar-none">
        <Routes>
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/regisStore" element={<RegisStore />} />
        </Routes>
        
      </div>
     
    </div>
  );
};

export default ContactRightSection;
