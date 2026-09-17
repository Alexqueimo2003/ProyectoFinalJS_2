
let emailUsuarioActivo = "";
let claveFavoritosUsuario = "";


document.addEventListener("DOMContentLoaded", () => {
 
  const infoUsuario = JSON.parse(localStorage.getItem('usuarioLogeado'));
  const txtBienvenida = document.getElementById('bienvenidaUsuario');

  if (infoUsuario && txtBienvenida) {
    // Carga el mensaje personalizado con los datos del usuario activo
    txtBienvenida.innerHTML = `Conectado como: <span class="text-orange-600 font-bold">${infoUsuario.nombre} ${infoUsuario.apellido}</span> (${infoUsuario.email})`;
    

    emailUsuarioActivo = infoUsuario.email;
    claveFavoritosUsuario = `favoritos_${emailUsuarioActivo}`;
  } else if (txtBienvenida) {
    txtBienvenida.textContent = "Sesión activa (Usuario desconocido)";
  }

  
  obtenerPersonajes();
});



/**
 * @function obtenerFavoritosDelUsuario
 * @description  Función auxiliar para obtener el arreglo de favoritos exclusivo de este usuario
 * @param {}  sin parametros
 * @returns   la lista de los personajes
 * @author APA
*/

function obtenerFavoritosDelUsuario() {
  if (!claveFavoritosUsuario) return [];
  return JSON.parse(localStorage.getItem(claveFavoritosUsuario)) || [];
}


function alternarFavorito(idPersonaje) {
  let favoritos = obtenerFavoritosDelUsuario();

  if (favoritos.includes(idPersonaje)) {
    
    favoritos = favoritos.filter(id => id !== idPersonaje);
  } else {
    
    favoritos.push(idPersonaje);
  }

  localStorage.setItem(claveFavoritosUsuario, JSON.stringify(favoritos));

  actualizarBotonesFavoritos();
}

// 

/**
 * @function actualizarBotonesFavoritos
 * @description Inspecciona todas las tarjetas de los personajes y cambia sus colores y textos según el estado de favoritos
 * @param {}  sin parametros
 * @returns {ganador}   No retorna ningún valor.
 * @author APA
*/

function actualizarBotonesFavoritos() {
  const favoritos = obtenerFavoritosDelUsuario();
  const botones = document.querySelectorAll(".btn-favorito");

  botones.forEach(boton => {
    const id = parseInt(boton.getAttribute("data-id"));

    if (favoritos.includes(id)) {
      
      boton.textContent = "Quitar de favoritos";
      boton.className = "btn-favorito w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-4 rounded transition duration-200 cursor-pointer ";
    } else {
      
      boton.textContent = "Agregar a favoritos";
      boton.className = "btn-favorito w-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-sm font-medium py-2 px-4 rounded transition duration-200 cursor-pointer ";
    }
  });
}

/** Consumo asincrónico y seguro de la API pública
 * @async
 * @function obtenerPersonajes
 * @throws {Error} Lanza un error si la respuesta del servidor no es satisfactoria 
 * @returns Una promesa que se resuelve una vez renderizados los personajes o manejado el error.
*/
async function obtenerPersonajes() {
  const divPersonajes = document.querySelector("#personajes");
  
  // Coloca el componente de "Carga" simulando una animación de espera
  divPersonajes.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center p-8 gap-3" id="loadingState">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      <p class="text-xl font-medium text-gray-700">Cargando personajes interdimensionales...</p>
    </div>
  `;

  try {
    const respuesta = await fetch("https://rickandmortyapi.com/api/character");
    
   
    if (!respuesta.ok) {
      throw new Error(`Error de servidor: Código de respuesta ${respuesta.status}`);
    }

    const lista = await respuesta.json();
    
    
    divPersonajes.innerHTML = "";


    /** Consumo asincrónico y seguro de la API pública
     
     * @function obtenerPersonajes
     * @returns  Construcción dinámica de la interfaz utilizando los resultados de la API
    */
    lista.results.forEach((personaje) => {
      let divPersonaje = document.createElement("div");
      divPersonaje.classList.add(
        "bg-white",
        "p-4",
        "text-black",
        "flex",
        "flex-col",
        "gap-2",
        "rounded-md",
        "shadow-sm"
      );
      
      divPersonaje.innerHTML = `
        
        <a href="personaje.html?id=${personaje.id}" class="block group cursor-pointer">
          <img src="${personaje.image}" class="rounded w-full group-hover:opacity-90 transition duration-200" alt="${personaje.name}"/>
          <h2 class="text-2xl font-semibold mt-2 leading-tight group-hover:text-orange-500 transition duration-200">${personaje.name}</h2>
        </a>
        
        <p class="text-md font-regular text-gray-600 mb-2">Estado: ${personaje.status}</p>
        
        <!-- Botón Dinámico de Favoritos con Texto -->
        <button 
          data-id="${personaje.id}" 
          onclick="alternarFavorito(${personaje.id})"
          class="btn-favorito w-full border text-sm font-medium py-2 px-4 rounded transition duration-200 cursor-pointer hover:scale-[1.02]"
        >
          Agregar a favoritos
        </button>
      `;
      divPersonajes.appendChild(divPersonaje);
    });

   
    actualizarBotonesFavoritos();

  } catch (error) {
    
    console.error(`Hubo un error: ${error.message}`);
    
   
    divPersonajes.innerHTML = `
      <div class="col-span-full bg-orange-100 text-red-700 p-4 rounded-md shadow-sm text-center max-w-md mx-auto">
        No se pudo conectar al servidor de manera correcta: ${error.message} 
      </div>
    `;
  }
}

/** Consumo asincrónico y seguro de la API pública
 * @async
 * @function flecha
 * @returns Control de destrucción de credenciales locales y salida de la aplicación
*/

document.getElementById('btnCerrarSesion').addEventListener('click', () => {
  localStorage.removeItem('sesionActiva');
  localStorage.removeItem('usuarioLogeado'); 
  window.location.href = 'login.html';
});
