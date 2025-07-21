import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { getLastCart } from '../api/ApiCart';
import { useQuery } from '@tanstack/react-query';

const LastPedido = () => {
    const [searchPhone, setSearchPhone] = useState('');
    const [shouldSearch, setShouldSearch] = useState(false);

    // RHF-----------------------------------
    const { register, handleSubmit: onSubmitRHF, formState: { errors } } = useForm()

    // TQuery------------------------------------
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['lastPedido', searchPhone],
        queryFn: () => getLastCart(searchPhone),
        enabled: shouldSearch && searchPhone.length > 0, // Solo ejecutar cuando tengamos teléfono y shouldSearch sea true
        retry: false
    })

    // Handler-----------------------------------
    const handleSubmit = async (formData) => {
        console.log("Datos del formulario:", formData);
        setSearchPhone(formData.phone);
        setShouldSearch(true);
        
        // Opcional: También puedes hacer la consulta directamente aquí
        // try {
        //     const response = await getLastCart(formData.phone);
        //     console.log("Último pedido:", response);
        // } catch (error) {
        //     console.error("Error al obtener el último pedido:", error);
        // }
    }

    return (
        <div className='container mt-5 lastmargin'>
            <h1 className="text-center mt-5">Consultar Pedido</h1>
            <p className="text-center">Aquí podrás consultar el estado de tus pedidos recientes.</p>
            <p className="text-center lead">Recuerda que cuando cambie el estado de tu pedido serás notificado por el número que ingresaste o el email que proporcionaste.</p>

            <form className="d-flex justify-content-center mt-4" onSubmit={onSubmitRHF(handleSubmit)}>
                <fieldset className='d-flex gap-2 align-items-center' style={{ maxWidth: '600px', width: '100%' }}>
                    <input 
                        className='form-control form-control-lg' // form-control-lg hace el input más grande
                        type="tel" 
                        placeholder="Introduce tu número de teléfono"
                        {...register("phone", { 
                            required: "El número de teléfono es requerido",
                            pattern: {
                                value: /^[0-9+\-\s()]+$/,
                                message: "Ingresa un número de teléfono válido"
                            }
                        })}
                    />
                    <button className='btn btn-primary btn-lg' type="submit" disabled={isLoading}>
                        {isLoading ? 'Consultando...' : 'Consultar'}
                    </button>
                </fieldset>
            </form>

            {/* Mostrar errores de validación */}
            {errors.phone && (
                <div className="text-center mt-2">
                    <span className="text-danger">{errors.phone.message}</span>
                </div>
            )}

            {/* Mostrar resultados */}
            {shouldSearch && (
                <div className="mt-4">
                    {isLoading && (
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    )}

                    {isError && (
                        <div className="mx-auto" style={{ maxWidth: '600px' }}>
                            <div className="card border-danger">
                                <div className="card-body text-center">
                                    <div className="mb-3">
                                        <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '3rem' }}></i>
                                    </div>
                                    <h5 className="card-title text-danger">No se encontraron pedidos</h5>
                                    <p className="card-text text-muted mb-4">
                                        No pudimos encontrar ningún pedido asociado al número de teléfono <strong>{searchPhone}</strong>
                                    </p>
                                    <div className="alert alert-light" role="alert">
                                        <h6 className="alert-heading">
                                            <i className="bi bi-info-circle me-2"></i>
                                            Posibles razones:
                                        </h6>
                                        <ul className="mb-0 text-start">
                                            <li>El número de teléfono no coincide con el registrado en el pedido</li>
                                            <li>No has realizado ningún pedido con este número</li>
                                            <li>El pedido fue realizado con un número diferente</li>
                                        </ul>
                                    </div>
                                    <div className="mt-3">
                                        <button 
                                            className="btn btn-outline-primary me-2"
                                            onClick={() => {
                                                setShouldSearch(false);
                                                setSearchPhone('');
                                            }}
                                        >
                                            <i className="bi bi-arrow-left me-1"></i>
                                            Intentar de nuevo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {data && !data.success && (
                        <div className="mx-auto" style={{ maxWidth: '600px' }}>
                            <div className="card border-warning">
                                <div className="card-body text-center">
                                    <div className="mb-3">
                                        <i className="bi bi-search text-warning" style={{ fontSize: '3rem' }}></i>
                                    </div>
                                    <h5 className="card-title text-warning">Sin resultados</h5>
                                    <p className="card-text text-muted mb-4">
                                        No se encontraron pedidos para el número <strong>{searchPhone}</strong>
                                    </p>
                                    <div className="alert alert-warning" role="alert">
                                        <strong>Sugerencia:</strong> Verifica que el número de teléfono esté escrito correctamente, incluyendo el código de área.
                                    </div>
                                    <button 
                                        className="btn btn-warning"
                                        onClick={() => {
                                            setShouldSearch(false);
                                            setSearchPhone('');
                                        }}
                                    >
                                        <i className="bi bi-arrow-clockwise me-1"></i>
                                        Buscar otro número
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {data && data.success && (
                        <div className="mx-auto" style={{ maxWidth: '800px' }}>
                            {/* Cabecera de notificación */}
                            <div className="alert alert-info d-flex align-items-center mb-4" role="alert">
                                <i className="bi bi-info-circle-fill me-2"></i>
                                <div>
                                    <strong>¡Importante!</strong> Cuando el estado de tu pedido cambie, serás notificado por <strong>WhatsApp</strong> al número {data.data.user[0].phone} o por <strong>email</strong> a {data.data.user[0].email}
                                </div>
                            </div>

                            {/* Card del pedido */}
                            <div className="card shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="card-title mb-0">
                                            <i className="bi bi-receipt me-2"></i>
                                            Pedido #{data.data._id.slice(-8)}
                                        </h5>
                                        <span className={`badge ${
                                            data.data.status === 'pendiente' ? 'bg-warning' : 
                                            data.data.status === 'en_proceso' ? 'bg-info' : 
                                            data.data.status === 'completado' ? 'bg-success' : 
                                            'bg-secondary'
                                        }`}>
                                            {data.data.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="card-body">
                                    {/* Información del cliente */}
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <h6 className="text-muted mb-2">
                                                <i className="bi bi-person-fill me-2"></i>
                                                Cliente
                                            </h6>
                                            <p className="mb-1"><strong>{data.data.user[0].name}</strong></p>
                                            <p className="mb-1 text-muted">
                                                <i className="bi bi-envelope me-1"></i>
                                                {data.data.user[0].email}
                                            </p>
                                            <p className="mb-0 text-muted">
                                                <i className="bi bi-phone me-1"></i>
                                                {data.data.user[0].phone}
                                            </p>
                                        </div>
                                        <div className="col-md-6">
                                            <h6 className="text-muted mb-2">
                                                <i className="bi bi-calendar-event me-2"></i>
                                                Información del pedido
                                            </h6>
                                            <p className="mb-1">
                                                <strong>Fecha:</strong> {new Date(data.data.fecha).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Método de pago:</strong> 
                                                <span className="badge bg-light text-dark ms-2">
                                                    {data.data.paymentMethod}
                                                </span>
                                            </p>
                                            <p className="mb-0">
                                                <strong>Entregado:</strong> 
                                                <span className={`badge ms-2 ${data.data.delivered ? 'bg-success' : 'bg-warning'}`}>
                                                    {data.data.delivered ? 'Sí' : 'No'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Productos */}
                                    <h6 className="text-muted mb-3">
                                        <i className="bi bi-basket me-2"></i>
                                        Productos ({data.data.productos.length} items)
                                    </h6>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Producto</th>
                                                    <th className="text-center">Cantidad</th>
                                                    <th className="text-end">Precio Unit.</th>
                                                    <th className="text-end">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.data.productos.map((producto) => (
                                                    <tr key={producto._id}>
                                                        <td>
                                                            <strong>{producto.name}</strong>
                                                        </td>
                                                        <td className="text-center">
                                                            <span className="badge bg-secondary">
                                                                {producto.quantity}
                                                            </span>
                                                        </td>
                                                        <td className="text-end">
                                                            ${producto.price.toLocaleString()}
                                                        </td>
                                                        <td className="text-end">
                                                            <strong>${(producto.price * producto.quantity).toLocaleString()}</strong>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Total */}
                                    <div className="border-top pt-3">
                                        <div className="row">
                                            <div className="col-md-8"></div>
                                            <div className="col-md-4">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h5 className="mb-0">Total:</h5>
                                                    <h4 className="mb-0 text-primary">
                                                        <strong>${data.data.total.toLocaleString()}</strong>
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Estado del pedido */}
                                    <div className="mt-4">
                                        <div className="card bg-light">
                                            <div className="card-body">
                                                <h6 className="card-title">
                                                    <i className="bi bi-truck me-2"></i>
                                                    Estado del pedido
                                                </h6>
                                                <div className="progress mb-2" style={{ height: '20px' }}>
                                                    <div 
                                                        className={`progress-bar ${
                                                            data.data.status === 'pendiente' ? 'bg-warning' : 
                                                            data.data.status === 'en_proceso' ? 'bg-info' : 
                                                            data.data.status === 'completado' ? 'bg-success' : 
                                                            'bg-secondary'
                                                        }`}
                                                        role="progressbar" 
                                                        style={{ 
                                                            width: data.data.status === 'pendiente' ? '33%' : 
                                                                   data.data.status === 'en_proceso' ? '66%' : 
                                                                   data.data.status === 'completado' ? '100%' : '10%'
                                                        }}
                                                    >
                                                        {data.data.status.toUpperCase()}
                                                    </div>
                                                </div>
                                                <small className="text-muted">
                                                    {data.data.status === 'pendiente' && 'Tu pedido está siendo procesado'}
                                                    {data.data.status === 'en_proceso' && 'Tu pedido está en preparación'}
                                                    {data.data.status === 'completado' && 'Tu pedido ha sido completado'}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default LastPedido