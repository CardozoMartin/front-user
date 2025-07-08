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

    if (isLoading) return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <div className="text-center">
                {/* Spinner de botella animada */}
                <div className="mb-4">
                    <div className="bottle-spinner">
                        <div className="bottle">
                            <div className="bottle-neck"></div>
                            <div className="bottle-body">
                                <div className="liquid"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <h4 className="text-primary mb-2">Cargando bebidas...</h4>
                <p className="text-muted">Estamos preparando nuestro catálogo de bebidas para ti</p>
            </div>
            
            {/* Estilos CSS para el spinner */}
            <style jsx>{`
                .bottle-spinner {
                    animation: bounce 1.5s ease-in-out infinite;
                }
                
                .bottle {
                    width: 30px;
                    height: 80px;
                    position: relative;
                    margin: 0 auto;
                }
                
                .bottle-neck {
                    width: 8px;
                    height: 20px;
                    background: linear-gradient(145deg, #28a745, #20c997);
                    margin: 0 auto;
                    border-radius: 4px 4px 0 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .bottle-body {
                    width: 30px;
                    height: 60px;
                    background: linear-gradient(145deg, #ffffff, #f8f9fa);
                    border: 2px solid #28a745;
                    border-radius: 0 0 15px 15px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                
                .liquid {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 40%;
                    background: linear-gradient(45deg, #007bff, #0056b3);
                    border-radius: 0 0 13px 13px;
                    animation: fill 2s ease-in-out infinite;
                }
                
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    40% {
                        transform: translateY(-20px) rotate(-5deg);
                    }
                    60% {
                        transform: translateY(-10px) rotate(5deg);
                    }
                }
                
                @keyframes fill {
                    0%, 100% { height: 20%; }
                    50% { height: 60%; }
                }
            `}</style>
        </div>
    )
    
    if (isError) return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <div className="text-center">
                {/* Ícono de botella rota */}
                <div className="mb-4">
                    <div className="error-icon">
                        🍺💔
                    </div>
                </div>
                <h4 className="text-danger mb-3">¡Ups! No pudimos cargar las bebidas</h4>
                <p className="text-muted mb-4">
                    Parece que nuestro stock de bebidas está temporalmente agotado en el sistema.
                    <br />
                    Por favor, intenta recargar la página.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                    <button 
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                    >
                        <i className="fas fa-redo me-2"></i>
                        Recargar catálogo
                    </button>
                    <button 
                        className="btn btn-outline-secondary"
                        onClick={() => window.history.back()}
                    >
                        <i className="fas fa-arrow-left me-2"></i>
                        Volver atrás
                    </button>
                </div>
            </div>
            
            <style jsx>{`
                .error-icon {
                    font-size: 4rem;
                    animation: shake 1s ease-in-out infinite;
                    display: inline-block;
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px) rotate(-5deg); }
                    75% { transform: translateX(5px) rotate(5deg); }
                }
            `}</style>
        </div>
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