import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useCarritoStore } from '../Store/useCarritoStore';
import ModalVerMas from './ModalVerMas';

const CardCarousel = ({ data, marcaNombre }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const [ openModal, setOpenModal ] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Store del carrito
  const { agregarProducto, getCantidadDisponible, abrirCarrito } = useCarritoStore();

  // ============== FUNCIONES DE UTILIDAD ==============

  /**
   * Filtra los productos por marca
   */
  const filterData = data?.filter((item) => item.marca === marcaNombre) || [];

  /**
   * Calcula cuántas cards mostrar según el tamaño de pantalla
   */
  const getVisibleCards = () => {
    const width = window.innerWidth;
    if (width >= 1200) return 5; // xl
    if (width >= 992) return 4;  // lg
    if (width >= 768) return 3;  // md
    if (width >= 576) return 2;  // sm
    return 1; // xs
  };

  /**
   * Calcula el índice máximo del carrusel
   */
  const maxIndex = Math.max(0, filterData.length - visibleCards);

  // ============== EFECTOS ==============

  /**
   * Maneja el redimensionamiento de la ventana
   */
  useEffect(() => {
    const handleResize = () => {
      setVisibleCards(getVisibleCards());
    };

    // Configurar valor inicial
    setVisibleCards(getVisibleCards());

    // Escuchar cambios de tamaño
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ============== FUNCIONES DE NAVEGACIÓN ==============

  /**
   * Va al siguiente slide
   */
  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  /**
   * Va al slide anterior
   */
  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  /**
   * Va a un slide específico
   */
  const goToSlide = (index) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  // ============== FUNCIONES DEL CARRITO ==============

  /**
   * Maneja la adición de productos al carrito
   */
  const handleAgregarCarrito = (producto) => {
    console.log("Agregando producto al carrito:", producto);

    // Verificar stock disponible
    const cantidadDisponible = getCantidadDisponible(producto._id, producto.stock);

    if (cantidadDisponible <= 0) {
      toast.warning(`${producto.name} - No hay más stock disponible`);
      return;
    }

    // Intentar agregar el producto
    const resultado = agregarProducto(producto);

    // Mostrar notificación según resultado
    if (resultado.success) {
      toast.success(`${producto.name} - ${resultado.message}`);
      // Abrir carrito después de agregar
      setTimeout(() => abrirCarrito(), 500);
    } else {
      toast.warning(`${producto.name} - ${resultado.message}`);
    }
  };
  const DatosAlModal = (producto) => {
    setModalData(producto);
    setOpenModal(true);
  };
  // ============== FUNCIONES DE RENDERIZADO ==============

  /**
   * Renderiza una card de producto
   */
  const renderProductCard = (card) => {
    const cantidadDisponible = getCantidadDisponible(card._id, card.stock);

    return (
      <div
        key={card._id}
        className="flex-shrink-0 px-2"
        style={{ width: `${100 / visibleCards}%` }}
      >
        <div className="card h-100 shadow border-0">
          {/* Imagen del producto */}
          <img
            src={card.imagen}
            className="card-img-top"
            alt={card.name}
            style={{ height: '370px', objectFit: 'cover' }}
          />

          {/* Contenido de la card */}
          <div className="card-body d-flex flex-column">
            {/* Nombre y sabor */}
            <div className='d-flex'>
              <p className="card-title text-primary fw-bolder">{card.name}</p>
              <p className="card-text flex-grow-1 ms-5">sabor: {card.sabor}</p>
            </div>

            {/* Precio */}
            <p className="card-text flex-grow-1">
              PRECIO: <span className='fw-bolder'>${card.price}</span>
            </p>

            {/* Descripción */}
            <p className='card-text flex-grow-1 lead'>{card.description}</p>

            {/* Información de stock */}
            <div className="mb-2">
              <small className={`text-${getStockColorClass(card.stock, cantidadDisponible)}`}>
                <i className={`fas ${getStockIcon(card.stock, cantidadDisponible)} me-1`}></i>
                {getStockMessage(card.stock, cantidadDisponible)}
              </small>
            </div>

            {/* Botón ver más */}
            <button className="btn btn-outline-primary mb-2" onClick={() => DatosAlModal(card)}>
              Ver más
            </button>

            {/* Botón agregar al carrito */}
            {renderAddToCartButton(card, cantidadDisponible)}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renderiza el botón de agregar al carrito según el estado del stock
   */
  const renderAddToCartButton = (card, cantidadDisponible) => {
    if (card.stock <= 0) {
      return (
        <button className="btn btn-secondary" disabled>
          <i className="fas fa-times me-2"></i>
          Sin stock
        </button>
      );
    }

    if (cantidadDisponible <= 0) {
      return (
        <button className="btn btn-warning" disabled>
          <i className="fas fa-cart-plus me-2"></i>
          Máximo en carrito
        </button>
      );
    }

    return (
      <button
        className='btn btn-primary'
        onClick={() => handleAgregarCarrito(card)}
      >
        <i className="fas fa-cart-plus me-2"></i>
        Agregar al carrito
      </button>
    );
  };

  /**
   * Renderiza los indicadores del carrusel
   */
  const renderCarouselIndicators = () => {
    if (filterData.length <= visibleCards) return null;

    return (
      <div className="d-flex justify-content-center mt-4">
        {Array.from({ length: maxIndex + 1 }, (_, index) => (
          <button
            key={index}
            className={`btn btn-sm mx-1 rounded-pill ${currentIndex === index ? 'btn-primary' : 'btn-outline-primary'
              }`}
            style={{
              width: currentIndex === index ? '30px' : '15px',
              height: '15px',
              padding: 0,
              transition: 'all 0.3s ease',
              border: currentIndex === index ? 'none' : '2px solid #007bff'
            }}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    );
  };

  /**
   * Renderiza el mensaje cuando no hay productos
   */
  const renderEmptyState = () => {
    if (filterData.length > 0) return null;

    return (
      <div className="text-center py-5">
        <div className="mb-4">
          <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center"
            style={{ width: '80px', height: '80px' }}>
            <span style={{ fontSize: '2rem' }}>📦</span>
          </div>
        </div>
        <h4 className="text-muted fw-bold mb-2">¡Ups! No encontramos productos</h4>
        <p className="text-muted">
          No hay productos disponibles para la marca <strong>{marcaNombre}</strong>
        </p>
      </div>
    );
  };

  // ============== FUNCIONES AUXILIARES ==============

  /**
   * Obtiene la clase de color según el estado del stock
   */
  const getStockColorClass = (stock, cantidadDisponible) => {
    if (stock <= 0) return 'danger';
    if (cantidadDisponible <= 0) return 'warning';
    return 'success';
  };

  /**
   * Obtiene el icono según el estado del stock
   */
  const getStockIcon = (stock, cantidadDisponible) => {
    if (stock <= 0) return 'fa-times-circle';
    if (cantidadDisponible <= 0) return 'fa-exclamation-triangle';
    return 'fa-check-circle';
  };

  /**
   * Obtiene el mensaje según el estado del stock
   */
  const getStockMessage = (stock, cantidadDisponible) => {
    if (stock <= 0) return 'Sin stock';
    if (cantidadDisponible <= 0) return 'Ya tienes el máximo en el carrito';
    return `${cantidadDisponible} disponibles para agregar`;
  };

  // ============== RENDERIZADO PRINCIPAL ==============

  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-12">
          {/* Título */}
          <h2 className="text-center mb-5">
            <span className="text-primary fw-bold">Productos de </span>
            <span className="text-dark position-relative">
              {marcaNombre}
              <div className="position-absolute bottom-0 start-0 w-100"
                style={{
                  height: '3px',
                  background: 'linear-gradient(45deg, #007bff, #0056b3)',
                  borderRadius: '2px'
                }}>
              </div>
            </span>
          </h2>

          {/* Carrusel */}
          <div className="position-relative">
            {/* Contenedor de cards */}
            <div className="overflow-hidden">
              <div
                className="d-flex"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                  transition: 'transform 0.3s ease-in-out'
                }}
              >
                {filterData.map(renderProductCard)}
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

          {/* Indicadores */}
          {renderCarouselIndicators()}

          {/* Información del carrusel */}
          <div className="text-center mt-4">
            <div className="badge bg-light text-dark px-4 py-2 rounded-pill">
              <strong>
                Mostrando {Math.min(visibleCards, filterData.length)} de {filterData.length} productos
              </strong>
              {visibleCards >= 4 && (
                <span className="text-muted ms-2">(4-5 por pantalla en desktop)</span>
              )}
            </div>
          </div>

          {/* Estado vacío */}
          {renderEmptyState()}
        </div>
      </div>

      {/* Modal de ver más */}
      {openModal && (

      <ModalVerMas open={openModal} onClose={() => setOpenModal(false)} card={modalData} />
      )}
    </div>

  );
};

export default CardCarousel;