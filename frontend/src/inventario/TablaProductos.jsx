import React from 'react';
import { invStyles as s } from './InventarioStyles';

const TablaProductos = ({ productos }) => {
  return (
    <table style={s.table}>
      <thead>
        <tr>
          <th style={s.th}>Modelo</th>
          <th style={s.th}>Categoría</th>
          <th style={s.th}>Precio</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((p, index) => (
          <tr key={index} style={s.row}>
            <td style={s.td}>{p.nombre}</td>
            <td style={s.td}>{p.categoria}</td>
            <td style={s.td}>${p.precio.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaProductos;