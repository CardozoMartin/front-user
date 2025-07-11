import React from 'react'



const ModalVerMas = ({ open, onClose, card }) => {
  if (!open || !card) return null;

  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{card.name}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body text-center">
            <img src={card.imagen} alt={card.name} className="img-fluid mb-3 rounded" style={{ maxHeight: 250, objectFit: 'cover' }} />
            <p className="mt-2"><strong>Precio:</strong> ${card.price}</p>
            <p><strong>Sabor:</strong> {card.sabor}</p>
            <p><strong>Descripción:</strong> {card.description}</p>
            <p><strong>Stock:</strong> {card.stock}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalVerMas