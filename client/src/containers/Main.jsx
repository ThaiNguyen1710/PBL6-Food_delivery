import React, { useEffect } from "react";
import {
  Cart,
  FilterSection,
  Footer,
  Header,
  Home,
  HomeSlider,
  ListStore,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, getAllUsers } from "../api";
import { setAllProducts } from "../context/actions/productAction";
import { setAllUserDetail } from "../context/actions/allUsersAction";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const products = useSelector((state) => state.products);
  const allUsers = useSelector((state) => state.allUsers);
  const user = useSelector((state) => state.user);

  const isCart = useSelector((state) => state.isCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

    if (user && user.user) {
      if (user.user.isAdmin === true) {
        navigate("/dashboard/home", { replace: true });
      }
    }
  });

  return (
    <main className="w-screen min-h-screen flex justify-start items-center flex-col bg-primary">
      <Header />
      <div className="w-full flex flex-col items-start justify-center mt-32 px-6 md:px-24 2xl:px-40 gap-2 pb-24 ">
        <Home />
        <div id="listStore">
          {" "}
          <ListStore />
        </div>
        <div id="filterSection" className="w-full h-[1px] rounded-md bg-gray-500  "></div>
        
          <FilterSection />
        

        <HomeSlider />
      </div>
      {isCart && <Cart />}
      <div id="homeSlider">
        <Footer />
      </div>
    </main>
  );
};

export default Main;
