import React from "react";
import { FaStar } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";
import { baseURL } from "../../api";

const StoreCard = ({ data }) => {
  const currentDate = new Date();
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const currentTime = `${hours}:${minutes}`;


  if (!Array.isArray(data)) {
    return (
      <div className="bg-gray-200 hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center flex-col justify-between relative px-4 py-2 w-full md:w-375 md:min-w-350">
        <img alt="" src={baseURL+data.imgStore} className="w-full h-150 object-contain" />
        <div className="w-full px-2  items-start justify-center">
          <p className="text-xl text-headingColor font-semibold">{data.store}</p>
          <p className="text-sm font-normal text-textColor">{data.address}</p>
        </div>
        <div className="w-full h-[1px] rounded-md bg-gray-500"></div>
        <div className="w-full flex">
          <div className="w-full flex items-center gap-1">
            <p className="text-xl font-semibold">5</p>
            <FaStar className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="w-full flex items-center justify-end gap-1">
            {currentTime >= data.openAt && currentTime <= data.closeAt ? (
              <MdAccessTimeFilled className="w-10 h-8 text-green-500" />
            ) : (
              <MdAccessTimeFilled className="w-10 h-8 text-red-500" />
            )}
            {data.openAt} - {data.closeAt}
          </div>
        </div>
      </div>
    );
  }


  return (
    <>
      {data.map((storeData, index) => (
        <div
          key={index}
          className="bg-gray-200 hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center flex-col justify-between relative px-4 py-2 w-full md:w-375 md:min-w-350"
        >
           <img alt="" src={baseURL+data.imgStore} className="w-full h-340 object-contain" />
          <div className="w-full px-4 items-start justify-center">
            <p className="text-xl text-headingColor font-semibold">{storeData.store}</p>
            <p className="text-sm font-normal text-textColor">{storeData.address}</p>
          </div>
          <div className="w-full h-[1px] rounded-md bg-gray-500"></div>
          <div className="w-full flex">
            <div className="w-full flex items-center gap-1">
              <p className="text-xl font-semibold">5</p>
              <FaStar className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="w-full flex items-center justify-end gap-1">
              {currentTime >= storeData.openAt && currentTime <= storeData.closeAt ? (
                <MdAccessTimeFilled className="w-10 h-8 text-green-500" />
              ) : (
                <MdAccessTimeFilled className="w-10 h-8 text-red-500" />
              )}
              {storeData.openAt} - {storeData.closeAt}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default StoreCard;
