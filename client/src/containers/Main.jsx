import React from "react";
import { Header } from "../components";
import { motion } from "framer-motion";


const Main = () => {
  return (
    <main className="w-screen min-h-screen flex justify-center items-center absolute bottom-0 flex-col bg-primary">
      <Header />
    </main>
  );
};

export default Main;
