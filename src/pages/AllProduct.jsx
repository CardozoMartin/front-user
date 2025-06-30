import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getProductos } from '../api/ApiProductos'
import GaleriProduc from '../components/GaleriProduc'
import CardCarousel from '../components/CardCarousel'

const AllProduct = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["pedidos"], 
        queryFn: getProductos
    })

    // Extraer marcas únicas de los datos
    const marcasUnicas = data ? [...new Set(data.map(producto => producto.marca))] : []

    if (isLoading) return <div>Cargando...</div>
    if (isError) return <div>Error al cargar productos</div>

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