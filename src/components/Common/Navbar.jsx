import React from 'react';
import { useCarritoStore } from '../Store/useCarritoStore';

const Navbar = () => {
  const { getTotalItems, abrirCarrito } = useCarritoStore();
  const totalItems = getTotalItems();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top border-bottom border-2 border-secondary">
      <div className="container-fluid container">
        <a className="navbar-brand" href="#">DistriNort</a>
        <div>
          {/* Botón del carrito con badge actualizado */}
          <button 
            className='btn btn-outline position-relative me-2'
            onClick={abrirCarrito}
            title="Abrir carrito"
          >
            {/* Bootstrap cart icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .485.379L2.89 5H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 14H4a.5.5 0 0 1-.491-.408L1.01 2H.5a.5.5 0 0 1-.5-.5zm3.14 4l1.25 6.5h7.22l1.25-6.5H3.14zM5 12a2 2 0 1 0 4 0H5z"/>
            </svg>
            {/* Badge animado con el número de items */}
            {totalItems > 0 && (
              <span 
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{
                  animation: totalItems > 0 ? 'pulse 0.5s ease-in-out' : 'none'
                }}
              >
                {totalItems > 99 ? '99+' : totalItems}
                <span className="visually-hidden">productos en carrito</span>
              </span>
            )}
          </button>
          
          <button 
            className="navbar-toggler item-bar" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarSupportedContent" 
            aria-controls="navbarSupportedContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </div>
      
      {/* Estilos CSS para la animación del badge */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;