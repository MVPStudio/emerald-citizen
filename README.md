# Server

This server implements a simple todos rest api using the following libraries:

- routing/http
  - expressjs
- logging
  - winston
- config
  - dotenv
- database access & migrations (postgresql)
  - knex
- authentication
  - passport
- sessions
  - express-session

## Tasks

```
start // migrate the database and start the server in development mode that restarts on file change
createMigration // create a new migration script (goes to src/database/migrations)
```
