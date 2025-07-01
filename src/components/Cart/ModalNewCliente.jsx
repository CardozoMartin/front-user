import {  useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { postCliente } from '../../api/ApiCliente';
import { toast } from 'sonner';

const ModalNewCliente = () => {
const guardarCliente = useMutation({
    mutationFn: postCliente,
    onSuccess: (data) => {
        console.log("Cliente creado exitosamente:", data);
        setError(null); // Limpiar error si todo sale bien
        // Aquí puedes manejar el éxito, como cerrar el modal o mostrar un mensaje
    },
    onError: (error) => {
        if (error.response && error.response.status === 409) {
            toast.error('El email ya esta registrado. Por favor, utiliza otro email.');
        } else {
            setError("Error al crear el cliente. Intenta nuevamente.");
        }
        console.error("Error al crear el cliente:", error.message);
        // Aquí puedes manejar el error, como mostrar un mensaje de error
    }
})
    const [ newCliente, setNewCliente] = useState({
        name: '',
        surname: '',
        phone: '',
        email: '',
        address: '',
        dni: ''
    })
    const [error, setError] = useState(null);
    const obtenerDatosDeFormulario = (e) => {
        const { name, value } = e.target;
        setNewCliente({
            ...newCliente,
            [name]: value
        });}

    const handleSubmit = async (e) => {
        e.preventDefault();
    //validamos los campos requeridos
    if(newCliente.name.trim().length === 0 ||
       newCliente.surname.trim().length === 0 ||
       newCliente.phone.trim().length === 0 ||
       newCliente.email.trim().length === 0 ||
       newCliente.address.trim().length === 0) {
        setError("Todos los campos son obligatorios");
        return;
    
    }
    //ahora validamos el formato del telefono
    const phoneRegex = /^[0-9]{10}$/; // Formato de 10 dígitos
    if (!phoneRegex.test(newCliente.phone)) {
        setError("El número de teléfono debe tener 10 dígitos");
        return;
    }

    //validamos el formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Formato básico de email
    if (!emailRegex.test(newCliente.email)) {
        setError("El email no es válido");
        return;
    }
    //verificamos que tiene el nuevo clientes
    console.log("Nuevo cliente:", newCliente);
    // Si todo es válido, enviamos los datos
    await guardarCliente.mutateAsync(newCliente);
    setError(null); // Limpiamos el error si todo es correcto
}

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="row g-3">
                <div className="col-12">
                    <label className="form-label fw-semibold">
                        <i className="fas fa-user me-2 text-primary"></i>
                        Nombre 
                    </label>
                    <input
                        type="text"
                        className="form-control form-control-lg"
                        name="name"
                        value={newCliente.name}
                        onChange={obtenerDatosDeFormulario}
                        placeholder="Ingresa tu nombre completo"
                        required
                        style={{ borderRadius: '12px' }}
                    />
                    {error && (
                        <div className="text-danger mt-2" role="alert">
                            {error} </div>
                    )}
                </div>
                 <div className="col-12">
                    <label className="form-label fw-semibold">
                        <i className="fas fa-user me-2 text-primary"></i>
                        Apellido 
                    </label>
                    <input
                        type="text"
                        className="form-control form-control-lg"
                        name="surname"
                        value={newCliente.surname}
                        onChange={obtenerDatosDeFormulario}
                        placeholder="Ingresa tu nombre Apellido"
                        required
                        style={{ borderRadius: '12px' }}
                    />
                    {error && (
                        <div className="text-danger mt-2" role="alert">
                            {error} </div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-semibold">
                        <i className="fas fa-phone me-2 text-primary"></i>
                        DNI
                    </label>
                    <input
                        type="tel"
                        className="form-control form-control-lg"
                        name="dni"
                        placeholder="Ej: 3812032666"
                        value={newCliente.dni}
                        onChange={obtenerDatosDeFormulario}
                        required
                        style={{ borderRadius: '12px' }}
                    />
                    {error && (
                        <div className="text-danger mt-2" role="alert">
                            {error} </div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-semibold">
                        <i className="fas fa-phone me-2 text-primary"></i>
                        Teléfono
                    </label>
                    <input
                        type="tel"
                        className="form-control form-control-lg"
                        name="phone"
                        placeholder="Ej: 3812032666"
                        value={newCliente.phone}
                        onChange={obtenerDatosDeFormulario}
                        required
                        style={{ borderRadius: '12px' }}
                    />
                    {error && (
                        <div className="text-danger mt-2" role="alert">
                            {error} </div>
                    )}
                </div>
                <div className="col-md-12">
                    <label className="form-label fw-semibold">
                        <i className="fas fa-envelope me-2 text-primary"></i>
                        Email
                    </label>
                    <input
                        type="email"
                        className="form-control form-control-lg"
                        name="email"
                        value={newCliente.email}
                        onChange={obtenerDatosDeFormulario}
                        placeholder="tu@email.com"
                        required
                        style={{ borderRadius: '12px' }}
                    />
                    {error && (
                        <div className="text-danger mt-2" role="alert">
                            {error} </div>
                    )}
                </div>
                 <div className="col-md-12">
                    <label className="form-label fw-semibold">
                        <i className="fas fa-envelope me-2 text-primary"></i>
                        Direccion
                    </label>
                    <input
                        type="text"
                        className="form-control form-control-lg"
                        name="address"
                        value={newCliente.address}
                        onChange={obtenerDatosDeFormulario}
                        placeholder="Ej: Tucuman, Alderetes, Av. Mitre 123"
                        required
                        style={{ borderRadius: '12px' }}
                    />
                    {error && (
                        <div className="text-danger " role="alert">
                            {error} </div>
                    )}
                </div>
            </div>
            <div className="d-flex gap-3 mt-4 justify-content-end">
                <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => setStep('clientType')}
                    style={{ borderRadius: '12px' }}
                >
                    <i className="fas fa-arrow-left me-2"></i>
                    Volver
                </button>
                <button
                    type="submit"
                    className="btn btn-primary px-4"
                    style={{ borderRadius: '12px' }}
                >
                    <i className="fas fa-arrow-right me-2"></i>
                    Continuar
                </button>
            </div>
        </form>
    )
}

export default ModalNewCliente