const categoryReducer = (state = null, action)=>{
    switch(action.type){
        case "GET_ALL_CATEGORY":
            return state
        case "SET_ALL_CATEGORY":
            return action.user
        
        default:
                return state
    }

}

export default categoryReducer