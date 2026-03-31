import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import {Toaster} from "react-hot-toast"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster/>
      <main>
        <Outlet/>
      </main>
    </div>
  )
}

export default App
