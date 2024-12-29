import PropTypes from "prop-types"
import useGetPattern from '../../hooks/useGetPattern';
import { convertStringsToGrid } from "../../util/convertStringsAndGrids";

import '../styles/css/patternModal.css'
import PatternModal from "./PatternModal";

PatternView.propTypes = {
  onClose: PropTypes.func,
  id: PropTypes.number.isRequired,
}

function PatternView({
  onClose,
  id,
}) {

  const { pattern, loading, error } = useGetPattern(id);

  if (loading) return <div>Loading!!</div>

  if (error) return <div>error: {error.message}</div>

  const grid = convertStringsToGrid(pattern.drumrows);

  const handleClose = () => {
    onClose(false)
  }

  return (
    <div>
      <div className="mybutton">
        <button onClick={handleClose}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
      </div>

      <PatternModal pattern={pattern} grid={grid} />


    </div>
  )
}

export default PatternView