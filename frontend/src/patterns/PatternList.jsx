import useGetPatterns from "../hooks/useGetPatterns";

export default function PatternList() {

    const {patterns, loading, error} = useGetPatterns();

    if (loading) return <div>Loading!!</div>

    if (error) return <div>error: {error.message}</div>

  return (
    <div>
      <ul>
        {patterns.map((pattern) => (
          <li key={pattern.ID}>{pattern.Name} by {pattern.Username}</li> // Assuming 'id' and 'name' fields in your patterns data
        ))}
      </ul>
    </div>
  )
}
