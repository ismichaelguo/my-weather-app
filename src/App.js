import React from "react";
import "./app.scss";
import { FiSearch } from "react-icons/fi";
import CityCardContainer from "./component/city-card-container/CityCardContainer";
import WeatherForecastBoard from "./component/weather-forecase-board/WeatherForecastBoard";
import CurrentWeatherBoard from "./component/current-weather-board/CurrentWeatherBoard";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchCity: [],
      photo: [],
      imageId: 0,
      foreCastWeather: [],
      currentWeather: [],
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    let cityTest = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
    let isCity = cityTest.test(e.target.elements[0].value);

    let city = e.target.elements[0].value || "Sydney";
    //splash photo api
    const Access_key = process.env.REACT_APP_PHOTO_KEY;
    console.log("photo",Access_key)
    const photo_api = await fetch(
      `https://api.unsplash.com/search/photos/?client_id=${Access_key}&query=${city}&orientation=landscape`
    );
    const response_photo = await photo_api.json();

    const nameError = document.getElementById("nameError");
    const limitError = document.getElementById("limitError");

    let cityItem;
    //store input cities into this.state.searchCity only when the photo data exited in splash api
    if (response_photo.results.length > 0) {
      cityItem = {
        id: new Date(),
        city: city,
        cityImage: response_photo.results[0].urls.small,
      };
      let cityNumber = this.state.searchCity.length;
      //the maximum city number is 4
      if (cityNumber < 4) {
        this.setState((prevState) => ({
          searchCity: prevState.searchCity.concat(cityItem),
        }));
      } else if (isCity === true && cityNumber > 3) {
        limitError.style.height = "2rem";
        setTimeout(() => (limitError.style.height = "0rem"), 4000);
      } else if (isCity === false) {
        nameError.style.height = "2rem";
        setTimeout(() => (nameError.style.height = "0rem"), 4000);
      }
    } else {
      nameError.style.height = "2rem";
      setTimeout(() => (nameError.style.height = "0rem"), 4000);
    }
  };

  getWeatherData = async (e) => {
    // forecast weather api
    const API_KEY = process.env.REACT_APP_WEATHER_KEY;
    console.log("weather_key",API_KEY)
    const city = e.target.id;
    const FroeCastWeatherData = await fetch(
      `http://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${API_KEY}`
    );
    const ForeCastResponse = await FroeCastWeatherData.json();
    this.setState({
      foreCastWeather: ForeCastResponse,
    });

    const selectedCity = document.getElementById(city);
    selectedCity.style.transform = "scale(1.1)";

    //current weather api
    const CurrentWeatherData = await fetch(
      `https://api.weatherbit.io/v2.0/forecast/hourly?city=${city}&key=${API_KEY}&hours=48`
    );
    const CurrentResponse = await CurrentWeatherData.json();
    this.setState({
      currentWeather: CurrentResponse,
    });
  };

  deleteCard = (cardIndex) => {
    let prevCities = new Set(this.state.searchCity);
    //return deleted cities
    let updatedCities = new Set(this.state.searchCity.splice(cardIndex, 1));
    //get the different set with prev cities,which are the cities want to remain
    let filterCities = Array.from(
      new Set([...prevCities].filter((x) => !updatedCities.has(x)))
    );
    this.setState({
      searchCity: filterCities,
    });
  };

  render() {
    return (
      <div className="app">
        <div className="app__container">
          <section className="app__container__left">
            {/* search bar */}
            <FiSearch className="search-icon" />
            <form onSubmit={this.handleSubmit}>
              <input type="text" placeholder="Search new place"></input>
              <button onClick={this.getData}>Search</button>
            </form>
            <div className="app__container__error" id="nameError">
              It is not a Valid City Name!
            </div>
            <div className="app__container__error" id="limitError">
              You only can add 4 cities!
            </div>
            {/* title */}
            <h4>
              Weather <span>Forecast</span>
            </h4>
            {/* city cards */}
            <CityCardContainer
              cities={this.state.searchCity}
              imageId={this.state.imageId}
              photo={this.state.photo}
              getWeatherData={this.getWeatherData}
              selectedCity={this.state.foreCastWeather}
              deleteCard={this.deleteCard}
            />
            {/* Weather Forecast Board */}
            <WeatherForecastBoard weather={this.state.foreCastWeather} />
          </section>
          <section className="app__container__right">
            {/* Current Weather Board */}
            <CurrentWeatherBoard weather={this.state.currentWeather} />
          </section>
        </div>
      </div>
    );
  }
}

export default App;
