import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL 

export const postCart = async (cart) => {

    try {
        const res = await axios.post(`${API_URL}/api/cart/`, cart)
        return res.data;
    } catch (error) {
        console.error("Error al enviar el carrito:", error);
        throw error;
    }
}

export const getLastCart = async (phone)=>{

    try {
        const res = await axios.get(`${API_URL}/api/cart/lastcart/${phone}`)
        return res.data;
    } catch (error) {
        console.error("Error al obtener el último carrito:", error);
        throw error;
    }
}