import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import DataTable from "./DataTable";
import { deleteContact, getAllContacts } from "../../api";
import { setContacts } from "../../context/actions/contactAction";
import { motion } from "framer-motion";
import { alertNULL, alertSuccess } from "../../context/actions/alertActions";

const ContactUser = () => {
  const contacts = useSelector((state) => state.contacts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!contacts) {
      getAllContacts().then((data) => {
        dispatch(setContacts(data));
      });
    }
  }, [contacts, dispatch]);

  const handleConfirmation = (rowData) => {
    if (window.confirm("Xác nhận hoàn thành!")) {
      deleteContact(rowData._id).then((res) => {
        dispatch(alertSuccess("Đã phản hồi! "));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
        getAllContacts().then((data) => {
          dispatch(setContacts(data));
        });
      });
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 pt-6 w-full">
      <DataTable
        columns={[
          {
            title: <p className="font-semibold text-xl ">Người dùng</p>,
            field: "name",
            render: (rowData) => (
              <div>
                <p className="text-textColor font-medium">
                  <strong>Name:</strong> {rowData.user.name}
                </p>
                <p className="text-textColor font-medium">
                  <strong>Email:</strong> {rowData.user.email}
                </p>
                <p className="text-textColor font-medium">
                  <strong>Phone:</strong> {rowData.user.phone}
                </p>
              </div>
            ),
          },
          {
            title: <p className="font-semibold text-xl ">Nội dung</p>,
            field: "address",
            render: (rowData) => (
              <motion.div className="w-full h-32 flex flex-col items-start justify-start px-2 py-1 border relative border-gray-300 bg-cardOverlay drop-shadow-md rounded-md gap-1">
                {" "}
                <p
                  className="text-textColor font-medium"
                  style={{ width: "600px" }}
                >
                  {rowData.comment}
                </p>
              </motion.div>
            ),
          },
          {
            title: <p className="font-semibold text-xl items-center justify-center ">Xác nhận phản hồi</p>,
            
            render: (rowData) => (
              <motion.button
                onClick={() => handleConfirmation(rowData)}
                className="border rounded-md shadow-md cursor-pointer hover:bg-emerald-400 w-24 h-10 font-semibold text-textColor bg-emerald-300"
               
              >
                Hoàn thành
              </motion.button>
            ),
          },
        ]}
        data={contacts}
        title={
            <p className="font-semibold text-red-400 text-3xl">
              Danh sách liên hệ
            </p>
          }
      />
    </div>
  );
};

export default ContactUser;
