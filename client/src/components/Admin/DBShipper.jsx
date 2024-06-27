import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseURL, editShipper, getAllShipper } from "../../api";
import DataTable from "./DataTable";
import { avatar } from "../../assets";
import { alertNULL, alertSuccess } from "../../context/actions/alertActions";
import { setAllShipper } from "../../context/actions/allShipperAction";
import RevenueShipper from "./RevenueShipper"; // Import component RevenueShipper

const DBShipper = () => {
  const shipper = useSelector((state) => state.shipper);
  const dispatch = useDispatch();
  const [selectedShipper, setSelectedShipper] = useState(null); // State to manage selected shipper

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
            title: <p className="font-semibold text-xl font-sans">Ảnh</p>,
            field: "photoURL",
            render: (rowData) => (
              <img
                src={baseURL + rowData.image ? baseURL + rowData.image : avatar}
                className="w-32 h-24 object-cover rounded-md"
                alt=""
              />
            ),
          },
          {
            title: <p className="font-semibold text-xl font-sans">Tên</p>,
            field: "name",
            render: (rowData) => (
              <p className="text-textColor font-sans font-medium ">{rowData.name}</p>
            ),
          },
          {
            title: <p className="font-semibold text-xl font-sans">Email</p>,
            field: "email",
            render: (rowData) => (
              <p className="text-textColor font-sans font-medium ">{rowData.email}</p>
            ),
          },
          {
            title: <p className="font-semibold text-xl font-sans">Sđt</p>,
            field: "phone",
            render: (rowData) => (
              <p className="text-textColor font-sans font-medium ">{rowData.phone}</p>
            ),
          },
          {
            title: <p className="font-semibold text-xl font-sans">Địa chỉ</p>,
            field: "address",
            render: (rowData) => (
              <p className="text-textColor font-sans font-medium ">{rowData.address}</p>
            ),
          },
         
          {
            title: <p className="font-semibold text-xl font-sans">Khóa</p>,
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
          {
            title: <p className="font-semibold text-xl font-sans">Doanh thu</p>,
            field: "revenueButton",
            render: (rowData) => (
              <button
                onClick={() => setSelectedShipper(rowData)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 font-sans"
              >
                Chi tiết
              </button>
            ),
          },
        ]}
        data={shipper}
        title={
          <p className="font-semibold text-orange-500 text-3xl font-sans">Danh sách shipper</p>
        }
      />
      {selectedShipper && (
        <RevenueShipper
          shipperData={selectedShipper}
          onClose={() => setSelectedShipper(null)}
        />
      )}
    </div>
  );
};

export default DBShipper;
