const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const rutaDatos = path.join(__dirname, '..', 'datos');
const archivoUsuarios = path.join(rutaDatos, 'usuarios.json');

function asegurarArchivo() {
  if (!fs.existsSync(rutaDatos)) fs.mkdirSync(rutaDatos, { recursive: true });

  if (!fs.existsSync(archivoUsuarios)) {
    const semilla = [
      {
        usuario: 'alex',
        correo: 'alex@example.com',
        claveHash: bcrypt.hashSync('12345', 10)
      },
      {
        usuario: 'admin',
        correo: 'admin@example.com',
        claveHash: bcrypt.hashSync('admin', 10)
      }
    ];
    fs.writeFileSync(archivoUsuarios, JSON.stringify(semilla, null, 2));
  }
}

function leerUsuarios() {
  asegurarArchivo();
  const raw = fs.readFileSync(archivoUsuarios, 'utf8');
  return JSON.parse(raw);
}

function guardarUsuarios(lista) {
  fs.writeFileSync(archivoUsuarios, JSON.stringify(lista, null, 2));
}

function validarUsuario(usuario, clave) {
  const usuarios = leerUsuarios();
  const u = usuarios.find(x => x.usuario.toLowerCase() === usuario.toLowerCase());
  if (!u) return null;
  const ok = bcrypt.compareSync(clave, u.claveHash);
  return ok ? { usuario: u.usuario, correo: u.correo } : null;
}

function existeUsuarioOCorreo(usuario, correo) {
  const usuarios = leerUsuarios();
  const existeUser = usuarios.some(x => x.usuario.toLowerCase() === usuario.toLowerCase());
  const existeMail = usuarios.some(x => x.correo.toLowerCase() === correo.toLowerCase());
  return { existeUser, existeMail };
}

function crearUsuario({ usuario, correo, clave }) {
  const usuarios = leerUsuarios();
  const { existeUser, existeMail } = existeUsuarioOCorreo(usuario, correo);
  if (existeUser || existeMail) {
    return { ok: false, motivo: existeUser ? 'usuario' : 'correo' };
  }
  const nuevo = {
    usuario,
    correo,
    claveHash: bcrypt.hashSync(clave, 10)
  };
  usuarios.push(nuevo);
  guardarUsuarios(usuarios);
  return { ok: true };
}

module.exports = {
  validarUsuario,
  existeUsuarioOCorreo,
  crearUsuario
};
