import useGetPattern from '../../hooks/useGetPattern';
import { convertStringsToGrid } from "../../util/convertStringsAndGrids";

import { useNavigate, useParams } from 'react-router-dom';
import '../styles/css/patternModal.css'
import PatternModal from "./PatternModal";
import Spinner from '../componets/Spinner';
import { useEffect, useState } from 'react';

function PatternView() {

  const { id } = useParams();
  const navigate = useNavigate()
  const { pattern, loading, error } = useGetPattern(id);
  const [delayedLoading, setLoading] = useState(true)
  const [grid, setGrid] = useState()

  useEffect(() => {
    setLoading(true)
    const timeoutID = setTimeout(() => {
      setGrid(convertStringsToGrid(pattern.drumrows))
      setLoading(false)
    }, 500); //.5 s

    // clear timeout
    return () => clearTimeout(timeoutID)
  }, [loading, pattern])

  if (error) return <div>error: {error.message}</div>

  const handleClose = () => {
    navigate('/')
  }

  const CenterSpinner = () => {
    return (
      <div className='center'>
        <Spinner />
      </div>
    )
  }

  return (
    delayedLoading ? <CenterSpinner /> :
      <div>

        <button onClick={handleClose} className="mybutton">
          <i className="fa-solid fa-arrow-left"></i>
        </button>

        <PatternModal pattern={pattern} grid={grid} />

      </div>
  )
}

export default PatternView