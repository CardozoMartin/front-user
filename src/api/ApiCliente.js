import axios from "axios"

const API_URL = "http://localhost:4000/api/clientes"

export const getClientForPhoneFn = async(phone)=>{
    try {
        const res = await axios.get(`${API_URL}/phone/${phone}`)
        return res.data
    } catch (error) {
        console.error(error)
    }
}

export const postCliente = async (cliente)=>{
    try {
        const res = await axios.post(`${API_URL}/`, cliente)
        return res.data
    } catch (error) {
        console.error("Error al crear el cliente:", error);
        throw error;
    }
}