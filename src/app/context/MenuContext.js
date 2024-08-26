'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menuItems');
        if (!response.ok) {
          throw new Error('Error al cargar los ítems del menú');
        }
        const data = await response.json();
        const filteredData = data.filter(item => item !== null);
        setMenuItems(filteredData);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setError('Error al cargar el menú. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const getItemById = (id) => {
    return menuItems.find(item => item.id.toString() === id.toString());
  };

  return (
    <MenuContext.Provider value={{ menuItems, setMenuItems, selectedItem, setSelectedItem, getItemById, loading, error }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenuContext = () => useContext(MenuContext);