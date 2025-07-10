import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL 
export const getProductos = async()=>{
    try {
        const { data} = await axios.get(`${API_URL}/api/bebidas/allbebidas`)
        console.log(data)
        return data.bebidas;
    } catch (error) {
        console.error(error)
    }
}