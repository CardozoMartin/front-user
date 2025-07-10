import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getProductos } from '../api/ApiProductos'

import IsLoading from '../components/Estados/IsLoading'
import IsError from '../components/Estados/IsError'
import CardCarousel from '../components/Productos/CardCarousel'

const AllProduct = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["pedidos"],
        queryFn: getProductos
    })

    // Extraer marcas únicas de los datos
    const marcasUnicas = data ? [...new Set(data.map(producto => producto.marca))] : []

    if (isLoading) return (
        <IsLoading />
    )

    if (isError) return (
        <IsError />
    )

    return (
        <>
            <div className='container mt-5'>

                {marcasUnicas.map(marca => (
                    <CardCarousel
                        key={marca}
                        data={data}
                        marcaNombre={marca}
                    />
                ))}
            </div>
        </>
    )
}

export default AllProduct