import React, { useEffect } from "react";
import { Cart, FilterSection, Footer, Header, Home, HomeSlider } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, getAllUsers } from "../api";
import { setAllProducts } from "../context/actions/productAction";
import { setAllUserDetail } from "../context/actions/allUsersAction";

const Main = () => {
  const products = useSelector((state) => state.products);
  const allUsers = useSelector((state) => state.allUsers);
  const isCart = useSelector((state) => state.isCart);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!products) {
      getAllProducts().then((data) => {
        dispatch(setAllProducts(data));
      });
    }
    if (!allUsers) {
      getAllUsers().then((data) => {
        dispatch(setAllUserDetail(data));
      });
    }
  });
  
  return (
    <main className="w-screen min-h-screen flex justify-start items-center flex-col bg-primary">
      <Header />
      <div className="w-full flex flex-col items-start justify-center mt-32 px-6 md:px-24 2xl:px-40 gap-2 pb-24 ">
        <Home />
        <HomeSlider />
        <FilterSection />
        
       
      </div>
      {isCart && <Cart/>}
      <Footer />
      
    </main>
  );
};

export default Main;
