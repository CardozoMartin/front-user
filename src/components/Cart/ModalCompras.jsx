import React, { useEffect, useState } from 'react'
import { useCarritoStore } from '../Store/useCarritoStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { postCart } from '../../api/ApiCart';
import { getClientForPhoneFn } from '../../api/ApiCliente';
import ModalNewCliente from './ModalNewCliente';

const ModalCompras = ({ modalOpen, setModalOpen }) => {
    //importaciones y modelo de cliente, carrito y producto
    const { vaciarCarrito } = useCarritoStore();
    const [phone, setPhone] = useState("");
    const [step, setStep] = useState('clientType'); 
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [cliente, setCliente] = useState({
        id: "",
        name: "",
        phone: "",
        email: ""
    });
    const [searchPhone, setSearchPhone] = useState("");
    const [clientesEncontrados, setClientesEncontrados] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const { carrito } = useCarritoStore();

    //Tquery ----------------------------------------
    const createOrderMutatios = useMutation({
        mutationFn: postCart,
        onSuccess: ()=>{
            console.log('Carrito enviado correctamente');
            // Aquí puedes manejar la respuesta del servidor, como mostrar un mensaje de éxito
        },
        onError:()=>{}
    })
    //TQuery
     const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['clientePorTelefono', phone],
        queryFn: () => getClientForPhoneFn(phone),
        enabled: false,
    });
    // Simulación de búsqueda de cliente por teléfono
    const buscarClientePorTelefono = async (phone) => {
        console.log('Buscando cliente por teléfono:', phone);
        setIsSearching(true);
        // Aquí deberías hacer la llamada a tu API real
        // Por ahora simulo con datos de ejemplo
        const {cliente} = await getClientForPhoneFn(phone);
        // ahora actualizamos el estado de los clientes encontrados
        console.log('Resultado de búsqueda:', cliente);
        setClientesEncontrados(cliente ? [cliente] : []);
    };

    const handleClientTypeSelect = (type) => {
        if (type === 'new') {
            setStep('newClient');
        } else {
            setStep('existingClient');
            setShowOffcanvas(true);
        }
    };

    // Función para manejar cuando el cliente nuevo completa sus datos
    const handleNewClientComplete = (clienteData) => {
        console.log('Cliente completado:', clienteData);
        setCliente(clienteData);
        setStep('confirm');
    };

    // Función para volver desde el formulario de cliente nuevo
    const handleVolverFromNewClient = () => {
        setStep('clientType');
    };

    const handleNewClientSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newClient = {
            id: Date.now().toString(), // Generar ID temporal
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email')
        };
        setCliente(newClient);
        setStep('confirm');
    };

    const handleExistingClientSelect = (clienteSeleccionado) => {
        setCliente(clienteSeleccionado);
        setShowOffcanvas(false);
        setStep('confirm');
    };

    const handleBuyNow = () => {
        //calculamos el total del carrito
        const totalCarrito = carrito.reduce((total,item)=> total + (item.precio * item.cantidad),0)
        //creamos el modelo de productos que tiene que enviarse al servidor

        const sendProductos = carrito.map(item => ({
            id: item.id,
            quantity: item.cantidad,
            price: item.precio,
            name: item.nombre}))
            console.log('Productos a enviar:', sendProductos);
        //vamos guardando la informacion del carrito en el nuevo carrito
        const newCart = {
            user: cliente,
            productos: sendProductos,
            total: totalCarrito,
            paymentMethod: 'Efectivo',
             status: "pendiente",
            fecha: new Date().toISOString(),
            delivered: false, // o cualquier otro método de pago
        };

        console.log('Nuevo carrito:', newCart);
        // Aquí puedes manejar la lógica de compra
        createOrderMutatios.mutate(newCart)
        
        setModalOpen(false);
        vaciarCarrito();
        // Resetear el formulario
        setStep('clientType');
        setCliente({ id: "", name: "", phone: "", email: "" });
    };

    const totalCarrito = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

    const resetModal = () => {
        setModalOpen(false);
        setStep('clientType');
        setCliente({ id: "", name: "", phone: "", email: "" });
        setShowOffcanvas(false);
        setSearchPhone("");
        setClientesEncontrados([]);
    };

    return (
        <>
            <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                        {/* Header con gradiente */}
                        <div className="modal-header border-0 text-white position-relative" 
                             style={{ 
                                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                 padding: '2rem 2rem 1.5rem'
                             }}>
                            <div>
                                <h4 className="modal-title mb-1 fw-bold">
                                    {step === 'clientType' && '🛒 Finalizar Compra'}
                                    {step === 'newClient' && '👤 Datos del Cliente'}
                                    {step === 'existingClient' && '🔍 Buscar Cliente'}
                                    {step === 'confirm' && '✅ Confirmar Compra'}
                                </h4>
                                <p className="mb-0 opacity-75">
                                    {step === 'clientType' && 'Selecciona tu tipo de cliente'}
                                    {step === 'newClient' && 'Ingresa tus datos personales'}
                                    {step === 'existingClient' && 'Busca tu información por teléfono'}
                                    {step === 'confirm' && 'Revisa tu pedido antes de finalizar'}
                                </p>
                            </div>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={resetModal}
                                style={{ 
                                    fontSize: '1.2rem',
                                    opacity: 0.8
                                }}
                            ></button>
                        </div>

                        <div className="modal-body p-4">
                            {/* Paso 1: Selección de tipo de cliente */}
                            {step === 'clientType' && (
                                <div className="text-center">
                                    <h5 className="mb-4">¿Eres cliente nuevo o ya tienes cuenta?</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div 
                                                className="card h-100 border-2 shadow-sm cursor-pointer"
                                                style={{ borderRadius: '15px', cursor: 'pointer', transition: 'all 0.3s ease' }}
                                                onClick={() => handleClientTypeSelect('new')}
                                                onMouseEnter={(e) => e.target.closest('.card').style.transform = 'translateY(-5px)'}
                                                onMouseLeave={(e) => e.target.closest('.card').style.transform = 'translateY(0px)'}
                                            >
                                                <div className="card-body p-4 text-center">
                                                    <div className="mb-3">
                                                        <i className="fas fa-user-plus text-primary" style={{ fontSize: '3rem' }}></i>
                                                    </div>
                                                    <h5 className="card-title text-primary">Cliente Nuevo</h5>
                                                    <p className="card-text text-muted">
                                                        Es tu primera compra. Ingresa tus datos para continuar.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div 
                                                className="card h-100 border-2 shadow-sm cursor-pointer"
                                                style={{ borderRadius: '15px', cursor: 'pointer', transition: 'all 0.3s ease' }}
                                                onClick={() => handleClientTypeSelect('existing')}
                                                onMouseEnter={(e) => e.target.closest('.card').style.transform = 'translateY(-5px)'}
                                                onMouseLeave={(e) => e.target.closest('.card').style.transform = 'translateY(0px)'}
                                            >
                                                <div className="card-body p-4 text-center">
                                                    <div className="mb-3">
                                                        <i className="fas fa-user-check text-success" style={{ fontSize: '3rem' }}></i>
                                                    </div>
                                                    <h5 className="card-title text-success">Cliente Existente</h5>
                                                    <p className="card-text text-muted">
                                                        Ya eres cliente. Busca tu información por teléfono.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Paso 2: Formulario cliente nuevo */}
                            {step === 'newClient' && (
                               <ModalNewCliente 
                                   onClienteComplete={handleNewClientComplete}
                                   onVolver={handleVolverFromNewClient}
                               />
                            )}

                            {/* Paso 3: Confirmación de compra */}
                            {step === 'confirm' && (
                                <>
                                    {/* Información del cliente */}
                                    <div className="bg-light p-3 rounded-3 mb-4">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                                                     style={{ width: '40px', height: '40px' }}>
                                                    <i className="fas fa-user text-white"></i>
                                                </div>
                                                <div>
                                                    <h6 className="mb-0 fw-semibold text-capitalize">{cliente.name}</h6>
                                                    <small className="text-muted">{cliente.email} • {cliente.phone}</small>
                                                    <br />
                                                    <small className="text-muted">{cliente.address || 'Sin dirección'}</small>
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => setStep('clientType')}
                                                style={{ borderRadius: '8px' }}
                                            >
                                                <i className="fas fa-edit me-1"></i>
                                                Cambiar
                                            </button>
                                        </div>
                                    </div>

                                    {/* Lista de productos */}
                                    <h6 className="fw-semibold mb-3 text-secondary">
                                        <i className="fas fa-shopping-bag me-2"></i>
                                        Productos en tu carrito ({carrito.length} items)
                                    </h6>
                                    
                                    {carrito.length > 0 ? (
                                        <div className="row g-3 mb-4">
                                            {carrito.map((item, index) => (
                                                <div key={index} className="col-12">
                                                    <div className="card border-0 shadow-sm h-100" 
                                                         style={{ borderRadius: '15px' }}>
                                                        <div className="card-body p-3">
                                                            <div className="row align-items-center">
                                                                <div className="col-auto">
                                                                    <div className="position-relative">
                                                                        <img 
                                                                            src={item.imagen} 
                                                                            alt={item.name} 
                                                                            className="rounded-3"
                                                                            style={{ 
                                                                                width: '70px', 
                                                                                height: '70px', 
                                                                                objectFit: 'cover',
                                                                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                                                            }} 
                                                                        />
                                                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                                                                            {item.cantidad}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <h6 className="mb-1 fw-semibold text-dark">
                                                                        {item.marca}
                                                                    </h6>
                                                                    <p className="mb-1 text-muted small">{item.name}</p>
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <span className="text-muted small">
                                                                            Cantidad: {item.cantidad}
                                                                        </span>
                                                                        <span className="fw-bold text-success h6 mb-0">
                                                                            ${(item.precio * item.cantidad).toLocaleString()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-5">
                                            <div className="mb-3">
                                                <i className="fas fa-shopping-cart text-muted" style={{ fontSize: '3rem' }}></i>
                                            </div>
                                            <p className="text-muted">No hay productos en el carrito.</p>
                                        </div>
                                    )}

                                    {/* Resumen de pago */}
                                    {carrito.length > 0 && (
                                        <div className="bg-light rounded-3 p-4">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <i className="fas fa-credit-card text-primary me-2"></i>
                                                        <span className="fw-semibold">Método de pago:</span>
                                                    </div>
                                                    <span className="badge bg-success fs-6 px-3 py-2">
                                                        💵 Efectivo
                                                    </span>
                                                </div>
                                                <div className="col-md-6 text-md-end">
                                                    <div className="mb-2">
                                                        <span className="text-muted">Subtotal: </span>
                                                        <span className="fw-semibold">${totalCarrito.toLocaleString()}</span>
                                                    </div>
                                                    <div className="mb-2">
                                                        <span className="text-muted">Envío: </span>
                                                        <span className="text-success fw-semibold">Gratis</span>
                                                    </div>
                                                    <hr className="my-2" />
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="h5 fw-bold text-dark">Total:</span>
                                                        <span className="h4 fw-bold text-primary">
                                                            ${totalCarrito.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer con botones */}
                        {step === 'confirm' && (
                            <div className="modal-footer border-0 p-4 bg-white">
                                <div className="d-flex gap-3 w-100 justify-content-end">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary px-4 py-2"
                                        onClick={resetModal}
                                        style={{ borderRadius: '12px', fontWeight: '500' }}
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn text-white px-4 py-2"
                                        onClick={handleBuyNow}
                                        disabled={carrito.length === 0 || createOrderMutatios.isLoading}
                                        style={{ 
                                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            border: 'none',
                                            boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
                                        }}
                                    >
                                        {createOrderMutatios.isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-check-circle me-2"></i>
                                                Confirmar Compra
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Offcanvas para búsqueda de cliente existente */}
            <div className={`offcanvas offcanvas-end ${showOffcanvas ? 'show' : ''}`} 
                 style={{ 
                     visibility: showOffcanvas ? 'visible' : 'hidden',
                     zIndex: 1060
                 }}>
                <div className="offcanvas-header bg-primary text-white">
                    <h5 className="offcanvas-title">
                        <i className="fas fa-search me-2"></i>
                        Buscar Cliente
                    </h5>
                    <button 
                        type="button" 
                        className="btn-close btn-close-white"
                        onClick={() => setShowOffcanvas(false)}
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            <i className="fas fa-phone me-2 text-primary"></i>
                            Número de Teléfono
                        </label>
                        <div className="input-group">
                            <input 
                                type="tel" 
                                className="form-control form-control-lg"
                                placeholder="Ingresa tu teléfono"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={{ borderRadius: '12px 0 0 12px' }}
                            />
                            <button 
                                className="btn btn-primary"
                                onClick={() => buscarClientePorTelefono(phone)}
                               
                                style={{ borderRadius: '0 12px 12px 0' }}
                            >
                                {isSearching ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                    <i className="fas fa-search"></i>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Resultados de búsqueda */}
                    {clientesEncontrados.length > 0 && (
                        <div>
                            <h6 className="fw-semibold mb-3">Clientes encontrados:</h6>
                            {clientesEncontrados.map((client, index) => (
                                <div 
                                    key={index}
                                    className="card mb-3 shadow-sm cursor-pointer"
                                    style={{ borderRadius: '12px', cursor: 'pointer' }}
                                    onClick={() => handleExistingClientSelect(client)}
                                >
                                    <div className="card-body p-3">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3" 
                                                 style={{ width: '40px', height: '40px' }}>
                                                <i className="fas fa-user text-white"></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1 fw-semibold">{client.name}</h6>
                                                <small className="text-muted d-block">{client.email}</small>
                                                <small className="text-muted">{client.phone}</small>
                                                <small className="text-muted">{client.address}</small>

                                            </div>
                                            <i className="fas fa-chevron-right text-muted"></i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {searchPhone && clientesEncontrados.length === 0 && !isSearching && (
                        <div className="text-center py-4">
                            <i className="fas fa-user-slash text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                            <p className="text-muted">No se encontraron clientes con ese teléfono.</p>
                            <button 
                                className="btn btn-outline-primary"
                                onClick={() => {
                                    setShowOffcanvas(false);
                                    setStep('newClient');
                                }}
                            >
                                Registrarse como nuevo cliente
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Backdrop para offcanvas */}
            {showOffcanvas && (
                <div 
                    className="offcanvas-backdrop fade show"
                    style={{ zIndex: 1055 }}
                    onClick={() => setShowOffcanvas(false)}
                ></div>
            )}
        </>
    )
}

export default ModalCompras