import axios from "axios"


export const getProductos = async()=>{
    try {
        const { data} = await axios.get("http://localhost:4000/api/bebidas/allbebidas")
        console.log(data)
        return data.bebidas;
    } catch (error) {
        console.error(error)
    }
}