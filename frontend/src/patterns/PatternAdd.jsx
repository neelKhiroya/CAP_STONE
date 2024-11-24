import { useState } from 'react';
import useAddPattern from '../hooks/useAddPattern'; // Import the custom hook

const PatternAdd = () => {
    
  const { loading, error, addPattern } = useAddPattern(); // Use the custom hook

  const [pattern, setPattern] = useState({
    name: '',
    username: '',
    row0: '',
    row1: '',
    row2: '',
    row3: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPattern({ ...pattern, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call the addPattern function from the custom hook
    const result = await addPattern(pattern);
    if (result) {
      // Optionally reset the form after a successful submission
      setPattern({
        name: '',
        username: '',
        row0: '',
        row1: '',
        row2: '',
        row3: ''
      });
    }
  };

  return (
    <div>
      <h2>Add a New Pattern</h2>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {loading && <p>Loading...</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Pattern Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={pattern.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={pattern.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="row0">Row 0</label>
          <input
            type="text"
            id="row0"
            name="row0"
            value={pattern.row0}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="row1">Row 1</label>
          <input
            type="text"
            id="row1"
            name="row1"
            value={pattern.row1}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="row2">Row 2</label>
          <input
            type="text"
            id="row2"
            name="row2"
            value={pattern.row2}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="row3">Row 3</label>
          <input
            type="text"
            id="row3"
            name="row3"
            value={pattern.row3}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>Add Pattern</button>
      </form>
    </div>
  );
};

export default PatternAdd;