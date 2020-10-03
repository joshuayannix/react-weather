import React from 'react';
import './App.css';
import axios from 'axios'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: null,
      api: '',
      temp: ''
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
      this.setState({ temp: data.main.temp })
    } catch(err) {
      console.log(err);
    }
  }

  

  render() {
    return(
      <div className='grey'>
        weather
        {this.state.temp}
      </div>
    )
  }
}

export default App;
