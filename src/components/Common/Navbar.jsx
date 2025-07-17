import React from 'react';
import { useCarritoStore } from '../Store/useCarritoStore';
import { Link } from 'react-router';

const Navbar = () => {
  const { getTotalItems, abrirCarrito } = useCarritoStore();
  const totalItems = getTotalItems();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top border-bottom border-2 border-secondary mb-5">
      <div className="container-fluid container">
        <a className="navbar-brand" href="#">DistriNort</a>
        <div>
                <Link to="/pedidos" className="btn btn-outline">
                  Consultar Pedido
                </Link>
          {/* Botón del carrito con badge actualizado */}
          <button 
            className='btn btn-outline position-relative me-2'
            onClick={abrirCarrito}
            title="Abrir carrito"
          >
            {/* Bootstrap cart icon SVG */}
           <i className="bi bi-cart-check-fill fs-3"></i>
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