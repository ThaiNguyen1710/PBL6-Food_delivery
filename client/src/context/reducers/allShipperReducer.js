const allShipperReducer = (state = null, action) => {
    switch (action.type) {
      case "GET_ALL_SHIPPER":
        return state;
  
      case "SET_ALL_SHIPPER":
        return action.allShippers;
  
  
      default: 
          return state;
    }
  };
  
  export default allShipperReducer ;
  