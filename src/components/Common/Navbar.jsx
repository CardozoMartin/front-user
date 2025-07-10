import React from 'react';
import { useCarritoStore } from '../Store/useCarritoStore';
import cart from '../../icons/cart.svg'

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
            <img src={cart} alt="Carrito" width="20" height="20" />
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