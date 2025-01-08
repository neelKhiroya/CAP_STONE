import PropTypes from "prop-types"
import PatternInput from "./PatternInput"

PatternInputs.propTypes = {
    pattern: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default function PatternInputs({
    pattern,
    onChange
}) {
  return (
    <>
    <PatternInput
            patternName="name"
            title="Pattern Name: "
            value={pattern.name}
            onChange={onChange}
            isRequired
          />
    
          <PatternInput
            patternName="username"
            title="Name of User: "
            value={pattern.username}
            onChange={onChange}
            isRequired
          />
    
          <PatternInput 
            patternName="author" 
            title="Author of Pattern: " 
            value={pattern.author} 
            onChange={onChange} 
            isRequired 
          />
    
          <PatternInput
            patternName='description'
            title='Description/notes'
            value={pattern.description}
            onChange={onChange}
            isRequired={false}
          />
    </>
  )
}
