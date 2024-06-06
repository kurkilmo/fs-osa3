const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://kurkilmo:${password}@bmur0.ebkja2y.mongodb.net/phonebook?
  retryWrites=true&w=majority&appName=Bmur0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
  console.log('phonebook:')
  Person.find({}).then(res => {
    res.forEach(p => {
      console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
  })
  return
}

const name = process.argv[3]
const number = process.argv[4]

const person = new Person({
  name: name,
  number: number
})

person.save().then(ignored => {
  console.log(`added ${name} number ${number} to phonebook`)
  mongoose.connection.close()
})
/*
const note = new Note({
  content: 'HTML is easy',
  important: true,
})


note.save().then(result => {
  console.log('note saved!')
  console.log(result);
  mongoose.connection.close()
})

Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
    */