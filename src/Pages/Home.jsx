import NavBar from '../Components/NavBar';
import ShortcutCard from '../Components/ShortcutCard';
import { About } from '../Components/About';
import MetricsBar from '../Components/MetricsBar';
import { useState, useEffect, createContext, useContext } from 'react';
import ErrorBoundary from '../Components/ErrorBoundary';

const Home = () => {


  const shortcuts = [
    {

    }
  ]

    return (
        <>
            <NavBar />  {/*Navigation Component */}
        
        <section id="center">
            <h1>Port Orchard Sanitation and Compliance Org</h1>
            <div className="grid-container">
                <About />
                --KPI indicators--<br />
                <ErrorBoundary label="Current Metrics Bar">
                  <MetricsBar />
                </ErrorBoundary>
            </div>
      </section>

        </>
    )
}

export default Home;