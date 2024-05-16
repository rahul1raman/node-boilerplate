const { Sample } = require("../src/model");

/* WARNING THIS WILL DROP THE CURRENT DATABASE */
seed();

async function seed() {
  // create tables
  await Sample.sync({ force: true });
  // insert seed data
  await Promise.all([
    Sample.create({
      id: 1,
      firstName: "Harry",
      lastName: "Potter",
      profession: "Wizard",
      balance: 1150,
      type: "client",
    }),
    Sample.create({
      id: 2,
      firstName: "Mr",
      lastName: "Robot",
      profession: "Hacker",
      balance: 231.11,
      type: "client",
    }),
    Sample.create({
      id: 3,
      firstName: "John",
      lastName: "Snow",
      profession: "Knows nothing",
      balance: 451.3,
      type: "client",
    }),
    Sample.create({
      id: 4,
      firstName: "Ash",
      lastName: "Kethcum",
      profession: "Pokemon master",
      balance: 1.3,
      type: "client",
    }),
    Sample.create({
      id: 5,
      firstName: "John",
      lastName: "Lenon",
      profession: "Musician",
      balance: 64,
      type: "contractor",
    }),
    Sample.create({
      id: 6,
      firstName: "Linus",
      lastName: "Torvalds",
      profession: "Programmer",
      balance: 1214,
      type: "contractor",
    }),
    Sample.create({
      id: 7,
      firstName: "Alan",
      lastName: "Turing",
      profession: "Programmer",
      balance: 22,
      type: "contractor",
    }),
    Sample.create({
      id: 8,
      firstName: "Aragorn",
      lastName: "II Elessar Telcontarvalds",
      profession: "Fighter",
      balance: 314,
      type: "contractor",
    }),
  ]);
}
