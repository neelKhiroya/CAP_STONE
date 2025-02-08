import PropTypes from "prop-types"
import PatternInput from "./PatternInput"

import './pattern-inputs.css';
import { useEffect } from "react";

PatternInputs.propTypes = {
  pattern: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default function PatternInputs({
  pattern,
  onChange
}) {

  useEffect(() => {
      console.log(pattern.name.length)
  }, [pattern.name])

  return (
    <div className="pattern-inputs-container">

      <div className="pattern-name-item">
        <PatternInput
          patternName="name"
          title="Pattern Name: "
          value={pattern.name}
          onChange={onChange}
          isRequired
          className={`my-input ${(pattern.name.length <= 2 && pattern.name.length != 0) || pattern.name.length >= 32 ? 'invalid' : ' '}`}
        />
      </div>

     
        <PatternInput
          patternName="username"
          title="Name of Uploader: "
          value={pattern.username}
          onChange={onChange}
          className={`my-input ${(pattern.username.length <= 2 && pattern.username.length != 0) || pattern.username.length >= 32 ? 'invalid' : ' '}`}
          isRequired
        />
     

        <PatternInput
          patternName="author"
          title="Author of Pattern: "
          value={pattern.author}
          onChange={onChange}
          className={`my-input ${(pattern.author.length <= 2 && pattern.author.length != 0) || pattern.author.length >= 32 ? 'invalid' : ' '}`}
          isRequired
        />
      
    </div>
  )
}
