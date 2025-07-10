import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCarritoStore = create(
  persist(
    (set, get) => ({
      carrito: [],
      isOpen: false,

      // Abrir/cerrar carrito
      abrirCarrito: () => set({ isOpen: true }),
      cerrarCarrito: () => set({ isOpen: false }),

      // Agregar producto al carrito con validación de stock
      agregarProducto: (producto, cantidad = 1) => {
        const { carrito } = get();
        // Usar _id como identificador único
        const productoExistente = carrito.find(item => item._id === producto._id);
        
        if (productoExistente) {
          // Si el producto ya existe, verificar que no exceda el stock
          const nuevaCantidad = productoExistente.cantidad + cantidad;
          
          if (nuevaCantidad > producto.stock) {
            // Calcular cuántos se pueden agregar realmente
            const cantidadDisponible = producto.stock - productoExistente.cantidad;
            
            if (cantidadDisponible > 0) {
              // Agregar solo los disponibles
              set({
                carrito: carrito.map(item =>
                  item._id === producto._id
                    ? { ...item, cantidad: producto.stock }
                    : item
                )
              });
              
              return {
                success: true,
                message: `Se agregaron ${cantidadDisponible} unidades (máximo disponible)`,
                cantidadAgregada: cantidadDisponible
              };
            } else {
              return {
                success: false,
                message: `No hay más stock disponible para ${producto.name}`,
                cantidadAgregada: 0
              };
            }
          } else {
            // Hay stock suficiente, agregar normalmente
            set({
              carrito: carrito.map(item =>
                item._id === producto._id
                  ? { ...item, cantidad: nuevaCantidad }
                  : item
              )
            });
            
            return {
              success: true,
              message: `Se agregaron ${cantidad} unidades al carrito`,
              cantidadAgregada: cantidad
            };
          }
        } else {
          // Producto nuevo, verificar stock disponible
          if (cantidad > producto.stock) {
            if (producto.stock > 0) {
              // Agregar solo el stock disponible
              set({
                carrito: [...carrito, { 
                  ...producto, 
                  cantidad: producto.stock,
                  // Normalizar nombres de propiedades para el carrito
                  id: producto._id,
                  nombre: producto.name,
                  precio: producto.price,
                  marca: producto.marca,
                  sabor: producto.sabor,
                  imagen: producto.imagen
                }]
              });
              
              return {
                success: true,
                message: `Se agregaron ${producto.stock} unidades (máximo disponible)`,
                cantidadAgregada: producto.stock
              };
            } else {
              return {
                success: false,
                message: `${producto.name} no tiene stock disponible`,
                cantidadAgregada: 0
              };
            }
          } else {
            // Hay stock suficiente
            set({
              carrito: [...carrito, { 
                ...producto, 
                cantidad,
                // Normalizar nombres de propiedades para el carrito
                id: producto._id,
                nombre: producto.name,
                precio: producto.price,
                marca: producto.marca,
                sabor: producto.sabor,
                imagen: producto.imagen
              }]
            });
            
            return {
              success: true,
              message: `${producto.name} agregado al carrito`,
              cantidadAgregada: cantidad
            };
          }
        }
      },

      // Actualizar cantidad con validación de stock
      actualizarCantidad: (productId, nuevaCantidad) => {
        const { carrito } = get();
        const producto = carrito.find(item => item.id === productId);
        
        if (!producto) return false;
        
        // Validar que la cantidad esté en el rango permitido
        if (nuevaCantidad < 1 || nuevaCantidad > producto.stock) {
          return false;
        }
        
        set({
          carrito: carrito.map(item =>
            item.id === productId
              ? { ...item, cantidad: nuevaCantidad }
              : item
          )
        });
        
        return true;
      },

      // Eliminar producto
      eliminarProducto: (productId) => {
        const { carrito } = get();
        set({
          carrito: carrito.filter(item => item.id !== productId)
        });
      },

      // Vaciar carrito
      vaciarCarrito: () => set({ carrito: [] }),

      // Obtener total de precio
      getTotalPrecio: () => {
        const { carrito } = get();
        return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
      },

      // Obtener total de items
      getTotalItems: () => {
        const { carrito } = get();
        return carrito.reduce((total, item) => total + item.cantidad, 0);
      },

      // Verificar si hay stock suficiente para un producto
      hayStockDisponible: (productId, cantidadDeseada = 1) => {
        const { carrito } = get();
        const productoEnCarrito = carrito.find(item => item._id === productId);
        
        if (!productoEnCarrito) return true;
        
        return (productoEnCarrito.cantidad + cantidadDeseada) <= productoEnCarrito.stock;
      },

      // Obtener cantidad disponible para agregar de un producto
      getCantidadDisponible: (productId, stockTotal) => {
        const { carrito } = get();
        const productoEnCarrito = carrito.find(item => item._id === productId);
        
        if (!productoEnCarrito) return stockTotal;
        
        return Math.max(0, stockTotal - productoEnCarrito.cantidad);
      }
    }),
    {
      name: 'carrito-storage',
      // Solo persistir el carrito, no el estado isOpen
      partialize: (state) => ({ carrito: state.carrito })
    }
  )
);