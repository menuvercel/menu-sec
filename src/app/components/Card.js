'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Card = ({ item }) => {
  if (!item || typeof item !== 'object') {
    console.error('Card recibió un item inválido:', item);
    return null;
  }

  const { id, nombre, precio, imagen } = item;

  if (!id || !nombre || !precio) {
    console.error('Card recibió un item con propiedades faltantes:', item);
    return null;
  }

  return (
    <Link href={`/menuDetail/${encodeURIComponent(id)}`} className="card-link">
      <div className="card">
        {imagen ? (
          <Image 
            src={imagen} 
            alt={nombre} 
            width={200}
            height={130}
            className="card-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder.jpg";
            }}
          />
        ) : (
          <div className="card-image-placeholder">No image available</div>
        )}
        <div className="card-content">
          <h2 className="card-title">{nombre}</h2>
          <p className="card-price">${precio}</p>
        </div>
      </div>
    </Link>
  );
};

export default Card;