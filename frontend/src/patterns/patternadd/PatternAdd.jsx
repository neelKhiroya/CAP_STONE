import { useState } from 'react';
import useAddPattern from '../../hooks/useAddPattern'; // Import the custom hook
import { convertGridAndNamesToStrings } from '../../util/convertStringsAndGrids';
import "./patternadd.css"
import PatternInputs from './PatternInputs';
import Spinner from '../componets/Spinner'
import PopUp from '../componets/PopUp';
import BackButton from '../componets/BackButton';
import { useNavigate } from 'react-router-dom';

const PatternAdd = () => {

  const { loading, error, addPattern } = useAddPattern(); // Use the custom hook
  const navagate = useNavigate()

  const [pattern, setPattern] = useState({
    name: '',
    username: '',
    author: '',
    description: '',
    drumrows: []
  });

  //  2 rows of 16 cols
  let tempgrid = Array.from({ length: 2 }, () => Array(16).fill(false));
  let templateNames = ["Snare", "Kick", "Closed Hat", "Open Hat", "808"];

  const [grid, setGrid] = useState(tempgrid)
  const [drumrows, setDrumrows] = useState(['Snare', 'Kick'])
  const [showPopUp, setPopUp] = useState(false);

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
        const newGrid = [...prevGrid, Array(16).fill(false)];
        return newGrid;
      });

      let randomInt = Math.floor(Math.random() * templateNames.length)
      setDrumrows(prevRows => [...prevRows, templateNames[randomInt]]);
    }
  }

  const removeDrumRow = (rowIndex) => {
    if (drumrows.length > 2) {
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row => [...row]); // copy each row, since 2d
        newGrid.splice(rowIndex, 1);
        return newGrid;
      });
      setDrumrows(prevRows => {
        const newRow = [...prevRows];
        newRow.splice(rowIndex, 1);
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
      setPopUp(false)
    }
  };

  return (
    <div>

    <BackButton onPress={() => navagate('/')} />

      <PopUp
        isOpen={showPopUp}
        prompt='Are you sure you want to submit this drum pattern?'
        onCancel={() => setPopUp(false)}
        onSubmit={handleSubmit}
      />

      <h2 className='title'>Add a New Pattern</h2>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {loading && <Spinner />}
      <h3 className='add-title'>info</h3>
      <PatternInputs
        pattern={pattern}
        onChange={handleInputChange}
      />
      <div style={{margin: '42px'}}> </div>
      <h3 className='add-title'>pattern</h3>
      <div className='add-center'>
        <div className="add-container">
          {grid.map((rows, rowIndex) => (
            <div key={rowIndex} className="add-grid-row">

              <input
                className="add-row-label"
                value={drumrows[rowIndex]}
                id={rowIndex}
                onChange={handleDrumRowNameChange} />

              {rows.map((_, colIndex) => (
                <>
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    className={grid[rowIndex][colIndex] ? 'add-grid-button active' :
                      `add-grid-button ${colIndex % 8 < 4 ? `` : `dark`}`}
                    onClick={() => toggleGrid(rowIndex, colIndex)}
                  >
                  </button>
                  {colIndex % 4 == 3 && colIndex < 12 ? <div></div> : <></>}
                </>
              ))}
              <button
                className='add-delete-button'
                onClick={() => removeDrumRow(rowIndex)}
              >
                <i className="fa-solid fa-trash" />
              </button>
            </div>
          ))}
          <button className='add-drumrow-button' onClick={addDrumRow}>
            <i className="fa-solid fa-plus" />
          </button>
        </div>
      </div>

      <div className='add-desc-container'>
        <textarea
          type="text"
          id='description'
          name='description'
          value={pattern.description}
          onChange={handleInputChange}
          placeholder='Description/notes'
          className='add-description'
        />
      </div>

      <div className='add-button-container'>
        <button className='add-button-submit' disabled={loading} onClick={() => setPopUp(true)}>Add Pattern</button>
      </div>

    </div>
  );
};

export default PatternAdd;