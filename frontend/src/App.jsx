import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Patterns from "./patterns/Patterns"
import PatternAdd from "./patterns/patternadd/PatternAdd"

import "./App.css"
import PatternView from './patterns/patternview/PatternView';
import PatternCollab from './patterns/patterncreate/PatternCollab';

function App() {
 
  return (
    <Router>
      <Routes>
        <Route path='/'             element={<Patterns />} />
        <Route path='/pattern/:id'  element={<PatternView />} />
        <Route path='/create/new'   element={<PatternAdd />}/>
        <Route path='/create/collab'   element={<PatternCollab />}/>
      </Routes>
    </Router>
  )
}

export default App
