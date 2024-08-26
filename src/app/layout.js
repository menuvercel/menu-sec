'use client';

import { MenuProvider } from './context/MenuContext';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <MenuProvider>
          {children}
        </MenuProvider>
      </body>
    </html>
  );
}