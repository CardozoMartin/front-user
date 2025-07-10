import React from 'react';
import AllProduct from './pages/AllProduct';
import Navbar from './components/Common/Navbar';
import CarritoOffcanvas from './components/Cart/CarritoOffcanvas';
import { Toaster } from 'sonner';


const Router = () => {
  return (
    <div>
      {/* Navbar con funcionalidad de carrito */}
      <Navbar />
      
      {/* Contenido principal */}
      <main className='mt-5'>
        <AllProduct />
      </main>
      
      {/* Offcanvas del carrito - Se renderiza globalmente */}
      <CarritoOffcanvas />
      <Toaster richColors position="top-right" closeButton />
    </div>
  );
};

export default Router;