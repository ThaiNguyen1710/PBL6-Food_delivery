import React from "react";
import { Header, Home } from "../components";



const Main = () => {
  return (
    <main className="w-full min-h-screen flex justify-center items-center flex-col bg-primary">
      <Header />
      <div className="w-full h-full  items-start justify-start px-6 md:px-24 2xl:px-96 gap-12 pb-24 ">
        <Home/>
      </div>
    </main>
  );
};

export default Main;
