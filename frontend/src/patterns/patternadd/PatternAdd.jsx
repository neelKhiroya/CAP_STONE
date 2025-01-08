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

  //  2 rows of 16 cols
  let tempgrid = Array.from({ length: 2 }, () => Array(16).fill(false));

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
    if (drumrows.length < 6) {
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
  }

  const removeDrumRow = () => {
    if (drumrows.length > 2) {
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
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPattern({ ...pattern, [name]: value });
  };

  const handleDrumRowNameChange = (e) => {
    const { id, value } = e.target;

    const temprows = drumrows.map((name, index) => {
      if (id == index) {
        return value;
      } else return name;
    })
    setDrumrows(temprows)
  }

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

            <input
              className="row-label"
              placeholder={drumrows[rowIndex]}
              id={rowIndex}
              onChange={handleDrumRowNameChange} />

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