import React from 'react'
import './isError.css'
const IsError = () => {
  return (
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
            
           
        </div>
  )
}

export default IsError