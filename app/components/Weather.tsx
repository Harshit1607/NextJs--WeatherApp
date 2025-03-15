"use client";

import { ChangeEvent, useState } from "react";
import search from '../../assets/search.svg';
import Image from 'next/image';

const Weather: React.FC = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState("");

  // Handles input changes
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

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
    } catch (err) {
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

  return (
    <div className="w-screen h-screen flex">
      <div className="h-full w-[60%] flex justify-start items-end"></div>
      <div className="h-full w-[40%] bg-black text-white flex flex-col justify-center items-center gap-2 p-4">
        <div className="flex h-[15%] w-[80%]">
          <form onSubmit={handleSubmit} className="flex w-full gap-2 relative justify-center w-[80%]">
            <input 
              className="w-full h-[50%] bg-white rounded-sm text-black" 
              type="text" 
              placeholder="Enter city..." 
              onChange={handleInput}
            />
            <button type="submit" className=" absolute right-[5%] top-[12%] cursor-pointer"><Image src={search} alt="search" width={24} height={24} /></button>
          </form>
        </div>
        
            {/* Weather Details */}
            <div className="flex flex-col h-[25%] w-[80%]">
              <span className="text-lg font-bold">Weather Details</span>
              <div className="flex justify-between w-full">
                <span>Temperature:</span><span>{weatherData?.temperature}°C</span>
              </div>
              <div className="flex justify-between w-full">
                <span>Humidity:</span><span>{weatherData?.humidity}%</span>
              </div>
              <div className="flex justify-between w-full">
                <span>Wind Speed:</span><span>{weatherData?.wind_speed} km/h</span>
              </div>
              <div className="flex justify-between w-full">
                <span>Condition:</span><span>{weatherData?.weather}</span>
              </div>
            </div>

            {/* Air Quality & Additional Data */}
            <div className="flex flex-col h-[25%] w-[80%]">
              <span className="text-lg font-bold">Additional Info</span>
              <div className="grid grid-cols-2 gap-2">
                <span>Pressure: {weatherData?.pressure_mb} mb</span>
                <span>Wind Dir: {weatherData?.wind_dir}</span>
                <span>Visibility: {weatherData?.visibility_km} km</span>
              </div>
            </div>
        

        <div className="flex h-[10%] w-[90%]">
          <span className="w-full text-right text-sm">Weather Forecast</span>
        </div>
      </div>
    </div>
  );
};

export default Weather;
