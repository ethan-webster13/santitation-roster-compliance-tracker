import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(()=> {
        const savedTheme = localStorage.getItem("app-theme");
        return savedTheme === "dark"
    });

    useEffect(()=> {
        if (isDarkMode) {
            document.body.classList.add("dark-theme");
            localStorage.setItem("app-theme", "dark");
        } else {
            document.body.classList.remove("dark-theme");
            localStorage.setItem("app-theme", "light")
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode((prev)=> !prev);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};