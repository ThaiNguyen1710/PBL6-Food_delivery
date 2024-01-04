
const contactReducer = (state = null, action) => {
    switch (action.type) {
      case "GET_CONTACTS":
        return state;
        case "SET_CONTACTS":
          return action.contacts
          
      default:
        return state;
    }
  };
  export default contactReducer;
  