import useGetPaginatedPatterns from "../hooks/useGetPaginatedPatterns";
import PropTypes from 'prop-types';

PatternList.propTypes = {
  handlePatternSelect: PropTypes.func.isRequired,
  selectedPatternID: PropTypes.func.isRequired,
}

function PatternList({
    handlePatternSelect,
    selectedPatternID,
  }) {

    const {patterns, loading, error} = useGetPaginatedPatterns(20, 0);

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
          <li key={pattern.id} onClick={() => onSelection(pattern.id)}>{pattern.name} by {pattern.username}</li>
        ))}
      </ul>
    </div>
  )
}

export default PatternList