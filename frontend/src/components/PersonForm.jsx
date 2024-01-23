const PersonForm = ({
  handleSubmitName,
  newName,
  handleChangeName,
  newNumber,
  handleChangeNumber,
}) => {
  return (
    <form onSubmit={handleSubmitName}>
      <div>
        name:{" "}
        <input
          value={newName}
          onChange={handleChangeName}
          type="string"
          required
        />
      </div>
      <div>
        number:{" "}
        <input
          value={newNumber}
          onChange={handleChangeNumber}
          type="number"
          required
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
