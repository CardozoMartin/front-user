import React from 'react';
import { useCarritoStore } from '../Store/useCarritoStore';
import cart from '../../icons/cart.svg'

const Navbar = () => {
  const { getTotalItems, abrirCarrito } = useCarritoStore();
  const totalItems = getTotalItems();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div className="container-fluid">
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
            className="navbar-toggler" 
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
        
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Inicio</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Categoria
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Cervezas</a></li>
                <li><a className="dropdown-item" href="#">Gaseosas</a></li>
                <li><a className="dropdown-item" href="#">Jugos</a></li>
                <li><a className="dropdown-item" href="#">Vinos</a></li>
                <li><a className="dropdown-item" href="#">Agua Saborizadas</a></li>
              </ul>
            </li>
          </ul>
          
          <form className="d-flex" role="search">
            <input 
              className="form-control me-2" 
              type="search" 
              placeholder="Ingrese el nombre de la bebida" 
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">Buscar</button>
          </form>
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