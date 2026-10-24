import React, { useEffect, useState } from 'react';
import './App.css';

const STORAGE_KEY = 'inventario_glamour_makeup';

const formularioVacio = {
  estudiante: '',
  herramienta: '',
  cantidad: '',
  fecha: '',
};

function App() {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState(formularioVacio);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    try {
      const guardados = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setProductos(Array.isArray(guardados) ? guardados : []);
    } catch {
      setProductos([]);
    }
  }, []);

  const guardarLista = (lista) => {
    setProductos(lista);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch {
      alert('No se pudieron guardar los datos en este navegador.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((actual) => ({ ...actual, [name]: value }));
  };

  const limpiarFormulario = () => {
    setFormData(formularioVacio);
    setEditandoId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const producto = formData.estudiante.trim();
    const marcaTipo = formData.herramienta.trim();
    const cantidad = Number(formData.cantidad);
    const fecha = formData.fecha;

    if (!producto || !marcaTipo || !fecha || !Number.isInteger(cantidad) || cantidad < 1) {
      alert('Completa todos los campos y escribe existencias enteras mayores que cero.');
      return;
    }

    if (editandoId !== null) {
      const actualizados = productos.map((p) =>
        p.id === editandoId
          ? { ...p, estudiante: producto, herramienta: marcaTipo, cantidad, fecha }
          : p
      );
      guardarLista(actualizados);
      alert('Producto actualizado correctamente.');
    } else {
      const nuevoProducto = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        estudiante: producto,
        herramienta: marcaTipo,
        cantidad,
        fecha,
      };
      guardarLista([nuevoProducto, ...productos]);
      alert('Producto registrado correctamente.');
    }

    limpiarFormulario();
  };

  const editarProducto = (producto) => {
    setFormData({
      estudiante: producto.estudiante,
      herramienta: producto.herramienta,
      cantidad: String(producto.cantidad),
      fecha: producto.fecha,
    });
    setEditandoId(producto.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminarProducto = (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto del inventario?')) return;
    guardarLista(productos.filter((p) => p.id !== id));
    if (editandoId === id) limpiarFormulario();
  };

  const estilos = {
    pagina: {
      maxWidth: '1120px',
      margin: '0 auto',
      padding: '28px 20px 36px',
    },
    tarjeta: {
      background: '#ffffff',
      padding: '24px',
      borderRadius: '20px',
      boxShadow: '0 12px 32px rgba(111, 45, 77, 0.09)',
      border: '1px solid #f1d9e2',
      marginBottom: '24px',
    },
    etiqueta: {
      display: 'block',
      fontWeight: 700,
      marginBottom: '8px',
      color: '#63334a',
      fontSize: '14px',
    },
    entrada: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '12px 13px',
      borderRadius: '11px',
      border: '1px solid #e8c5d2',
      fontSize: '15px',
      background: '#fffafd',
      color: '#54283d',
    },
    boton: {
      border: 0,
      borderRadius: '11px',
      padding: '11px 16px',
      cursor: 'pointer',
      fontWeight: 700,
      marginRight: '6px',
      marginBottom: '4px',
      transition: 'transform .18s ease, opacity .18s ease',
    },
  };

  return (
    <main style={estilos.pagina}>
      <header className="beauty-header">
        <div className="brand-mark" aria-hidden="true">✦</div>
        <p className="eyebrow">BEAUTY • COSMETICS • CARE</p>
        <h1>Glamour Makeup</h1>
        <p className="header-subtitle">Control de inventario de maquillaje</p>
        <div className="header-line" />
      </header>

      <section style={estilos.tarjeta}>
        <div className="section-heading">
          <div>
            <p className="section-kicker">{editandoId !== null ? 'ACTUALIZAR INVENTARIO' : 'NUEVO INGRESO'}</p>
            <h2>{editandoId !== null ? 'Editar producto' : 'Registrar producto de maquillaje'}</h2>
          </div>
          <span className="section-icon" aria-hidden="true">💄</span>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div>
            <label htmlFor="estudiante" style={estilos.etiqueta}>Nombre del producto</label>
            <input
              id="estudiante"
              name="estudiante"
              value={formData.estudiante}
              onChange={handleInputChange}
              required
              style={estilos.entrada}
              placeholder="Ej. Labial mate"
              maxLength={100}
            />
          </div>
          <div>
            <label htmlFor="herramienta" style={estilos.etiqueta}>Marca / Tipo</label>
            <input
              id="herramienta"
              name="herramienta"
              value={formData.herramienta}
              onChange={handleInputChange}
              required
              style={estilos.entrada}
              placeholder="Ej. Maybelline / Labios"
              maxLength={100}
            />
          </div>
          <div>
            <label htmlFor="cantidad" style={estilos.etiqueta}>Existencias</label>
            <input
              id="cantidad"
              type="number"
              name="cantidad"
              min="1"
              step="1"
              value={formData.cantidad}
              onChange={handleInputChange}
              required
              style={estilos.entrada}
              placeholder="Ej. 12"
            />
          </div>
          <div>
            <label htmlFor="fecha" style={estilos.etiqueta}>Fecha de registro</label>
            <input
              id="fecha"
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
              style={estilos.entrada}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-button">
              {editandoId !== null ? 'Guardar cambios' : '＋ Registrar producto'}
            </button>
            {editandoId !== null && (
              <button type="button" onClick={limpiarFormulario} className="secondary-button">
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      <section style={estilos.tarjeta}>
        <div className="section-heading inventory-heading">
          <div>
            <p className="section-kicker">RESUMEN DE PRODUCTOS</p>
            <h2>Inventario de maquillaje</h2>
          </div>
          <span className="inventory-count">{productos.length} {productos.length === 1 ? 'producto' : 'productos'}</span>
        </div>

        {productos.length === 0 ? (
          <div className="empty-state">
            <span aria-hidden="true">🌸</span>
            <h3>Tu inventario está vacío</h3>
            <p>Registra el primer producto para que aparezca en esta lista.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="inventory-table">
              <thead>
                <tr>
                  {['Código', 'Producto', 'Marca / Tipo', 'Existencias', 'Fecha de registro', 'Administrar'].map((titulo) => (
                    <th key={titulo}>{titulo}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id}>
                    <td><span className="product-code">#{String(p.id).slice(-5)}</span></td>
                    <td className="product-name">{p.estudiante}</td>
                    <td>{p.herramienta}</td>
                    <td><span className="stock-pill">{p.cantidad}</span></td>
                    <td>{p.fecha}</td>
                    <td className="actions-cell">
                      <button type="button" onClick={() => editarProducto(p)} className="edit-button">
                        Editar
                      </button>
                      <button type="button" onClick={() => eliminarProducto(p.id)} className="delete-button">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="app-footer">
        <span>✦</span> Glamour Makeup · Gestión de productos de belleza
        <p>Demostración local: los datos se guardan en este navegador y no se sincronizan automáticamente con otros dispositivos.</p>
      </footer>
    </main>
  );
}

export default App;
