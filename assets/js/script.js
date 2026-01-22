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
    this.ciudadesConfig = {
      'New York': 'nueva-york',
      'San Francisco': 'san-francisco',
      'El Cairo': 'el-cairo',
    };

  }


  async init() {
    const ciudadesIniciales = ['Santiago', 'Nueva York', 'Londres', 'Johannesburgo', 'Beijing', 'San Francisco', 'Budapest', 'El Cairo', 'París', 'Sidney'];

    for (const nombre of ciudadesIniciales) {
      const data = await this.weatherService.getCurrentWeather(nombre);
      if (data) {
        this.ciudades.push(this._normalizarCiudad(data));
      }
    }

    this.renderizarTarjetas();
  }


  renderizarTarjetas() {
    this.contenedor.innerHTML = '';

    this.ciudades.forEach(ciudad => {
      const tarjeta = this._crearTarjetaCiudad(ciudad);
      this.contenedor.appendChild(tarjeta);
    });
  }

  _getImagePath(nombre) {
   /*  const slug = this.ciudadesConfig[nombre] || 'default';
    return `./assets/images/ciudades/${slug}.webp`; */
     console.log('Nombre desde API:', nombre);
  const slug = this.ciudadesConfig[nombre] || 'default';
  console.log('Slug usado:', slug);
  return `./assets/images/ciudades/${slug.toLowerCase()}.webp`;

  }

  _crearTarjetaCiudad({ nombre, temperatura, estado, icono }) {
    const col = document.createElement('div');
    col.className = 'col';

    col.innerHTML = `
      <div class="card shadow-lg h-100 border-secondary">
        <div class="card-img-top">
          <img src="./assets/images/ciudades/${this._getImagePath(nombre)}.webp" 
               alt="${nombre}" 
               class="img-fluid rounded-top">
        </div>
        <div class="card-body text-center">
          <span>${this._mapearIcono(icono)}</span>
          <h5 class="card-title mt-3 mb-2">${nombre}</h5>
          <p class="text-secondary fw-medium mb-1">${estado}</p>
          <h4 class="fw-bold">${temperatura}°C</h4>
          <button class="btn mt-3 btn-detalle fw-semibold">
            Ver Detalles
          </button>
        </div>
      </div>
    `;

    return col;
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

const app = new WeatherApp('37e0deedb2b828a4356401d73bb2ea15');
app.init();

