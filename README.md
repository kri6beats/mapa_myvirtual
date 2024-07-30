llaveOpenWeather: Llave API para acceder a los servicios de OpenWeather.
mapa: Elemento HTML donde se renderiza el mapa.
elementoMapa: Instancia del mapa de Leaflet centrada inicialmente con las coordenadas de  Colombia, se usa la web www.geodatos,net para adquirir estas coordenadas,
javascript
Copiar código
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(elementoMapa);

Estructura HTML javascript
const cuerpo = document.getElementById('cuerpo');
cuerpo.innerHTML = `
    <label for="input">Ciudad</label>
    <input type="text" id="input" class="ciudad" required>
    <div>
        <button id="buscar">Buscar</button>
        <button id="limpiar">Limpiar</button>
    </div>
    <div id="clima"></div>`; 
Se añade un formulario y botones de búsqueda y limpieza.
botón buscar
document.getElementById('buscar').addEventListener('click', function() {
    const ciudad = document.getElementById('input').value;
    if (!ciudad) {
        alert("Por favor ingrese una ciudad");
    } else {
        buscarCoordenadas(ciudad);
    }
});
Al hacer clic en el botón "Buscar",  se llama a la función buscarCoordenadas.
Botón "Limpiar"

document.getElementById('limpiar').addEventListener('click', function() {
    document.getElementById('input').value = '';
    elementoMapa.setView([4.5709, -74.2973], 8);
    document.getElementById('clima').innerHTML = ''; 
});
Al hacer clic en el botón "Limpiar", se resetea el input, el mapa y la sección de clima.

Funcion
buscarCoordenadas(ciudad)
function buscarCoordenadas(ciudad) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${ciudad}&limit=1&appid=${llaveOpenWeather}`)
        .then(respuesta => respuesta.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon, name } = data[0];
                buscarClima(lat, lon, name);
            } else {
                alert('Ciudad no encontrada. Por favor verifica el nombre e intenta de nuevo.');
            }
        })
        .catch(error => {
            alert('Error al obtener las coordenadas de la ciudad. Por favor intenta de nuevo.');
            console.error('Error:', error);
        });
}
buscarCoordenadas realiza una solicitud a la API de OpenWeather para obtener las coordenadas de una ciudad dada y llama a buscarClima con los resultados.
buscarClima(lat, lon, ciudad), esta funcion es copiada directamente de la documentacion que esta en la pagina de openweathermap.


funcion
buscarClima(lat, lon, ciudad)
function buscarClima(lat, lon, ciudad) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${llaveOpenWeather}&units=metric&lang=es`)
        .then(respuesta => respuesta.json())
        .then(data => {
            if (data.cod === 200) { 
                const { main: { temp }, weather } = data;
                const description = weather[0].description;

                const clima = document.getElementById("clima");
                clima.innerHTML = `
                    <h2>Clima en ${ciudad}</h2>
                    <p>Temperatura: ${temp}°C</p>
                    <p>Descripción: ${description}</p>
                `;

                elementoMapa.setView([lat, lon], 10);
                L.marker([lat, lon]).addTo(elementoMapa);
                    
            } else {
                alert('Error al obtener los datos del clima. Por favor intenta de nuevo.');
            }
        })
        .catch(error => {
            alert('Error al obtener los datos del clima. Por favor intenta de nuevo.');
            console.error('Error:', error);
        });
}
buscarClima realiza una solicitud a la API de OpenWeather para obtener los datos del clima de una ubicación específica y  el mapa con los resultados. se agrega &lang=es al final de la url para que convierta el texto a español como lo sugioere la pagina de weathermaps.
Resumen
Este proyecto integra OpenWeather y OpenStreetMap para proporcionar información climática y geográfica de cualquier ciudad ingresada por el usuario.
Usa una combinación de JavaScript html y css, solicitudes fetch para interactuar con las APIs, y Leaflet para la visualización del mapa.
