import React, { useState } from 'react';
import { useCarritoStore } from './Store/useCarritoStore';

const CardCarousel = ({ data, marcaNombre }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filtrar datos por marca
  const filterData = data?.filter((item) => item.marca === marcaNombre) || [];

  // Función para obtener el número de cards visibles según el tamaño de pantalla
  const getVisibleCards = () => {
    if (window.innerWidth >= 1200) return 5; // xl
    if (window.innerWidth >= 992) return 4;  // lg
    if (window.innerWidth >= 768) return 3;  // md
    if (window.innerWidth >= 576) return 2;  // sm
    return 1; // xs
  };

  const [visibleCards, setVisibleCards] = useState(getVisibleCards());

  // Escuchar cambios en el tamaño de ventana
  React.useEffect(() => {
    const handleResize = () => {
      setVisibleCards(getVisibleCards());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, filterData.length - visibleCards);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const goToSlide = (index) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };
  const { agregarProducto } = useCarritoStore();
  // Función para agregar producto al carrito
  const handleAgregarCarrito = (producto) => {
    // Usar Zustand para agregar al carrito
    agregarProducto(producto);
    
    // Crear notificación toast personalizada
    const showToast = (mensaje, tipo = 'success') => {
      const toastContainer = document.getElementById('toast-container') || (() => {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
        return container;
      })();
  
      const toast = document.createElement('div');
      toast.className = `toast show align-items-center text-bg-${tipo} border-0`;
      toast.setAttribute('role', 'alert');
      toast.innerHTML = `
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center">
            <i class="fas fa-check-circle me-2"></i>
            <div>
              <strong>${producto.name}</strong><br>
              <small>agregado al carrito exitosamente</small>
            </div>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      `;
      
      toastContainer.appendChild(toast);
      
      // Auto-remove después de 4 segundos
      setTimeout(() => {
        if (toast && toast.parentNode) {
          toast.classList.add('fade');
          setTimeout(() => {
            if (toast && toast.parentNode) {
              toast.parentNode.removeChild(toast);
            }
          }, 300);
        }
      }, 4000);
      
      // Permitir cerrar manualmente
      const closeBtn = toast.querySelector('.btn-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          if (toast && toast.parentNode) {
            toast.classList.add('fade');
            setTimeout(() => {
              if (toast && toast.parentNode) {
                toast.parentNode.removeChild(toast);
              }
            }, 300);
          }
        });
      }
    };
    
    showToast(`${producto.name} agregado al carrito`);
  };

  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-12">
          <h2 className="text-center mb-5">
            <span className="text-primary fw-bold">Productos de </span>
            <span className="text-dark position-relative">
              {marcaNombre}
              <div className="position-absolute bottom-0 start-0 w-100" 
                   style={{ height: '3px', background: 'linear-gradient(45deg, #007bff, #0056b3)', borderRadius: '2px' }}>
              </div>
            </span>
          </h2>
          
          {/* Carrusel personalizado */}
          <div className="position-relative">
            {/* Contenedor de cards */}
            <div className="overflow-hidden">
              <div 
                className="d-flex transition-all duration-300"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                  transition: 'transform 0.3s ease-in-out'
                }}
              >
                {filterData.map((card) => (
                  <div 
                    key={card._id}
                    className="flex-shrink-0 px-2"
                    style={{ width: `${100 / visibleCards}%` }}
                  >
                    <div className="card h-100 shadow border-0">
                      <img 
                        src={card.imagen} 
                        className="card-img-top" 
                        alt={card.name}
                        style={{ height: '370px', objectFit: 'cover' }}
                      />
                      <div className="card-body d-flex flex-column">
                        <div className='d-flex'>
                          <p className="card-title text-primary fw-bolder">{card.name}</p>
                          <p className="card-text flex-grow-1 ms-5">sabor: {card.sabor}</p>
                        </div>
                        <p className="card-text flex-grow-1">PRECIO : <span className='fw-bolder'>${card.price}</span></p>
                        <p className='card-text flex-grow-1 lead'>{card.description}</p>
                        <button className="btn btn-outline-primary">
                          Ver más
                        </button>
                        <button 
                          className='btn btn-outline-primary mt-2' 
                          onClick={() => handleAgregarCarrito(card)}
                        >
                          Agregar al carrito
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones de navegación */}
            <button 
              className="btn btn-primary position-absolute top-50 start-0 translate-middle-y"
              style={{ zIndex: 10, marginLeft: '-20px' }}
              onClick={prevSlide}
              disabled={currentIndex === 0}
            >
              <i className="fas fa-chevron-left">‹</i>
            </button>

            <button 
              className="btn btn-primary position-absolute top-50 end-0 translate-middle-y"
              style={{ zIndex: 10, marginRight: '-20px' }}
              onClick={nextSlide}
              disabled={currentIndex === maxIndex}
            >
              <i className="fas fa-chevron-right">›</i>
            </button>
          </div>

          {/* Indicadores mejorados */}
          {filterData.length > visibleCards && (
            <div className="d-flex justify-content-center mt-4">
              {Array.from({ length: maxIndex + 1 }, (_, index) => (
                <button
                  key={index}
                  className={`btn btn-sm mx-1 rounded-pill ${
                    currentIndex === index ? 'btn-primary' : 'btn-outline-primary'
                  }`}
                  style={{ 
                    width: currentIndex === index ? '30px' : '15px', 
                    height: '15px', 
                    padding: 0,
                    transition: 'all 0.3s ease',
                    border: currentIndex === index ? 'none' : '2px solid #007bff'
                  }}
                  onClick={() => goToSlide(index)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              ))}
            </div>
          )}

          {/* Información del carrusel mejorada */}
          <div className="text-center mt-4">
            <div className="badge bg-light text-dark px-4 py-2 rounded-pill">
              <strong>Mostrando {Math.min(visibleCards, filterData.length)} de {filterData.length} productos</strong>
              {visibleCards >= 4 && (
                <span className="text-muted ms-2">(4-5 por pantalla en desktop)</span>
              )}
            </div>
          </div>

          {/* Mensaje si no hay productos - mejorado */}
          {filterData.length === 0 && (
            <div className="text-center py-5">
              <div className="mb-4">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{ width: '80px', height: '80px' }}>
                  <span style={{ fontSize: '2rem' }}>📦</span>
                </div>
              </div>
              <h4 className="text-muted fw-bold mb-2">¡Ups! No encontramos productos</h4>
              <p className="text-muted">No hay productos disponibles para la marca <strong>{marcaNombre}</strong></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardCarousel;