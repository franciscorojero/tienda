const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(express.json());

// Conexión MySQL (se abre solo cuando se usa)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

// Ruta raíz
app.get('/', (req, res) => {
  res.send('API de Productos funcionando en Vercel ✔️');
});

// Crear producto (CREATE)
app.post('/productos', (req, res) => {
  const { nombre, precio } = req.body;
  const sql = 'INSERT INTO productos (nombre, precio) VALUES (?, ?)';

  db.query(sql, [nombre, precio], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Producto creado', id: result.insertId });
  });
});

// Obtener todos los productos (READ)
app.get('/productos', (req, res) => {
  const sql = 'SELECT * FROM productos';

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Obtener producto por ID (READ)
app.get('/productos/:id', (req, res) => {
  const sql = 'SELECT * FROM productos WHERE id = ?';

  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ message: 'Producto no encontrado' });

    res.json(results[0]);
  });
});

// Actualizar producto (UPDATE)
app.put('/productos/:id', (req, res) => {
  const { nombre, precio } = req.body;
  const sql = 'UPDATE productos SET nombre = ?, precio = ? WHERE id = ?';

  db.query(sql, [nombre, precio, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Producto actualizado' });
  });
});

// Eliminar producto (DELETE)
app.delete('/productos/:id', (req, res) => {
  const sql = 'DELETE FROM productos WHERE id = ?';

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Producto eliminado' });
  });
});

// Exportar Express como serverless function
module.exports = app;
