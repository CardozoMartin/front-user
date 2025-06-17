import React from 'react';
import AllProduct from './pages/AllProduct';
import Navbar from './components/Common/Navbar';
import CarritoOffcanvas from './components/Cart/CarritoOffcanvas';


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
    </div>
  );
};

export default Router;