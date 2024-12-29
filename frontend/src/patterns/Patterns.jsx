import { useState } from 'react'
import PatternList from './PatternList'
import PatternView from './patternview/PatternView';

import './patterns.css'
import PatternSearch from './patternsearch/PatternSearch';

export default function Patterns() {

    const [selectedPatternID, setID] = useState();
    const [isPatternSelected, setPatternSelected] = useState(false)

    if (isPatternSelected) return (<PatternView id={selectedPatternID} onClose={setPatternSelected} />)

    else return (
        <>
            <PatternSearch />

            <h1 className='title'>PatternDB</h1>

            <PatternList
                handlePatternSelect={setPatternSelected}
                selectedPatternID={setID}
            />
        </>
    )
}