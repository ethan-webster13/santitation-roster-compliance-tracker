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

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          
          <h2>Documentation</h2>
          <p>Your questions, answered</p>

        </div>

        <div id="social"> 
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
        </>
    )
}

export default Home;