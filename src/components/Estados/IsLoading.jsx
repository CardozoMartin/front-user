import React from 'react'
import './IsLoading.css'
const IsLoading = () => {
  return (
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
           
        </div>
  )
}

export default IsLoading