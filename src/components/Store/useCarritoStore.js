import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store de Zustand para el carrito
export const useCarritoStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      carrito: [],
      isOpen: false, // Para controlar el offcanvas
      
      // Agregar producto al carrito
      agregarProducto: (producto) => {
        const carritoActual = get().carrito;
        const productoExistente = carritoActual.find(item => item.id === producto._id);
        
        if (productoExistente) {
          // Si el producto ya existe, aumentar cantidad
          set({
            carrito: carritoActual.map(item =>
              item.id === producto._id
                ? { ...item, cantidad: item.cantidad + 1 }
                : item
            )
          });
        } else {
          // Si no existe, agregar nuevo producto
          const nuevoProducto = {
            id: producto._id,
            nombre: producto.name,
            precio: producto.price,
            imagen: producto.imagen,
            sabor: producto.sabor,
            marca: producto.marca,
            descripcion: producto.description,
            cantidad: 1
          };
          
          set({
            carrito: [...carritoActual, nuevoProducto]
          });
        }
      },
      
      // Eliminar producto del carrito
      eliminarProducto: (productId) => {
        set({
          carrito: get().carrito.filter(item => item.id !== productId)
        });
      },
      
      // Actualizar cantidad de un producto
      actualizarCantidad: (productId, nuevaCantidad) => {
        if (nuevaCantidad <= 0) {
          // Si la cantidad es 0 o menor, eliminar el producto
          get().eliminarProducto(productId);
          return;
        }
        
        set({
          carrito: get().carrito.map(item =>
            item.id === productId
              ? { ...item, cantidad: nuevaCantidad }
              : item
          )
        });
      },
      
      // Vaciar carrito
      vaciarCarrito: () => {
        set({ carrito: [] });
      },
      
      // Abrir/cerrar offcanvas
      abrirCarrito: () => set({ isOpen: true }),
      cerrarCarrito: () => set({ isOpen: false }),
      toggleCarrito: () => set({ isOpen: !get().isOpen }),
      
      // Getters computados
      getTotalItems: () => {
        return get().carrito.reduce((total, item) => total + item.cantidad, 0);
      },
      
      getTotalPrecio: () => {
        return get().carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
      },
      
      getItemsCount: () => {
        return get().carrito.length;
      }
    }),
    {
      name: 'carrito-distrinort', // Nombre único para localStorage
      partialize: (state) => ({ carrito: state.carrito }), // Solo persistir el carrito
    }
  )
);