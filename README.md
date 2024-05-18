# BOILERPLATE

1. Start by creating a local repository for this folder.

1. In the repo root directory, run `npm install` to gather all dependencies.

1. Next, `npm run seed` will seed the local SQLite database. **Warning: This will drop the database if it exists**. The database lives in a local file `database.sqlite3`.

1. Then run `npm start` which should start both the server and the React client.

## Technical Notes

- The server is running with [nodemon](https://nodemon.io/) which will automatically restart for you when you modify and save a file.

- The database provider is SQLite, which will store data in a file local to your repository called `database.sqlite3`. The ORM [Sequelize](http://docs.sequelizejs.com/) is on top of it.

- The server is running on port 3001.

## Notes

### Helpful commands

- Run in debug mode to see error stack trace: `npm run start_debug`
- Run all tests: `npm run test`
- Run prettier: `npm run prettier`
- Display linting errors: `npm run lint`
- Fix linting errors: `npm run lint:fix`
