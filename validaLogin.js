// "Mostrar-ocultar contraseña"//
const checkboxVerPassword = document.getElementById('verPassword');
const inputPassword = document.getElementById('loginPassword');

if (checkboxVerPassword && inputPassword) {
  checkboxVerPassword.addEventListener('change', function() {
    
    if (this.checked) {
      inputPassword.type = 'text';
    } else {
      inputPassword.type = 'password';
    }
  });
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // se transforma todo a minuscula
  const emailInput = document.getElementById('loginEmail').value.trim().toLowerCase();
  const passwordInput = document.getElementById('loginPassword').value;

  const usuariosLista = JSON.parse(localStorage.getItem('usuariosLista')) || [];
 
  const usuarioValido = usuariosLista.find(user => user.email === emailInput && user.password === passwordInput);

  if (!usuarioValido) {
    if (errorLogin) {
      errorLogin.textContent = 'El correo electrónico o la contraseña son incorrectos.';
      errorLogin.classList.remove('hidden'); 
    }
    return; 
  }

  localStorage.setItem('sesionActiva', 'true');
  
  localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioValido));

  alert(`¡Inicio de sesión exitoso! Bienvenido, ${usuarioValido.nombre}.`);
  
  window.location.href = 'index.html'; 
});







