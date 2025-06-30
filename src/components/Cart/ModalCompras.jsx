import React, { useEffect, useState } from 'react'
import { useCarritoStore } from '../Store/useCarritoStore';
import { useMutation } from '@tanstack/react-query';
import { postCart } from '../../api/ApiCart';

const ModalCompras = ({ modalOpen, setModalOpen }) => {
//importaciones y modelo de cliente, carrito y producto
    const [cliente, setCliente] = useState([{
        id:"6833d3115c616627a253a9e3",
        name: "daniel",
        phone: "3812032666",
        email: "daniel@hotmail.com"
    }])

   
    const { carrito } = useCarritoStore();

//Tquery ----------------------------------------
const createOrderMutatios = useMutation({
    mutationFn: postCart,
    onSuccess: ()=>{
        console.log('Carrito enviado correctamente');
        // Aquí puedes manejar la respuesta del servidor, como mostrar un mensaje de éxito
    },
    onError:()=>{}
})

  

    const handleBuyNow = () => {

        //calculamoos el total del carrito
        const totalCarrito = carrito.reduce((total,item)=> total + (item.precio * item.cantidad),0)
        //creamos el modelo de productos que tiene que enviarse al servidor

        const sendProductos = carrito.map(item => ({
            id: item.id,
            quantity: item.cantidad,
            price: item.precio,
            name: item.nombre}))
            console.log('Productos a enviar:', sendProductos);
        //vamos guardando la informacion del carrito en el nuevo carrito
        const newCart = {
            user: cliente,
            productos: sendProductos,
            total: totalCarrito,
            paymentMethod: 'Efectivo',
             status: "pendiente",
            fecha: new Date().toISOString(),
            delivered: false, // o cualquier otro método de pago
        };

        console.log('Nuevo carrito:', newCart);
        // Aquí puedes manejar la lógica de compra
        createOrderMutatios.mutate(newCart)
        
        setModalOpen(false);
    };

    // Mostrar el newCart actualizado cada vez que cambie


    return (
        <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirmar Compra</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setModalOpen(false)}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {/* Aquí puedes mostrar los detalles del carrito y el total */}
                        <p>Detalles de la compra...</p>
                        {carrito.length > 0 ? (
                            <ul>
                                {carrito.map((item, index) => (
                                    <li key={index}>
                                        <img src={item.imagen} alt={item.name} style={{ width: '50px', height: '50px' }} />
                                        <strong>{item.marca}</strong> -
                                        {item.name} - Cantidad: {item.cantidad} - Precio: ${item.precio}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay productos en el carrito.</p>)}
                    </div>

                    <div className="modal-footer">
                        <p className="fw-bold">Total: ${carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0)}</p>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setModalOpen(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleBuyNow}
                        >
                            Confirmar Compra
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalCompras