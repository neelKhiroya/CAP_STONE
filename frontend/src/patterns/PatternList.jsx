import useGetAllPatterns from "../hooks/useGetAllPatterns";
import PropTypes from 'prop-types';

PatternList.propTypes = {
  handlePatternSelect: PropTypes.func.isRequired,
  selectedPatternID: PropTypes.func.isRequired,
}

function PatternList({
    handlePatternSelect,
    selectedPatternID,
  }) {

    const {patterns, loading, error} = useGetAllPatterns();

    if (loading) return <div>Loading!!</div>

    if (error) return <div>error: {error.message}</div>

  const onSelection = (id) => {
    handlePatternSelect(true);
    selectedPatternID(id);
  }

  return (
    <div>
      <ul>
        {patterns.map((pattern) => (
          <li key={pattern.ID} onClick={() => onSelection(pattern.ID)}>{pattern.Name} by {pattern.Username}</li>
        ))}
      </ul>
    </div>
  )
}

export default PatternList