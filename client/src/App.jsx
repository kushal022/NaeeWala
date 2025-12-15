import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useTheme } from './context/ThemeContext'

function App() {
  const [count, setCount] = useState(0)
   const { theme, toggleTheme } = useTheme();

  return (
    <>
     
     
       <button
      onClick={toggleTheme}
      className="
        px-4 py-2 rounded-lg font-medium
        bg-[#10232A] text-[#D3C3B9]
        dark:bg-[#B58863] dark:text-[#161616]
        transition-all
      "
    >
      {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
    </button>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)} className='bg-red-500 text-white p-4 dark:bg-mint dark:font-script' >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
