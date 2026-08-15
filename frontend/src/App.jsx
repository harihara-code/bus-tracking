import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Map from './Map'
import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [busesData, setBusesData] = useState([]);

  useEffect(() => {
    async function fetchBusesData() {
      try {
        const response = await axios.get(
          "https://bus-tracking-spb1.onrender.com/api/buslocations"
        )

        setBusesData(response.data)
      } catch (error) {
        console.error("Failed to fetch bus locations:", error)
      }
    }

    fetchBusesData();

    const interval = setInterval(() => {
      fetchBusesData();
    }, 3000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  return (
    <Map busesData={busesData} />
  )
}


export default App;
