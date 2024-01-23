import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import personService from "./services/personService";
import Notification from "./components/Notifications";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons);
      })
      .catch((err) => {
        setMessage(err.message);
      });
  }, []);

  //Form submitting
  const handleSubmitName = (e) => {
    e.preventDefault();
    const personExists = persons.filter((person) => {
      return person.name.toLocaleLowerCase() === newName.toLocaleLowerCase();
    });

    if (personExists.length > 0) {
      const confirm = window.confirm(
        `${personExists[0].name} is already added to phonebook, replace the old number with a new one`
      );
      if (confirm === true) {
        const updatedPerson = {
          id: personExists[0].id,
          name: newName,
          number: newNumber,
        };
        personService
          .update(personExists[0].id, updatedPerson)
          .then(() => {
            setPersons(
              persons
                .filter((person) => person.id !== updatedPerson.id)
                .concat(updatedPerson)
            );
            setNewName("");
            setNewNumber("");
            setMessage("Added new number");
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          })
          .catch((err) => {
            setMessage(err.message);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          });
      }
      if (confirm === false) return;
    }

    if (personExists.length === 0) {
      const createdPerson = { name: newName, number: newNumber };

      personService
        .create(createdPerson)
        .then((response) => {
          setPersons(persons.concat(response));
          setMessage(`Added ${response.name}`);
        })
        .catch((err) => {
          setMessage(err.message);
        });

      setTimeout(() => {
        setMessage(null);
      }, 5000);
      setNewName("");
      setNewNumber("");
    }
  };

  //Name input controller
  const handleChangeName = (e) => {
    setNewName(e.target.value);
  };

  //Number input controller
  const handleChangeNumber = (e) => {
    setNewNumber(e.target.value);
  };

  //Deleting person
  const handleDeletePerson = (id) => {
    const selectedPerson = persons.filter((person) => person.id === id);

    if (
      window.confirm(
        `${selectedPerson[0].name} will be removed from phonebook`
      ) === true
    ) {
      const changedPersons = persons.filter((person) => person.id !== id);

      personService
        .remove(id)
        .then(() => {
          setPersons(changedPersons);
        })
        .catch(() => {
          setMessage(
            `Information of ${selectedPerson[0].name} has already been removed from server`
          );

          setTimeout(() => {
            setMessage(null);
            setPersons(changedPersons);
          }, 3000);
        });
    }
  };

  //Storing filter input
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} />

      <Filter handleSearchTerm={handleSearchTerm} searchTerm={searchTerm} />

      <h3>Add a new</h3>
      <PersonForm
        handleChangeName={handleChangeName}
        handleSubmitName={handleSubmitName}
        handleChangeNumber={handleChangeNumber}
        newNumber={newNumber}
        newName={newName}
      />

      <h3>Numbers</h3>

      <div>
        <Persons
          persons={persons}
          handleDeletePerson={handleDeletePerson}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
};

export default App;
