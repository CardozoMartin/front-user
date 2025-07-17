import React from 'react';
import AllProduct from './pages/AllProduct';
import Navbar from './components/Common/Navbar';
import CarritoOffcanvas from './components/Cart/CarritoOffcanvas';
import { Toaster } from 'sonner';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LastPedido from './pages/LastPedido';

const Router = () => {
  return (
    <BrowserRouter>
      {/* Navbar con funcionalidad de carrito */}
      <Navbar />
      {/* Contenido principal */}
      <main className='mt-5'>
        <Routes>
          <Route path="/" element={<AllProduct />} />
          <Route path="/pedidos" element={<LastPedido />} />
        </Routes>
      </main>
      {/* Offcanvas del carrito - Se renderiza globalmente */}
      <CarritoOffcanvas />
      <Toaster richColors position="top-right" closeButton />
    </BrowserRouter>
  );
};

export default Router;