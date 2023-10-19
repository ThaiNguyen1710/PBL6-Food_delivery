import React, { useState } from "react";
import { statuses } from "../utils/styles";

const DBNewItem = () => {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState(null);
  const [price, setPrice] = useState("");

  return (
    <div className="flex items-center justify-center flex-col pt-6 px-24 w-full ">
      <div className="border border-gray-300 rounded-md p-4 w-full flex flex-col items-center justify-center gap-4">
        <InputValueField
          type="text"
          placeholder={"Item name here"}
          
          stateValue={itemName}
          stateFunc={setItemName}
        />
      </div>
      <div className="w-full flex flex-wrap items-center justify-around gap-3 pt-2">
        {statuses &&
          statuses?.map((data) => (
            <p
              key={data.id}
              onClick={()=>setCategory(data.category)}
              className={`px-4 py-3 rounded-md text-xl text-textColor font-semibold cursor-pointer hover: border backdrop-blur-md shadow-md border-gray-300 ${
                data.category === category
                  ? "bg-red-400 text-primary"
                  : "bg-transparent"
              }`}
            >
              {data.title}
            </p>
          ))}
      </div>
      <div className="w-[80%] flex justify-center items-center gap-3 pt-4 pb-3 shadow-md backdrop-blur-md border-red-200 font-semibold">
      <InputValueField 
        type="number"
        placeholder={"Item price here"}
        stateValue={price}
        stateFunc={setPrice} 
      />
      </div>
      <div className="w-full bg-card backdrop-blur-md h-370 rounded-md border-2 border-dotted border-gray-300 cursor-pointer"></div>
      
    </div>
  );
};

export const InputValueField = ({
  type,
  placeholder,
  stateValue,
  stateFunc,
}) => {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-cardOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400"
        value={stateValue}
        onChange={(e) => stateFunc(e.target.value)}
      />
    </>
  );
};

export default DBNewItem;
