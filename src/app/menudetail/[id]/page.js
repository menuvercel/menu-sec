'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMenuContext } from '../../context/MenuContext';

export default function MenuDetail() {
  const params = useParams();
  const { getItemById, loading, error } = useMenuContext();

  const selectedItem = getItemById(params.id);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!selectedItem) return <div>Ítem no encontrado</div>;

  const { imagen, nombre, precio, descripcion } = selectedItem;

  return (
    <div className="menu-detail">
      <Image src={imagen} alt={nombre} width={400} height={300} className="menu-detail-image" />
      <h1 className="menu-detail-title">{nombre}</h1>
      <p className="menu-detail-price" style={{ color: 'red' }}>${precio}</p>
      <p className="menu-detail-description">{descripcion}</p>
      <Link href="/">
        <button>Volver al Menú</button>
      </Link>
    </div>
  );
}