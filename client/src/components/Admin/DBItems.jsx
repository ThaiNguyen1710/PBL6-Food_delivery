import React, { useEffect } from "react";
import DataTable from "./DataTable";
import { useDispatch, useSelector } from "react-redux";
import { FaDongSign } from "react-icons/fa6";
import { deleteAProduct, getAllProducts } from "../../api";
import { setAllProducts } from "../../context/actions/productAction";
import { alertNULL, alertSuccess } from "../../context/actions/alertActions";

const DBItems = () => {
    useEffect(()=>{
      if(!products){
        getAllProducts().then(data=>{
          dispatch(setAllProducts(data))
        })
      }
    },[])
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
  return (
    <div className="flex justify-center items-center gap-4 pt-6 w-full">
      <DataTable
        columns={[
          {
            title: "Image",
            field: "product_image",
            render: (rowData) => (
              <img
                src={rowData.product_image}
                className="w-32 h-16 object-contain rounded-md"
                alt=""
              />
            ),
          },
          {
            title: "Name",
            field: "product_name",
          },
          {
            title: "Category",
            field: "product_category",
          },
          {
            title: "Description",
            field: "product_information",
          },
          {
            title: "Price",
            field: "product_price",
            render: (rowData) => (
              <p className="text-textColor text-2xl flex font-semibold items-center justify-start gap-2">
                {parseFloat(rowData.product_price).toFixed(0)}
                <FaDongSign className="text-red-400" />
              </p>
            ),
          },
        ]}
        data={products}
        title="List of products"
        actions={[
          {
            icon: "edit",
            tooltip: "Edit Data",
            onClick: (event, rowData) => {
              alert("You want to edit" + rowData.productId);
            },
          },
          {
            icon: "delete",
            tooltip: "Delete Data",
            onClick: (event, rowData) => {
              if (window.confirm("Are you sure?")) {
                deleteAProduct(rowData.productId).then((res) => {
                  dispatch(alertSuccess("Product Deleted "));
                  setInterval(() => {
                    dispatch(alertNULL());
                  }, 3000);
                  getAllProducts().then((data) => {
                    dispatch(setAllProducts(data));
                  });
                });
              }
            },
          },
        ]}
      />
    </div>
  );
};

export default DBItems;
