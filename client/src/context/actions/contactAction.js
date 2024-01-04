export const setContacts= (data)=>{
    return {
        type: "SET_CONTACTS",
        contacts: data,
    }
}

export const getContacts = (data)=>{
    return {
        type: "GET_CONTACTS",
       
    }
}
