'use client';

import React, { useState, useEffect } from 'react';
import Sec from './components/Sec';

export default function Main() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    async function fetchSections() {
      try {
        const response = await fetch('/api/menuSections');
        if (!response.ok) {
          throw new Error('Error al cargar las secciones del menú');
        }
        const data = await response.json();
        setSections(data);
      } catch (error) {
        console.error('Error fetching the menu sections', error);
      }
    }
    fetchSections();
  }, []);

  return (
    <div className="main-page">
      <h1>Menu Principal</h1>
      {sections.map(section => (
        <Sec 
          key={section.id} 
          title={section.title} 
          items={section.items} 
          sectionId={section.id} 
        />
      ))}
    </div>
  );
}
