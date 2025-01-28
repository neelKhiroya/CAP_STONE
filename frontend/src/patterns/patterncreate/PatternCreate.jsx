import { useNavigate } from 'react-router-dom'

import './pattern-create.css'

export default function PatternCreate() {

    const navagate = useNavigate()

    return (
        <div className="create-container-style">
            <h2 className="create-title">Want to create a pattern?</h2>
            <div className="create-container">
                <button className='button-alone' onClick={() => navagate('/create/new')}> click to create alone </button>
                <button> click to collaborate </button>
            </div>
        </div>
    )
}
