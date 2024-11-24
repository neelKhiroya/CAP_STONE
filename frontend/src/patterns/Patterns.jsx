import { useState } from 'react'
import PatternList from './PatternList'
import PatternModal from './PatternModal';

export default function Patterns() {

    const [selectedPatternID, setID] = useState();
    const [isPatternSelected, setPatternSelected] = useState(false)

    if (isPatternSelected) return (<PatternModal id={selectedPatternID} onClose={setPatternSelected}/>)

    else return (
        <PatternList
            handlePatternSelect={setPatternSelected}
            selectedPatternID={setID}
        />)
}
