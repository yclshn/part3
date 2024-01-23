const Filter = ({ searchTerm, handleSearchTerm }) => {
  return (
    <div>
      <p>filter shown with</p>
      <input onChange={handleSearchTerm} value={searchTerm} />
    </div>
  );
};

export default Filter;
