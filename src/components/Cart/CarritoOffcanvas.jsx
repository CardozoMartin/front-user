import React, { use, useState } from 'react';
import { useCarritoStore } from '../Store/useCarritoStore';
import ModalCompras from './ModalCompras';

const CarritoOffcanvas = () => {
  const {
    carrito,
    isOpen,
    cerrarCarrito,
    eliminarProducto,
    actualizarCantidad,
    vaciarCarrito,
    getTotalPrecio,
    getTotalItems
  } = useCarritoStore();
  
  const [modalOpen, setModalOpen] = useState(false);
  const totalPrecio = getTotalPrecio();
  const totalItems = getTotalItems();

  const handleCantidadChange = (productId, nuevaCantidad) => {
    const cantidad = parseInt(nuevaCantidad);
    const producto = carrito.find(item => item.id === productId);
    
    // Verificar que la cantidad esté dentro del rango permitido
    if (cantidad >= 1 && cantidad <= producto.stock) {
      actualizarCantidad(productId, cantidad);
    } else if (cantidad > producto.stock) {
      // Si intenta poner más del stock disponible, establecer al máximo stock
      actualizarCantidad(productId, producto.stock);
    }
  };

  const handleIncrementarCantidad = (productId) => {
    const producto = carrito.find(item => item.id === productId);
    if (producto && producto.cantidad < producto.stock) {
      actualizarCantidad(productId, producto.cantidad + 1);
    }
  };

  const handleDecrementarCantidad = (productId) => {
    const producto = carrito.find(item => item.id === productId);
    if (producto && producto.cantidad > 1) {
      actualizarCantidad(productId, producto.cantidad - 1);
    }
  };

  const handleCheckout = () => {
    // Verificar stock antes de proceder al checkout
    const productosConStockInsuficiente = carrito.filter(item => item.cantidad > item.stock);
    
    if (productosConStockInsuficiente.length > 0) {
      alert('Algunos productos en tu carrito exceden el stock disponible. Por favor, ajusta las cantidades.');
      return;
    }
    
    cerrarCarrito();
    setModalOpen(true);
  };

  const handleVaciarCarrito = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      vaciarCarrito();
    }
  };

  return (
    <>
      {/* Overlay para cerrar el offcanvas */}
      {isOpen && (
        <div 
          className="offcanvas-backdrop fade show" 
          onClick={cerrarCarrito}
          style={{ zIndex: 1040 }}
        ></div>
      )}
      
      {/* Offcanvas */}
      <div 
        className={`offcanvas offcanvas-end ${isOpen ? 'show' : ''}`}
        tabIndex="-1"
        style={{ 
          visibility: isOpen ? 'visible' : 'hidden',
          zIndex: 1045,
          width: '420px',
          maxWidth: '90vw'
        }}
      >
        {/* Header */}
        <div className="offcanvas-header border-bottom bg-primary text-white">
          <h5 className="offcanvas-title d-flex align-items-center">
            <i className="fas fa-shopping-cart me-2"></i>
            Mi Carrito
            <span className="badge bg-light text-primary ms-2">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </h5>
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            onClick={cerrarCarrito}
            aria-label="Close"
          ></button>
        </div>

        {/* Body */}
        <div className="offcanvas-body p-0 d-flex flex-column">
          {carrito.length === 0 ? (
            // Carrito vacío
            <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 p-4">
              <div className="mb-4">
                <i className="fas fa-shopping-cart text-muted" style={{ fontSize: '4rem' }}></i>
              </div>
              <h5 className="text-muted mb-3">Tu carrito está vacío</h5>
              <p className="text-muted text-center">
                Agrega productos para comenzar tu compra
              </p>
              <button 
                className="btn btn-primary mt-3"
                onClick={cerrarCarrito}
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <>
              {/* Lista de productos */}
              <div className="flex-grow-1" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {carrito.map((item) => (
                  <div key={item.id} className="border-bottom p-3 hover-bg-light">
                    <div className="d-flex">
                      {/* Imagen del producto */}
                      <div className="flex-shrink-0 me-3">
                        <img 
                          src={item.imagen} 
                          alt={item.nombre}
                          className="rounded border"
                          style={{ 
                            width: '70px', 
                            height: '70px', 
                            objectFit: 'cover',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            // Aquí podrías abrir un modal con detalles del producto
                            console.log('Ver detalles:', item);
                          }}
                        />
                      </div>
                      
                      {/* Información del producto */}
                      <div className="flex-grow-1">
                        <h6 className="mb-1 text-truncate fw-bold">{item.nombre}</h6>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-muted">
                            <i className="fas fa-tag me-1"></i>
                            {item.marca} - {item.sabor}
                          </small>
                          <div className="text-primary fw-bold">
                            ${(item.precio * item.cantidad).toFixed(2)}
                          </div>
                        </div>
                        
                        {/* Mostrar advertencia si la cantidad excede el stock */}
                        {item.cantidad > item.stock && (
                          <div className="alert alert-warning py-1 px-2 mb-2" style={{ fontSize: '0.75rem' }}>
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            Stock insuficiente (disponible: {item.stock})
                          </div>
                        )}
                        
                        {/* Mostrar stock disponible */}
                        <div className="mb-2">
                          <small className="text-muted">
                            Stock disponible: {item.stock} unidades
                          </small>
                        </div>
                        
                        {/* Controles de cantidad */}
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <button 
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleDecrementarCantidad(item.id)}
                              disabled={item.cantidad <= 1}
                              style={{ width: '30px', height: '30px' }}
                            >
                              <i className="fas fa-minus" style={{ fontSize: '0.7rem' }}>-</i>
                            </button>
                            <input 
                              type="number"
                              className={`form-control form-control-sm mx-2 text-center fw-bold ${
                                item.cantidad > item.stock ? 'is-invalid' : ''
                              }`}
                              style={{ width: '60px' }}
                              value={item.cantidad}
                              min="1"
                              max={item.stock}
                              onChange={(e) => handleCantidadChange(item.id, e.target.value)}
                            />

                            <button 
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleIncrementarCantidad(item.id)}
                              disabled={item.cantidad >= item.stock}
                              style={{ width: '30px', height: '30px' }}
                            >
                              <span className='text-center align-items-center mt-4 fs-5 fw-bolder'>+</span>
                            </button>
                          </div>
                          
                          {/* Precio unitario y botón eliminar */}
                          <div className="d-flex align-items-center">
                            <small className="text-muted me-2">
                              ${item.precio.toFixed(2)} c/u
                            </small>
                            <button 
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => eliminarProducto(item.id)}
                              title="Eliminar producto"
                              style={{ width: '30px', height: '30px' }}
                            >
                              <i className="bi bi-trash-fill" style={{ fontSize: '0.7rem' }}></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer con total y acciones */}
              <div className="border-top bg-light p-3">
                {/* Resumen del total */}
                <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-white rounded">
                  <div>
                    <div className="text-muted small">Total ({totalItems} items):</div>
                    <div className="h5 mb-0 text-primary fw-bold">
                      ${totalPrecio.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="text-muted small">IVA incluido</div>
                    <div className="small text-success">
                      <i className="fas fa-truck me-1"></i>
                      Envío gratis
                    </div>
                  </div>
                </div>
                
                {/* Botones de acción */}
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={handleCheckout}
                    disabled={carrito.some(item => item.cantidad > item.stock)}
                  >
                    <i className="fas fa-credit-card me-2"></i>
                    Proceder al Pago
                  </button>
                  
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-secondary flex-fill"
                      onClick={cerrarCarrito}
                    >
                      Seguir comprando
                    </button>
                    <button 
                      className="btn btn-outline-danger"
                      onClick={handleVaciarCarrito}
                      title="Vaciar carrito"
                    >
                      <i className="fas fa-trash">X</i>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Modal para finalizar la compra */}
      {modalOpen && (
        <ModalCompras setModalOpen={setModalOpen} modalOpen={modalOpen} />
      )}

      {/* Estilos adicionales */}
      <style jsx>{`
        .hover-bg-light:hover {
          background-color: #f8f9fa !important;
          transition: background-color 0.2s ease;
        }
        
        .offcanvas-end {
          box-shadow: -5px 0 15px rgba(0,0,0,0.1);
        }
        
        .is-invalid {
          border-color: #dc3545 !important;
        }
      `}</style>
    </>
  );
};

export default CarritoOffcanvas;