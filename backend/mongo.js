const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstackopenpart3:${password}@cluster0.e8shqve.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: {
    type: String,
    default: '',
  },
})

const Person = new mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    // console.log(result);
    console.log('phonebook:')
    result.map((person) => console.log(person.name, person.number))
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then(() => {
    console.log(
      `àdded ${process.argv[3]} number ${process.argv[4]} to phonebook`
    )
    mongoose.connection.close()
  })
}
