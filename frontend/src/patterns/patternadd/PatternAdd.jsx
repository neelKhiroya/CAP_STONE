import { useState } from 'react';
import useAddPattern from '../../hooks/useAddPattern'; // Import the custom hook
import { convertGridAndNamesToStrings } from '../../util/convertStringsAndGrids';

import "./patternadd.css"
import PatternInputs from './PatternInputs';

const PatternAdd = () => {

  const { loading, error, addPattern } = useAddPattern(); // Use the custom hook

  const [pattern, setPattern] = useState({
    name: '',
    username: '',
    author: '',
    description: '',
    drumrows: []
  });

  const rows = 2;
  const cols = 16;
  let tempgrid = Array.from({ length: rows }, () => Array(cols).fill(false));

  const [grid, setGrid] = useState(tempgrid)
  const [drumrows, setDrumrows] = useState(['Snare', 'Kick'])

  const toggleGrid = (row, col) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]); // copy each row, since 2d
      newGrid[row][col] = !newGrid[row][col];
      return newGrid;
    });
  };

  const addDrumRow = () => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]); // copy each row, since 2d
      tempgrid = Array(16).fill(false)
      newGrid.push(tempgrid)
      return newGrid;
    });
    setDrumrows(prevRows => {
      const newRow = [...prevRows]
      newRow.push("Kick")
      return newRow
    });
  }

  const removeDrumRow = () => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]); // copy each row, since 2d
      tempgrid = Array(16).fill(false)
      newGrid.pop()
      return newGrid;
    });
    setDrumrows(prevRows => {
      const newRow = [...prevRows]
      newRow.pop()
      return newRow
    });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPattern({ ...pattern, [name]: value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    let namesAndStrings = convertGridAndNamesToStrings(grid, drumrows)

    const newPattern = {
      ...pattern,
      drumrows: namesAndStrings, // makes it "flat" 
    };

    const result = await addPattern(newPattern);
    if (result) {
      // resets
      setPattern({
        name: '',
        username: '',
        author: '',
        description: '',
        drumrows: []
      });

      setDrumrows(['Snare', 'Kick'])
      setGrid(tempgrid)
    }
  };

  return (
    <div>
      <h2>Add a New Pattern</h2>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {loading && <p>Loading...</p>}

      <PatternInputs
        pattern={pattern}
        onChange={handleInputChange}
      />

      <div className="container">
        {grid.map((rows, rowIndex) => (
          <div key={rowIndex} className="grid-row">

            <div className="row-label">{drumrows[rowIndex]}</div>

            {rows.map((_, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={grid[rowIndex][colIndex] ? 'grid-button active' : 'grid-button'}
                onClick={() => toggleGrid(rowIndex, colIndex)}
              >
              </button>
            ))}
          </div>
        ))}
      </div>

      <button onClick={addDrumRow}>Add Drumrow</button>
      <button onClick={removeDrumRow}>Remove Drumrow</button>
      <button disabled={loading} onClick={handleSubmit}>Add Pattern</button>

    </div>
  );
};

export default PatternAdd;