"use client";

import { ChangeEvent, useState, useEffect } from "react";
import search from '../../assets/search.svg';
import Image from 'next/image';


// Import weather images
import thunderstorm from '../../assets/thunderstorm.webp';
import cloudy from '../../assets/cloudy.webp';
import sunny from '../../assets/sunny.webp';
import drizzle from '../../assets/drizzle.webp';
import snow from '../../assets/snow.webp';
import rain from '../../assets/rain.webp';
import other from '../../assets/other.webp'

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  wind_dir: number;
  pressure_mb: number;
  visibility_km: number;
  feels_like: number;
  weather: string;
  icon: string;
  day_of_week: string;
}

const Weather: React.FC = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");

  // Handles input changes
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  // Function to fetch city based on user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`/api/location?lat=${latitude}&long=${longitude}`);
            const data = await res.json();
            if (data.city && data.state) {
              setCity(data.state);
              fetchWeather(data.state); // Fetch weather for detected city
            }
          } catch {
            setError("Failed to get location.");
          }
        },
        () => {
          setError("Location access denied.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  // Fetch user's location when the page loads
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // Fetch weather data
  const fetchWeather = async (cityName: string) => {
    try {
      setError(""); // Reset error message
      setWeatherData(null); // Reset previous data
      const res = await fetch(`/api/weather?city=${cityName}`);
      const data = await res.json();

      if (res.ok) {
        setWeatherData(data);
      } else {
        setError(data.error || "Failed to fetch weather data.");
      }
    } catch {
      setError("Failed to fetch weather data.");
    }
  };

  

  // Handles form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }
    fetchWeather(city); // Fetch weather for the entered city
  };

  const getBackgroundStyle = () => {
    const weatherCondition = weatherData?.weather?.toLowerCase();
    const hour = new Date().getHours();
    const isNight = hour >= 18 || hour < 6; // Nighttime condition
  
    let backgroundImage = other.src; // Default image
  
    if (weatherCondition?.includes("thunderstorm")) backgroundImage = thunderstorm.src;
    else if (weatherCondition?.includes("cloud")) backgroundImage = cloudy.src;
    else if (weatherCondition?.includes("clear") || weatherCondition?.includes("sunny")) backgroundImage = sunny.src;
    else if (weatherCondition?.includes("drizzle")) backgroundImage = drizzle.src;
    else if (weatherCondition?.includes("snow")) backgroundImage = snow.src;
    else if (weatherCondition?.includes("rain")) backgroundImage = rain.src;
  
    return {
      backgroundImage: `url(${backgroundImage})`,
      filter: isNight ? "brightness(60%)" : "none", // Darken image at night
      transition: "filter 0.5s ease-in-out",
    };
  };

  if(error){
    alert(error);
  }

  return (
    <div
      className="w-screen h-screen flex bg-cover bg-center max-h-screen max-w-screen overflow-hidden
                 max-md:flex-col max-md:h-[150vh] max-md:max-h-[150vh] max-md:overflow-hidden"
      style={getBackgroundStyle()}
    >
      {/* First Div (Weather Display) */}
      <div
        className="h-full w-[65%] flex justify-start items-end 
                   max-md:w-[100%] max-md:h-[50vh] max-md:justify-center max-md:items-center max-md:opacity-[30%] max-md:bg-black max-md:text-white max-md:text-opacity-100"
      >
        <div className="flex flex-row w-[50%] h-[15%] justify-end max-md:h-[80%] max-md:w-[100%] ">
          <div className="w-[45%] h-full text-8xl flex justify-end items-center max-md:justify-end max-md:w-[50%]">
            {weatherData?.temperature}°C
          </div>
          <div className="w-[45%] h-full flex flex-col justify-center items-start text-lg ml-10px max-md:text-md max-md:w-[50%] max-md:h-[100%] max-md:justify-center">
            <span className="h-[25%]">{weatherData?.city}</span>
            <span className="h-[25%]">{weatherData?.day_of_week}</span>
            <div className="flex justify-center items-center h-[25%]">
              <span>{weatherData?.weather}</span>
            </div>
          </div>
        </div>
      </div>
  
      {/* Second Div (Search & Weather Details) */}
      <div
        className="h-full w-[35%] bg-black opacity-[50%] text-white flex flex-col justify-center items-center gap-2 p-4
                   max-md:w-[100%] max-md:h-[100vh] max-md:opacity-[30%] max-md:text-opacity-[100%] max-md:text-white"
      >
        {/* Search Input */}
        <div className="flex h-[15%] w-[80%]">
          <form onSubmit={handleSubmit} className="flex w-full gap-2 relative justify-center w-[80%]">
            <input
              className="w-full h-[50%] bg-white rounded-sm text-black p-2 box-border outline-none"
              type="text"
              placeholder="Enter city..."
              onChange={handleInput}
            />
            <button type="submit" className="absolute right-[2%] top-[12%] cursor-pointer">
              <Image src={search} alt="search" width={24} height={24} />
            </button>
          </form>
        </div>
  
        {/* Weather Details */}
        <div className="flex flex-col h-[25%] w-[80%] border-b-1 justify-evenly box-border pb-[5%] max-md:h-[30%]">
          <span className="text-xl mb-5">Weather Details</span>
          <div className="flex justify-between w-full">
            <span>Humidity:</span>
            <span>{weatherData?.humidity}%</span>
          </div>
          <div className="flex justify-between w-full">
            <span>Wind Speed:</span>
            <span>{weatherData?.wind_speed} km/h</span>
          </div>
          <div className="flex justify-between w-full">
            <span>Wind Dir:</span>
            <span>{weatherData?.wind_dir}</span>
          </div>
          <div className="flex justify-between w-full">
            <span>Condition:</span>
            <span>{weatherData?.weather}</span>
          </div>
        </div>
  
        {/* Additional Info */}
        <div className="flex flex-col h-[30%] w-[80%] mt-[5%] max-md:mt-[2%] max-md:h-[25%]">
          <span className="text-xl mb-5">Additional Info</span>
          <div className="grid grid-cols-2 gap-5 text-center w-full">
            <span className="col-span-1 flex justify-start">Pressure: {weatherData?.pressure_mb} mb</span>
            <span className="col-span-1 flex justify-end">Feels Like: {weatherData?.feels_like} °C</span>
            <span className="col-span-2 flex justify-center">Visibility: {weatherData?.visibility_km} km</span>
          </div>
        </div>
  
        {/* Forecast Section */}
        <div className="flex h-[10%] w-[90%]">
          <span className="w-full text-right text-sm">Weather Forecast</span>
        </div>
      </div>
    </div>
  );
  
};

export default Weather;
