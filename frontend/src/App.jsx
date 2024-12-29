import { useState } from "react"
import Patterns from "./patterns/Patterns"
import PatternAdd from "./patterns/patternadd/PatternAdd"

import "./App.css"

function App() {
 
  const [isSelected, setSelected] = useState(false);

  return (
    <div>
      {isSelected ? <PatternAdd/> : <Patterns/>}
      <button onClick={() => setSelected(!isSelected)}> click to toggle </button>
    </div>
  )
}

export default App
