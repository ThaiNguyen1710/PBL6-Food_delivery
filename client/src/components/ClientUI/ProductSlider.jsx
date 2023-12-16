import { motion } from "framer-motion";
import React from "react";
import SliderProduct from "./SliderProduct";

const ProductSlider = (data) => {

 
  return (
    <motion.div className="w-full flex items-start justify-start flex-col ">
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col items-start justify-start gap-1">
          <p className="text-2xl text-headingColor font-bold">
            Sản phẩm tương tự {">>"} {data.data.user.store}
          </p>
          <div className="w-80 h-1 rounded-md bg-orange-500"></div>
        </div>
        
      </div>
      <SliderProduct data={data} />
    
    </motion.div>
  );
};

export default ProductSlider;
