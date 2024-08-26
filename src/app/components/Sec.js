'use client';

import React from 'react';
import Card from './Card';
import Link from 'next/link';

const Sec = ({ title, items, sectionId }) => {
  return (
    <div className="sec">
      <h2 className="sec-title">{title}</h2>
      <div className="sec-items">
        {items.map(item => (
          <Card key={item.id} item={item} />
        ))}
      </div>
      <Link href={`/menuSection/${encodeURIComponent(sectionId)}`} className="sec-link">
        Ver más
      </Link>
    </div>
  );
};

export default Sec;
