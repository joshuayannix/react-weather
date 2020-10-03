import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: null,
      api: '',
      humidity: '',
      pressure: '',
      temp: '',
      feels_like: '',
      temp_max: '',
      temp_min: '',
      description: '',
      icon: '',
      country: '',
      sunrise: '',
      sunset: '',
      deg: '',
      speed: '',
      timezone: '',
      iconSrc: ''
    };    
  };

  componentDidMount(){
    window.navigator.geolocation.getCurrentPosition(position => {
      let long = position.coords.longitude;
      let lat = position.coords.latitude;
      const api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=ad4e5a45e55e91999a3bf297f3a10367`;
      this.setState({ api: api})
      this.getWeather()
    });
  }

  async getWeather() {
    try { 
      const result = await fetch(this.state.api);
      const data = await result.json();
      console.log(data.main.temp);
      // Destructuring
      const {humidity, pressure, temp, feels_like, temp_max, temp_min} = data.main;
      const {description, icon} = data.weather[0];
      const {country, sunrise, sunset} = data.sys;
      const {deg, speed} = data.wind;
      // Setting state
      this.setState({ 
        humidity: humidity,
        pressure: pressure,
        temp: temp,
        feels_like: feels_like,
        temp_max: temp_max,
        temp_min: temp_min,
        description: description,
        icon: icon,
        country: country,
        sunrise: sunrise,
        sunset: sunset,
        deg: deg,
        speed: speed,
        timezone: data.timezone,
        location: data.name,
        iconSrc: `http://openweathermap.org/img/wn/${icon}@2x.png`
      })
    } catch(err) {
      console.log(err);
    }
  }

  render() {
    const convertTemp = kelvin => {
      let farenheight = (kelvin - 273.15) * 9/5 + 32;
      return Math.round(farenheight);
    };

    const convertTimezone = timezone => {
      switch (timezone) {
        case -14400 :
          return 'Eastern';
        case -18000 :
          return 'Central';
        case -21600 :
          return 'Mountain';
        case -25200 :
          return 'Pacific';
      }
    };

    const convertTimestamp = timestamp => {
      let date = new Date(timestamp * 1000);
      let hours = date.getHours();
      let minutes = '0' + date.getMinutes();
      let seconds = '0' + date.getSeconds();
      let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      return formattedTime;
    };

    return(
      <div className='App'>
        <div className="location">

          <section className='location-header'>
            <h1 className="location-timezone">{convertTimezone(this.state.timezone)}</h1>
            <img id='location-icon' alt='icon' src={this.state.iconSrc}/>
            <h1 className='location-name'>{this.state.location}</h1>
            <h2 className="location-country">{this.state.country}</h2>
          </section>

          <section className="data">

            <section className="details">
              <h1 className="temperature-description">{this.state.description}</h1>
              <div>Sunrise: <span className="location-sunrise">{convertTimestamp(this.state.sunrise)}</span></div>
              <div>Sunset: <span className="location-sunset">{convertTimestamp(this.state.sunset)}</span></div>
              <div>Wind speed: <span className="wind-speed">{this.state.speed}</span> mph</div>
              <div>Wind degrees: <span className="wind-deg">{this.state.deg}</span>°</div>
            </section>

            <section className="description">
              <div className="degree-section">
                <h2 className="temperature-degree">{convertTemp(this.state.temp)}</h2>
                <span>F</span>
              </div>
              <div>Feels Like: <span className="temperature-feels_like">{convertTemp(this.state.feels_like)}</span> F</div>
              <div>Max Temp: <span className="temp-max">{convertTemp(this.state.temp_max)}</span> F</div>
              <div>Min Temp: <span className="temp-min">{convertTemp(this.state.temp_min)}</span> F</div>
              <div>Humidity: <span className="humidity">{this.state.humidity}</span>%</div>
              <div>Pressure <span className="pressure">{this.state.pressure}</span></div>
            </section>
        
          </section>

        </div>
      </div>
    )
  }
}

export default App;
