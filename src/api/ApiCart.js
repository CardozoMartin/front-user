import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const postCart = async (cart) => {

    try {
        const res = await axios.post(`${API_URL}/api/cart/`, cart)
        return res.data;
    } catch (error) {
        console.error("Error al enviar el carrito:", error);
        throw error;
    }
}