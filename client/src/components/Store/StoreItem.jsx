import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { FaDongSign, FaStar } from "react-icons/fa6";
import {
  baseURL,
  deleteAProduct,
  editProduct,
  getAllCategory,
  getAllProducts,
} from "../../api";
import { setAllProducts } from "../../context/actions/productAction";
import { alertNULL, alertSuccess } from "../../context/actions/alertActions";
import { motion } from "framer-motion";
import { buttonClick, slideIn } from "../../animations";
import { BiChevronsLeft } from "react-icons/bi";
import DataTable from "../Admin/DataTable";

const StoreItem = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!products) {
      getAllProducts().then((data) => {
        dispatch(setAllProducts(data));
      });
    }
    const fetchData = async () => {
      try {
        const res = await getAllCategory();
        if (res && res.data) {
          setStatusList(res.data); // Cập nhật state với dữ liệu từ API
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);
  const [statusList, setStatusList] = useState([]);
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);
  const filteredProducts = products
    ? products.filter((product) => product?.user?.id === user?.user?.userId)
    : [];

  const dispatch = useDispatch();

  const handleEditClick = (event, rowData) => {
    setSelectedProduct(rowData);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedProduct = await editProduct(
        selectedProduct.id,
        selectedProduct
      );
      console.log(updatedProduct);

      if (updatedProduct) {
        getAllProducts().then((data) => {
          dispatch(setAllProducts(data));
        });

        setIsEditModalOpen(false);

        dispatch(alertSuccess("Product Updated"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      } else {
        dispatch(alertSuccess("Cập nhật thành công!"));

        setTimeout(() => {
          dispatch(alertNULL());

          // window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const blockProduct = async (rowData) => {
    try {
      const productId = rowData.id;


      
   

      const newData={
        isFeatured: String(!rowData.isFeatured),
      }
      const updatedProduct = await editProduct(productId, newData);
      console.log(productId)
      console.log(newData)
      console.log(updatedProduct)

      if (updatedProduct) {
        getAllProducts().then((data) => {
          dispatch(setAllProducts(data));
        });
        dispatch(alertSuccess("Product information updated successfully"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      } else {
        throw new Error("Failed to update product information");
      }
    } catch (error) {
      console.error("Error updating product information:", error);
      dispatch(alertSuccess("Cập nhật thông tin sản phẩm không thành công"));

      setTimeout(() => {
        dispatch(alertNULL());
        // window.location.reload();
      }, 3000);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 pt-6 w-full">
      <DataTable
        columns={[
          {
            title: <p className="font-semibold text-xl">Ảnh</p>,
            field: "image",
            render: (rowData) => (
              <img
                src={baseURL + rowData.image}
                className="w-32 h-16 object-contain rounded-md"
                alt=""
              />
            ),
          },
          {
            title: <p className="font-semibold text-xl">Tên</p>,
            field: "name",
            render: (rowData) => (
              <p className="text-textColor font-medium ">{rowData.name}</p>
            ),
          },
          {
            title: <p className="font-semibold text-xl">Loại</p>,
            field: "category.name",
            render: (rowData) => (
              <p className="text-textColor font-medium ">
                {rowData.category.name}
              </p>
            ),
          },
          {
            title: <p className="font-semibold text-xl">Thông tin</p>,
            field: "description",
            render: (rowData) => (
              <p className="text-textColor font-medium ">
                {rowData.description}
              </p>
            ),
          },
          // {
          //   title: <p className="font-semibold text-xl">Store Owner</p>,
          //   field: "user.name",
          //   render: (rowData) => (
          //     <p className="text-textColor font-medium ">{rowData.user.name}</p>
          //   ),
          // },
          {
            title: <p className="font-semibold text-xl">Giá</p>,
            field: "price",
            render: (rowData) => (
              <p className="text-textColor text-2xl flex font-semibold items-center justify-start gap-2">
                {parseFloat(rowData.price).toLocaleString("vi-VN")}
                <FaDongSign className="text-red-400" />
              </p>
            ),
          },
          {
            title: <p className="font-semibold text-xl">Trạng thái</p>,
            field: "isFeatured",
            render: (rowData) => (
              <select
                value={rowData.isFeatured  }
                onChange={() => blockProduct(rowData)}
                className="border rounded-md bg-cardOverlay w-24 h-10 font-semibold"
                style={{ color: rowData.isFeatured === true ? "blue" : "red" }}
              >
                <option value="true" className="font-semibold text-blue-500">
                 Còn hàng
                </option>
                <option value="false" className="font-semibold text-red-500">
                  Bán hết
                </option>
              </select>
            ),
          },
          {title: <p className="font-semibold text-xl">Lượt bán</p>,
          field: "rowData.numRated",
          render: (rowData) => (
            <p className="text-textColor font-medium ">{rowData.numRated}+</p>
          ),
        },
          {
            title: <p className="font-semibold text-xl">Đánh giá</p>,
            field: "ratings",
            render: (rowData) => (
              <div className="flex justify-center items-center gap-1 text-base font-normal">
                <p className="text-textColor font-medium ">
                  {parseFloat(rowData.ratings).toFixed(1)}
                </p>
                <FaStar className="text-orange-400 text-base font-normal" />
              </div>
            ),
          },
        ]}
        data={filteredProducts}
        title={
          <p className="font-semibold text-red-400 text-3xl">
            Danh sách sản phẩm
          </p>
        }
        actions={[
          {
            icon: "edit",
            tooltip: "Edit Data",
            onClick: handleEditClick,
          },
          {
            icon: "delete",
            tooltip: "Delete Data",
            onClick: (event, rowData) => {
              if (window.confirm("Bạn có chắc?")) {
                deleteAProduct(rowData.id).then((res) => {
                  dispatch(alertSuccess("Sản phẩn đã xóa!"));
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

      {/* Modal để hiển thị thông tin sản phẩm và cập nhật */}
      {isEditModalOpen && (
        <motion.div
          className="modal fixed z-50  top-32 w-300 md:w-508 bg-zinc-600 backdrop-blur-md shadow-md h-[70%] items-center justify-start gap-4 flex flex-col"
          {...slideIn}
        >
          <div className="w-full flex items-center justify-center  px-3">
            <motion.i className="cursor-pointer">
              <BiChevronsLeft
                className="text-[50px] text-primary"
                {...buttonClick}
                onClick={handleCloseModal}
              />
            </motion.i>
            <p className="text-2xl text-orange-600 mx-auto font-semibold">
              Edit Product
            </p>
          </div>
          <motion.div className="w-full flex flex-col items-center justify-center h-[70%] mt-0 bg-zinc-800 rounded-3xl drop-shadow-md px-4 gap-4 ">
            <div className="modal-content flex flex-col gap-2 w-full ">
              <p className="text-xl text-orange-400 font-semibold ">Tên </p>
              <input
                className="rounded-md w-[80%] h-10 bg-cardOverlay ay items-center justify-center font-semibold px-4  mx-auto text-primary cursor-pointer "
                type="text"
                value={selectedProduct?.name}
                onChange={(e) => {
                  setSelectedProduct((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
              />

              <p className="text-xl text-orange-400 font-semibold">Loại </p>
              <select
                className="rounded-md w-[80%] h-10 bg-cardOverlay items-center justify-center font-semibold px-4 mx-auto text-primary cursor-pointer"
                value={selectedProduct?.category?.id}
                onChange={(e) => {
                  setSelectedProduct((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }));
                }}
              >
                {statusList.map((status) => (
                  <option
                    key={status.id}
                    value={status.id}
                    className="text-headingColor"
                  >
                    {status.name}
                  </option>
                ))}
              </select>
              <p className="text-xl text-orange-400 font-semibold">
                Thông Tin{" "}
              </p>
              <input
                className="rounded-md w-[80%] h-10 bg-cardOverlay items-center justify-center font-semibold px-4 mx-auto text-primary cursor-pointer"
                type="text"
                value={selectedProduct?.description}
                onChange={(e) => {
                  setSelectedProduct((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                }}
              />
              <p className="text-xl text-orange-400 font-semibold">Giá </p>
              <input
                className="rounded-md w-[80%] h-10 bg-cardOverlay items-center justify-center font-semibold mx-auto  px-4 text-primary cursor-pointer"
                type="number"
                value={selectedProduct?.price}
                onChange={(e) => {
                  setSelectedProduct((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }));
                }}
              />
            </div>
          </motion.div>
          <motion.div
            className="w-[80%]  h-10 rounded-full bg-orange-400 shadow-md items-center justify-center flex cursor-pointer"
            {...buttonClick}
            onClick={handleSaveChanges}
          >
            <p className="text-2xl font-semibold text-primary">Lưu</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default StoreItem;
