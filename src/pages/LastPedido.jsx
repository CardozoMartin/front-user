import React from 'react'
import { useForm } from 'react-hook-form';
import { getLastCart } from '../api/ApiCart';
import { useQuery } from '@tanstack/react-query';
const LastPedido = () => {

    //RHF-----------------------------------
    const { register, handleSubmit : onSubmitRHF, formState: { errors } } = useForm()



    //TQuery------------------------------------
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['lastPedido'],
        queryFn: getLastCart
    })


    //handler-----------------------------------
    const handleSubmit = async (data) => {
        try {
            const response = await getLastCart(data.phone);
            console.log("Último pedido:", response);
            // Aquí puedes manejar la respuesta, por ejemplo, mostrarla en el estado o en un modal
        } catch (error) {
            console.error("Error al obtener el último pedido:", error);
        }
    }

  return (
    <div className='container mt-5 lastmargin'>
        <h1 className="text-center mt-5">Consultar Pedido</h1>
        <p className="text-center">Aquí podrás consultar el estado de tus pedidos recientes.</p>
        <p className="text-center lead">Recuerda que cuando cambie el estado de tu pedido seras notificado por el numero que ingresaste o el email que proporcionaste.</p>

        <form action="" className="d-flex justify-content-center mt-4" onSubmit={onSubmitRHF(handleSubmit)}>
            <fieldset className='d-flex gap-2 align-items-center' style={{ maxWidth: '600px', width: '100%' }}>
            {/* como es la clase del input para que sea mas grande*/}
          <input className='form-control'  type="text" placeholder="Introduce tu número de pedido" />
          <button className='btn btn-primary' type="submit">Consultar</button>
            </fieldset>
        </form>
    </div>
  )
}

export default LastPedido