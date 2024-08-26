'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function AdminPanel() {
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState({ nombre: '', descripcion: '', imagen: null });
  const router = useRouter();

  useEffect(() => {
    fetchSections();
  }, []);

  async function fetchSections() {
    try {
      const response = await fetch('/api/sections');
      if (!response.ok) {
        throw new Error('Error al obtener las secciones');
      }
      const data = await response.json();
      setSections(data.filter(section => section !== null));
    } catch (error) {
      console.error('Error al obtener las secciones', error);
    }
  }

  const handleAddSection = async () => {
    if (!newSection.nombre || !newSection.descripcion) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSection),
      });

      if (!response.ok) {
        throw new Error('Error al agregar la sección');
      }

      const addedSection = await response.json();
      setSections([...sections, addedSection]);
      setNewSection({ nombre: '', descripcion: '', imagen: null });
    } catch (error) {
      console.error('Error al agregar la sección', error);
      alert('Error al agregar la sección');
    }
  };

  const handleEditSection = async (section) => {
    // Función similar a la de agregar, pero con PUT para editar
  };

  const handleDeleteSection = async (id) => {
    try {
      const response = await fetch(`/api/sections?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la sección');
      }

      setSections(sections.filter(section => section.id !== id));
    } catch (error) {
      console.error('Error al eliminar la sección', error);
      alert('Error al eliminar la sección');
    }
  };

  const handleEnterSection = (id) => {
    router.push(`/admin/section/${id}`);
  };

  return (
    <div className="admin">
      <h1>Panel de Administración Principal</h1>

      {sections.length === 0 ? (
        <p>No hay secciones disponibles. Agrega algunas usando el formulario de abajo.</p>
      ) : (
        <ul className="section-list">
          {sections.map(section => (
            <li key={section.id} className="section-item">
              <div className="section-info">
                <span className="section-name">{section.nombre}</span>
                <br />
                <span className="section-description">{section.descripcion}</span>
                <div className="section-buttons">
                  <button onClick={() => handleEditSection(section)}>Editar</button>
                  <button onClick={() => handleDeleteSection(section.id)}>Eliminar</button>
                  <button onClick={() => handleEnterSection(section.id)}>Entrar a Sec</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="admin-add">
        <h2>Agregar Nueva Sección</h2>
        <input
          type="text"
          value={newSection.nombre}
          onChange={(e) => setNewSection({ ...newSection, nombre: e.target.value })}
          placeholder="Nombre"
          className="admin-add-input"
        />
        <input
          type="text"
          value={newSection.descripcion}
          onChange={(e) => setNewSection({ ...newSection, descripcion: e.target.value })}
          placeholder="Descripción"
          className="admin-add-input"
        />
        <button onClick={handleAddSection} className="admin-add-button">Agregar</button>
      </div>
    </div>
  );
}

export default AdminPanel;
