import axios from'axios'

export const baseURL="http://localhost:5001/food-delivery-app-1449c/us-central1/app"

export const validateUserJWTToken = async (token) =>{
    try{
        const res = await axios.get(`${baseURL}/api/user/jwtVerfication`,{
            headers: {Authorization: "Bearer "+token}
        })
        return res.data.data;
    }catch(err){
        return null
    }
}