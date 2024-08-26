'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function SecAdminPanel() {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({ nombre: '', descripcion: '', precio: '', imagen: null });
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchCards();
    }
  }, [id]);

  async function fetchCards() {
    try {
      const response = await fetch(`/api/sections/${id}/cards`);
      if (!response.ok) {
        throw new Error('Error al obtener los ítems de la sección');
      }
      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error('Error al obtener los ítems de la sección', error);
    }
  }

  const handleAddCard = async () => {
    if (!newCard.nombre || !newCard.descripcion || !newCard.precio) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await fetch(`/api/sections/${id}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el ítem');
      }

      const addedCard = await response.json();
      setCards([...cards, addedCard]);
      setNewCard({ nombre: '', descripcion: '', precio: '', imagen: null });
    } catch (error) {
      console.error('Error al agregar el ítem', error);
      alert('Error al agregar el ítem');
    }
  };

  const handleEditCard = async (card) => {
    // Función para editar un Card existente
  };

  const handleDeleteCard = async (cardId) => {
    try {
      const response = await fetch(`/api/sections/${id}/cards/${cardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el ítem');
      }

      setCards(cards.filter(card => card.id !== cardId));
    } catch (error) {
      console.error('Error al eliminar el ítem', error);
      alert('Error al eliminar el ítem');
    }
  };

  return (
    <div className="sec-admin">
      <h1>Administración de {id}</h1>

      {cards.length === 0 ? (
        <p>No hay ítems disponibles en esta sección. Agrega algunos usando el formulario de abajo.</p>
      ) : (
        <ul className="card-list">
          {cards.map(card => (
            <li key={card.id} className="card-item">
              <div className="card-info">
                <span className="card-name">{card.nombre}</span>
                <br />
                <span className="card-description">{card.descripcion}</span>
                <br />
                <span className="card-price">{card.precio}</span>
                <div className="card-buttons">
                  <button onClick={() => handleEditCard(card)}>Editar</button>
                  <button onClick={() => handleDeleteCard(card.id)}>Eliminar</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="sec-admin-add">
        <h2>Agregar Nuevo Ítem</h2>
        <input
          type="text"
          value={newCard.nombre}
          onChange={(e) => setNewCard({ ...newCard, nombre: e.target.value })}
          placeholder="Nombre"
          className="sec-admin-add-input"
        />
        <input
          type="text"
          value={newCard.descripcion}
          onChange={(e) => setNewCard({ ...newCard, descripcion: e.target.value })}
          placeholder="Descripción"
          className="sec-admin-add-input"
        />
        <input
          type="text"
          value={newCard.precio}
          onChange={(e) => setNewCard({ ...newCard, precio: e.target.value })}
          placeholder="Precio"
          className="sec-admin-add-input"
        />
        <button onClick={handleAddCard} className="sec-admin-add-button">Agregar</button>
      </div>
    </div>
  );
}

export default SecAdminPanel;
