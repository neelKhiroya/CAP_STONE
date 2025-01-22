import PatternList from './patternlist/PatternList'

import './patterns.css'
import SearchBar from './patternsearch/SearchBar';

export default function Patterns() {

    return (
        <>
            <SearchBar />

            <h1 className='title'>PatternDB</h1>

            <PatternList />
        </>
    )
}