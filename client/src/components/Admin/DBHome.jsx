import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../api";
import { setAllProducts } from "../../context/actions/productAction";
import { CChart } from "@coreui/react-chartjs";
import { statuses } from "../../utils/styles";

const DBHome = () => {


  
  const products = useSelector((state) => state.products );
  const dispatch = useDispatch();

  const category = [...new Set(statuses.map(item => item.category))]

  const categoryCounts = {};

  // Lặp qua danh sách sản phẩm và tính độ dài cho mỗi category
  if(products){
    products.forEach((product) => {
      const category = product.product_category;
    
      if (categoryCounts[category]) {
        categoryCounts[category] += 1;
      } else {
        categoryCounts[category] = 1;
      }
    });
  }
   
    useEffect(()=>{
      if(!products){
        getAllProducts().then(data=>{
          dispatch(setAllProducts(data))
        })
      }
    },[])
 
  return (
    <div className="flex items-center justify-center flex-col pt-6 w-full h-full">
      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-20 h-full">
        <div className="flex items-center justify-center ">
          <div className="w-508 md:w-656">
            <CChart
              type="bar"
              data={{
                labels: category,
                datasets: [
                  {
                    label: "Category Count",
                    backgroundColor: ["#36A2EB", "#FF6384",
                    "#4BC0C0",
                    "#FFCE56",
                    "#E7E9ED",
                    "#36A2EB",],
                    data: categoryCounts,
                  },
                ],
              }}
              labels="category"
             
            />
          </div>
        </div>
        <div className="w-340 md:w-508">
          <CChart
            type="polarArea"
            data={{
              labels: ["Orders", "Delivered", "Cancelled", "Paid", "NotPaid"],
              datasets: [
                {
                  data: [11, 16, 7, 3, 14],
                  backgroundColor: [
                    "#FF6384",
                    "#4BC0C0",
                    "#FFCE56",
                    "#E7E9ED",
                    "#36A2EB",
                  ],
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DBHome;
