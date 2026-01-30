class WeatherService {
  constructor(apiKey) {
    this.apiKey = '37e0deedb2b828a4356401d73bb2ea15';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.units = 'metric';
    this.lang = 'es';
  }

  async getCurrentWeather(city) {
    const url = `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=${this.units}&lang=${this.lang}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Transformamos la respuesta a algo usable por tu app
      return this._mapCurrentWeather(data);

    } catch (error) {
      console.error('Error al obtener el clima:', error);
      return null;
    }
  }

  async getForecast(city) {
    const url = `${this.baseUrl}/forecast?q=${city}&units=metric&lang=es&appid=${this.apiKey}`;
    const resp = await fetch(url);

    if (!resp.ok) {
      throw new Error("Error al obtener forecast");
    }

    return await resp.json();
  }



  _mapCurrentWeather(data) {
    return {
      nombre: data.name,
      temperatura: Math.round(data.main.temp),
      humedad: data.main.humidity,
      viento: Math.round(data.wind.speed),
      estado: data.weather[0].description,
      icono: data.weather[0].main.toLowerCase()
    };
  }



}


/* const weatherService = new WeatherService('37e0deedb2b828a4356401d73bb2ea15');

weatherService.getCurrentWeather('Santiago')
  .then(data => console.log(data)); */
/*  class WeatherApp {
 constructor(apiKey) {
   this.weatherService = new WeatherService(apiKey);
   this.ciudades = [];
   this.contenedor = document.querySelector('.pronostico__container');
 }

 async init() {
   const nombresCiudades = ['Santiago', 'Valparaíso', 'Concepción'];

   for (const nombre of nombresCiudades) {
     const data = await this.weatherService.getCurrentWeather(nombre);
     if (data) {
       this.ciudades.push(data);
     }
   }

   this.render();
   this._registerEvents();
 }

 render() {
   this.contenedor.innerHTML = '';

   this.ciudades.forEach(ciudad => {
     const tarjeta = this._crearTarjeta(ciudad);
     this.contenedor.appendChild(tarjeta);
   });
 }

 _crearTarjeta(ciudad) {
   const col = document.createElement('div');
   col.className = 'col';

   col.innerHTML = `
     <div class="card shadow-lg h-100 border-secondary">
       <div class="card-img-top">
         <img src="./assets/images/ciudades/${ciudad.nombre.toLowerCase()}.webp" 
              alt="${ciudad.nombre}" 
              class="img-fluid rounded-top">
       </div>
       <div class="card-body text-center">
         <span>${this._mapIcono(ciudad.icono)}</span>
         <h5 class="card-title mt-3 mb-2">${ciudad.nombre}</h5>
         <p class="text-secondary fw-medium mb-1">${ciudad.estado}</p>
         <h4 class="fw-bold">${ciudad.temperatura}°C</h4>
         <button class="btn mt-3 btn-detalle fw-semibold">
           Ver Detalles
         </button>
       </div>
     </div>
   `;

   return col;
 }

 _mapIcono(iconoApi) {
   const mapa = {
     clear: iconos.despejado,
     clouds: iconos.nublado,
     rain: iconos.lluvia
   };

   return mapa[iconoApi] || iconos.parcial;
 }

 _registerEvents() {
   // aquí luego conectamos el modal
 }
} */

class WeatherApp {
  constructor(apiKey) {
    this.weatherService = new WeatherService(apiKey);
    this.ciudades = [];
    this.contenedor = document.querySelector('.pronostico__container');

    this.iconos = {
      despejado: '<i class="bi bi-sun text-warning fs-2"></i>',
      nublado: '<i class="bi bi-cloud text-secondary fs-2"></i>',
      lluvia: '<i class="bi bi-cloud-rain text-primary fs-2"></i>',
      parcial: '<i class="bi bi-cloud-sun text-secondary fs-2"></i>',
    };

    this.modalEl = document.querySelector("#detalleModal");
    this.modal = new bootstrap.Modal(this.modalEl);


  }


  async init() {
    /* const ciudadesIniciales = ['Santiago', 'Nueva York', 'Londres', 'Johannesburgo', 'Beijing', 'San Francisco', 'Budapest', 'El Cairo', 'París', 'Sidney']; */
    const ciudadesIniciales = [
      { apiName: 'Santiago', imageKey: 'santiago' },
      { apiName: 'Nueva York', imageKey: 'nueva-york' },
      { apiName: 'London', imageKey: 'london' },
      { apiName: 'Johannesburg', imageKey: 'johannesburg' },
      { apiName: 'Beijing', imageKey: 'beijing' },
      { apiName: 'San Francisco', imageKey: 'san-francisco' },
      { apiName: 'El Cairo', imageKey: 'el-cairo' },
      { apiName: 'Paris', imageKey: 'paris' },
      { apiName: 'Sydney', imageKey: 'sydney' },
    ];


    /*   for (const nombre of ciudadesIniciales) {
        const data = await this.weatherService.getCurrentWeather(nombre);
        if (data) {
          this.ciudades.push(this._normalizarCiudad(data));
        }
      } */
    for (const ciudad of ciudadesIniciales) {
      const data = await this.weatherService.getCurrentWeather(ciudad.apiName);
      if (data) {
        this.ciudades.push({
          ...this._normalizarCiudad(data),
          imageKey: ciudad.imageKey,
        });
      }
    }

    this.renderizarTarjetas();
  }

  async _cargarModal(ciudad) {
    const forecast = await this.weatherService.getForecast(ciudad.apiName);
    const dias = this._procesarForecast(forecast);

    const estadisticas = this._calcularEstadisticas(dias);
    const conteoClima = this._contarTiposClima(dias);
    const alerta = this._generarAlerta(dias, estadisticas, conteoClima);

    this._renderizarModal(ciudad, dias, estadisticas, conteoClima, alerta);
  }

  async abrirModal(cityApiName) {
    try {
      this._mostrarLoaderModal();

      const forecastData = await this.weatherService.getForecast(cityApiName);

      console.log("Forecast crudo:", forecastData);

      this._renderizarModalBase(cityApiName, forecastData);
      this._mostrarModal();

    } catch (error) {
      console.error(error);
      this._mostrarErrorModal();
    }
  }

  _mostrarLoaderModal() {
    document.querySelector(".modal-body").innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>
  `;
  }

  _mostrarModal() {
    const modal = new bootstrap.Modal(
      document.getElementById("detalleModal")
    );
    modal.show();
  }

/*   _mostrarLoaderModal() {
    document.querySelector('#detalleModalLabel').textContent = 'Cargando...';
    document.querySelector('#modalTemp').textContent = '--';
    document.querySelector('#modalEstado').textContent = '';
    document.getElementById("modal-icono").innerHTML = '';
    document.querySelector('#modalHumedad').textContent = '--';
    document.querySelector('#modalViento').textContent = '--';

    const contenedor = document.querySelector('#modalPronostico');
    contenedor.innerHTML = `<p class="text-muted mb-0">Cargando pronóstico...</p>`;
  } */

  _mostrarErrorModal(mensaje = "No se pudo cargar el pronóstico.") {
    document.querySelector('#detalleModalLabel').textContent = 'Error';
    document.querySelector('#modalTemp').textContent = '--';
    document.querySelector('#modalEstado').textContent = mensaje;
    document.getElementById("modal-icono").innerHTML = `<i class="bi bi-exclamation-triangle text-danger fs-2"></i>`;

    const contenedor = document.querySelector('#modalPronostico');
    contenedor.innerHTML = `<p class="text-danger mb-0">${mensaje}</p>`;
  }




  renderizarTarjetas() {
    this.contenedor.innerHTML = '';

    this.ciudades.forEach(ciudad => {
      const tarjeta = this._crearTarjetaCiudad(ciudad);
      this.contenedor.appendChild(tarjeta);
    });
  }

  /*   _getImagePath(nombre) {
      console.log('Nombre desde API:', nombre);
      const slug = this.ciudadesConfig[nombre] || 'default';
      console.log('Slug usado:', slug);
      return `./assets/images/ciudades/${slug}.webp`;
  
    } */

  _getImagePath(imageKey) {
    return `./assets/images/ciudades/${imageKey}.webp`;
  }

  _crearTarjetaCiudad({ nombre, temperatura, estado, icono, imageKey, apiName }) {
    const col = document.createElement('div');
    col.className = 'col';

    col.innerHTML = `
      <div class="card shadow-lg h-100 border-secondary">
        <div class="card-img-top">
          <img src="${this._getImagePath(imageKey)}" 
               alt="${nombre}" 
               class="img-fluid rounded-top">
        </div>
        <div class="card-body text-center">
          <span>${this._mapearIcono(icono)}</span>
          <h5 class="card-title mt-3 mb-2">${nombre}</h5>
          <p class="text-secondary fw-medium mb-1">${estado}</p>
          <h4 class="fw-bold">${temperatura}°C</h4>
          <button class="btn mt-3 btn-detalle fw-semibold" data-city="${nombre}">
            Ver Detalles
          </button>
        </div>
      </div>
    `;

    return col;
  }

  _renderizarModalBase(city, forecastData) {
    const modalBody = document.querySelector(".modal-body");

    modalBody.innerHTML = `
    <h5 class="mb-3">Pronóstico 5 días – ${city}</h5>
    <pre class="small bg-light p-2 rounded">
${JSON.stringify(forecastData.list.slice(0, 5), null, 2)}
    </pre>
  `;
  }





  _mapearIcono(iconoApi) {
    const mapa = {
      clear: this.iconos.despejado,
      clouds: this.iconos.nublado,
      rain: this.iconos.lluvia,
    };

    return mapa[iconoApi] || this.iconos.parcial;

  }



  _normalizarCiudad(data) {
    return {
      nombre: data.nombre,
      temperatura: data.temperatura,
      estado: data.estado,
      icono: data.icono,
      humedad: data.humedad,
      viento: data.viento,
    };
  }

}
const weatherApp = new WeatherApp();

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-detalle");
  if (!btn) return;

  const cityApiName = btn.dataset.city;
  weatherApp.abrirModal(cityApiName);
});



const app = new WeatherApp('37e0deedb2b828a4356401d73bb2ea15');
app.init();

