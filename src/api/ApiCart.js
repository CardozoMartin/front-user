import axios from "axios"


export const postCart = async (cart) => {

    try {
        const res = await axios.post(`http://localhost:4000/api/cart/`, cart)
        return res.data;
    } catch (error) {
        console.error("Error al enviar el carrito:", error);
        throw error;
    }
}