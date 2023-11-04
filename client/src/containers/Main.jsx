import React, { useEffect } from "react";
import { Header, Home, HomeSlider } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../api";
import { setAllProducts } from "../context/actions/productAction";



const Main = () => {
  const products = useSelector(state=>state.products)
  const dispatch = useDispatch()

  useEffect(()=>{
    if(!products){
      getAllProducts().then((data)=>{
        dispatch(setAllProducts(data))
      })
    }
  })
  return (
    <main className="w-screen min-h-screen flex justify-start items-center flex-col bg-primary">
      <Header />
      <div className="w-full flex flex-col items-start justify-center mt-32 px-6 md:px-24 2xl:px-40 gap-2 pb-24 ">
        <Home/>
        <HomeSlider/>
      </div>
    </main>
  );
};

export default Main;
