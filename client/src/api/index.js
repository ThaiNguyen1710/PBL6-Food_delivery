import axios from "axios";

export const baseURL =
  "https://pbl-6-nine.vercel.app";
  export const baseURL1 =
  "https://pbl-6-ver2.vercel.app";


  //user

export const validateUserJWTToken = async (token) => {
  try {
    const res = await axios.get(`${baseURL}/pbl6/auth`, {
      headers: { Authorization: "Bearer " + token },
    });
    return res.data;
  } catch (err) {
    return null;
  }
};
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${baseURL}/pbl6/user/login`, { email, password });
    
    return response; 
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
  
    throw error; 
  }
};

export const signUpUser =async (data) => {
  try {
    const res = await axios.post(`${baseURL}/pbl6/user/register`, data);

    return res.data; 
  } catch (err) {
    console.error( err);
    return null;
  }
}
 
export const editUser = async (userId, data) => {
  try {
    const res = await axios.put(`${baseURL}/pbl6/user/${userId}`, data);
    return res.data; 
  } catch (err) {
    console.error("Error in editUser function:", err);
    return null;
  }
};
export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${baseURL}/pbl6/user`);
    return res.data;
  } catch (err) {
    return null;
  }
};



//Category
export const addNewCategory = async (data) => {
  try {
    const res = await axios.post(`${baseURL}/pbl6/category`, {
      ...data,
    });
    return res.data;
  } catch (err) {
    
    return null;
  }
};
export const getAllCategory = async () => {
  try {
    const res = await axios.get(`${baseURL}/pbl6/category`);
    
    return res;
  } catch (err) {
    return null;
  }
};


//Product
export const PostCreate = (formData) => {
  return axios.post(`${baseURL}/pbl6/product`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const PostUser = (id,formData) => {
  return  axios.put(`${baseURL}/pbl6/user/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const PostContact = (formData) => {
  return axios.put(`${baseURL1}/pbl6/user`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const addNewProduct = async (data) => {
  try {
    const res = await axios.post(`${baseURL}/pbl6/product`, {
      ...data,
    });

    return res.data.data;
  } catch (err) {
    return null;
  }
};

export const getAllProducts = async () => {
  try {
    const res = await axios.get(`${baseURL}/pbl6/product`);
    
    return res.data;
  } catch (err) {
    return null;
  }
};


export const deleteAProduct = async (productId) => {
  try {
    const res = await axios.delete(
      `${baseURL}/pbl6/product/${productId}`
    );
    return res.data.data;
  } catch (err) {
    return null;
  }
};


export const editProduct = async (productId, data) => {
  try {
    const res = await axios.put(
      `${baseURL}/pbl6/product/${productId}`,
      data
    );
     
    return res.data;
  } catch (err) {
    return null;
  }
};



//Cart
export const addNewItemToCart = async (data) => {
  try {
    const res = await axios.post(
      `${baseURL}/pbl6/orderItem`,
      { ...data }
    );
    return res.data.data;
  } catch (error) {
    return null;
  }
};


export const getAllCartItems = async (products, users) => {
  try {
    const res = await axios.get(
      `${baseURL}/pbl6/orderItem`,
      {
        params: {
          products: products ? products.join(',') : undefined,
          users: users ? users.join(',') : undefined
        }
      }
    );
    return res.data; // Trả về dữ liệu được trả về từ backend sau khi lấy các mục trong giỏ hàng
  } catch (error) {
    return null;
  }
};
//cart increment

export const incrementItemQuantity = async (order_id) => {
  try {
    const res = await axios.put(
      `${baseURL}/pbl6/orderItem/asc/${order_id}`,
      null,
      { params: { order_id: order_id } }
    );
    return res.data.data;
  } catch (error) {
    return null;
  }
};
export const decrementItemQuantity = async (order_id) => {
  try {
    const res = await axios.put(
      `${baseURL}/pbl6/orderItem/desc/${order_id}`,
      null,
      { params: { order_id: order_id } }
    );
    return res.data.data;
  } catch (error) {
    return null;
  }
};
export const clearItem = async (user_id) => {
  try {
    const res = await axios.delete(
      `${baseURL}/pbl6/orderItem/${user_id}`
    );

    return res.data.data;
  } catch (error) {
    return null;
  }
};
export const clearAllCart = async (user_id) => {
  try {
    const res = await axios.delete(
      `${baseURL}/pbl6/orderItem/delAll/${user_id}`
    );

    return res.data.data;
  } catch (error) {
    return null;
  }
};

export const handleCheckOut = async (orderData) => {
  try {
    const response = await axios.post(`${baseURL}/pbl6/order`, orderData);
    return response.data; 
  } catch (error) {
    console.log(error);
    throw error; 
  }
};
//get all orders
export const getAllOrders = async () => {
  try {
    const res = await axios.get(`${baseURL}/pbl6/order`);
    return res.data;
  } catch (err) {
    return null;
  }
};

export const updatedOrder = async (order_id,newData) => {
  try {
    const res = await axios.put(
      `${baseURL}/pbl6/order/${order_id}`,
      newData
    
    );
    return res.data;
  } catch (err) {
    return null;
  }
};


//rating
export const ratingProduct = async (orderData) => {
  try {
    const response = await axios.post(`${baseURL}/pbl6/rated`, orderData);
    return response.data; 
  } catch (error) {
    console.log(error);
    throw error; 
  }
};