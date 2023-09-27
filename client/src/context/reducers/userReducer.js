const userReducer = (state = null, action)=>{
    switch(action.type){
        case "GET_USER":
            return state
        case "SET_USER":
            return action.user
        
            default:
                return state
    }

}

export default userReducer;