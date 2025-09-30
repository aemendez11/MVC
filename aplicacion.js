const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const {
  mostrarFormulario,
  procesarIngreso,
  mostrarFormularioRegistro,
  procesarRegistro,
  mostrarPanel,
  cerrarSesion
} = require('./controladores/autenticacionControlador');

const aplicacion = express();

// EJS + rutas de vistas
aplicacion.set('view engine', 'ejs');
aplicacion.set('views', path.join(__dirname, 'vistas'));

// estáticos
aplicacion.use(express.static(path.join(__dirname, 'publico')));

// body parser
aplicacion.use(bodyParser.urlencoded({ extended: true }));

// Rutas
aplicacion.get('/', mostrarFormulario);
aplicacion.post('/ingresar', procesarIngreso);

aplicacion.get('/registro', mostrarFormularioRegistro);
aplicacion.post('/registro', procesarRegistro);

aplicacion.get('/panel', mostrarPanel);
aplicacion.get('/salir', cerrarSesion);

// Server
aplicacion.listen(3000, () => {
  console.log('Servidor activo en http://localhost:3000');
});
