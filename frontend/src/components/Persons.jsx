const Persons = ({ persons, handleDeletePerson, searchTerm }) => {
  return (
    <ul>
      {persons
        .filter((person) => person.name.toLowerCase().includes(searchTerm))
        .map((person) => {
          return (
            <li key={person.id}>
              <span>
                {person.name} {person.number}
              </span>
              <button onClick={() => handleDeletePerson(person.id)}>
                delete
              </button>
            </li>
          );
        })}
    </ul>
  );
};

export default Persons;
