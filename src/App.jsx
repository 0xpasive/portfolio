import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import APIPortfolio from './portfolio'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <APIPortfolio />
    </>
  )
}

export default App
