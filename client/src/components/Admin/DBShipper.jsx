import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseURL, editShipper, getAllShipper } from "../../api";
import DataTable from "./DataTable";
import { avatar } from "../../assets";

import { alertNULL, alertSuccess } from "../../context/actions/alertActions";
import { setAllShipper } from "../../context/actions/allShipperAction";
const DBShipper = () => {
  const shipper = useSelector((state) => state.shipper);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!shipper) {
      getAllShipper().then((data) => {
        dispatch(setAllShipper(data));
      });
    }
  }, []);

  const blockShipper = async (rowData) => {
    try {
      const shipperId = rowData.id;
      const newData = {
        isFeatured: !rowData.isFeatured,
      };

      const updatedUserData = await editShipper(shipperId, newData);

      if (updatedUserData) {
        getAllShipper().then((data) => {
          dispatch(setAllShipper(data));
        });
        dispatch(alertSuccess("Cập nhật thành công  "));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      } else {
        throw new Error("Failed to update user information");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 pt-6 w-full">
      <DataTable
        columns={[
          {
            title: <p className="font-semibold text-xl">Ảnh</p>,
            field: "photoURL",
            render: (rowData) => (
              <img
                src={baseURL + rowData.image ? baseURL + rowData.image : avatar}
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
            title: <p className="font-semibold text-xl">Email</p>,
            field: "email",
            render: (rowData) => (
              <p className="text-textColor font-medium ">{rowData.email}</p>
            ),
          },
          {
            title: <p className="font-semibold text-xl">Sđt</p>,
            field: "phone",
            render: (rowData) => (
              <p className="text-textColor font-medium ">{rowData.phone}</p>
            ),
          },
          {
            title: <p className="font-semibold text-xl">Địa chỉ</p>,
            field: "address",
            render: (rowData) => (
              <p className="text-textColor font-medium ">{rowData.address}</p>
            ),
          },
          {
            title: <p className="font-semibold text-xl">Khóa</p>,
            field: "isFeatured",
            render: (rowData) => (
              <select
                value={rowData.isFeatured}
                onChange={() => blockShipper(rowData)}
                className="border rounded-md bg-cardOverlay w-32 h-10 font-semibold"
                style={{ color: rowData.isFeatured === true ? "blue" : "red" }}
              >
                <option value="true" className="font-semibold text-blue-500">
                  Hoạt động
                </option>
                <option value="false" className="font-semibold text-red-500">
                  Khóa
                </option>
              </select>
            ),
          },
        ]}
        data={shipper}
        title={
          <p className="font-semibold text-red-400 text-3xl">Danh sách shipper</p>
        }
        // actions={[
        //   {
        //     icon: "edit",
        //     tooltip: "Edit Data",
        //     onClick: (event, rowData) => {
        //       alert("You want to edit" + rowData.productId);
        //     },
        //   },
        //   {
        //     icon: "delete",
        //     tooltip: "Delete Data",
        //     onClick: (event, rowData) => {
        //       if (window.confirm("Are you sure?")) {
        //         deleteAProduct(rowData.productId).then((res) => {
        //           dispatch(alertSuccess("Product Deleted "));
        //           setInterval(() => {
        //             dispatch(alertNULL());
        //           }, 3000);
        //           getAllProducts().then((data) => {
        //             dispatch(setAllProducts(data));
        //           });
        //         });
        //       }
        //     },
        //   },
        // ]}
      />
    </div>
  );
};

export default DBShipper;
