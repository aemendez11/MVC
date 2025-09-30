const { validarUsuario, crearUsuario, existeUsuarioOCorreo } = require('../modelos/usuarioModelo');

function mostrarFormulario(req, res) {
  res.render('InicioSesion', { error: null });
}

function procesarIngreso(req, res) {
  const { usuario, clave } = req.body;
  const u = validarUsuario(usuario, clave);

  if (!u) {
    return res.render('InicioSesion', { error: 'Usuario o contraseña incorrectos.' });
  }

  // Para este demo sin sesiones, solo enviamos el nombre al panel
  res.render('panel', { usuario: u.usuario });
}

function mostrarFormularioRegistro(_req, res) {
  res.render('registro', { errores: [], valores: { usuario: '', correo: '' } });
}

function procesarRegistro(req, res) {
  const { usuario, correo, clave, confirmar } = req.body;
  const errores = [];

  if (!usuario || usuario.trim().length < 3) errores.push('El usuario debe tener al menos 3 caracteres.');
  if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) errores.push('Correo inválido.');
  if (!clave || clave.length < 6) errores.push('La contraseña debe tener al menos 6 caracteres.');
  if (clave !== confirmar) errores.push('Las contraseñas no coinciden.');

  const { existeUser, existeMail } = existeUsuarioOCorreo(usuario || '', correo || '');
  if (existeUser) errores.push('El nombre de usuario ya está en uso.');
  if (existeMail) errores.push('El correo ya está registrado.');

  if (errores.length) {
    return res.render('registro', {
      errores,
      valores: { usuario, correo }
    });
  }

  const r = crearUsuario({ usuario, correo, clave });
  if (!r.ok) {
    return res.render('registro', {
      errores: [r.motivo === 'usuario' ? 'El usuario ya existe.' : 'El correo ya está registrado.'],
      valores: { usuario, correo }
    });
  }

  // Registro ok: regresamos al login con un mensaje
  res.render('InicioSesion', { error: '✅ Registro exitoso. Inicia sesión.' });
}

function mostrarPanel(req, res) {
  res.render('panel', { usuario: 'invitado' });
}

function cerrarSesion(_req, res) {
  res.redirect('/');
}

module.exports = {
  mostrarFormulario,
  procesarIngreso,
  mostrarFormularioRegistro,
  procesarRegistro,
  mostrarPanel,
  cerrarSesion
};
