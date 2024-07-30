const llaveOpenWeather = "bd2710b96990195b4605259131e5055f";
const mapa = document.getElementById('mapa');
const elementoMapa = L.map(mapa).setView([4.5709, -74.2973], 8);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(elementoMapa);

const cuerpo = document.getElementById('cuerpo');
cuerpo.innerHTML = `
    <label for="input">Ciudad</label>
    <input type="text" id="input" class="ciudad" required>
    <div>
        <button id="buscar">Buscar</button>
        <button id="limpiar">Limpiar</button>
    </div>
    <div id="clima"></div>`; 

document.getElementById('buscar').addEventListener('click', function() {
    const ciudad = document.getElementById('input').value;
    if (!ciudad) {
        alert("Por favor ingrese una ciudad");
    } else {
        buscarCoordenadas(ciudad);
    }
});

document.getElementById('limpiar').addEventListener('click', function() {
    document.getElementById('input').value = '';
    elementoMapa.setView([4.5709, -74.2973], 8);
    document.getElementById('clima').innerHTML = ''; 
});

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
        
}
