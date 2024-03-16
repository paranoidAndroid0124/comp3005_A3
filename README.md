# Comp 3005 A3 Q1

Vincent gagnon
101052796

This application uses the drizzle to directly map what the database to typescript. Allowing for easy of schema update
and query to the database.

# Pre-requisites

### Clone repository

```bash
git clone git@github.com:paranoidAndroid0124/comp3005_A3.git
```

The following programs must be installed

- Postgres
- nodejs
- yarn

# Setup

### connect to postgres
1. Open the .env file in the root of the directory of the project.
2. Update the DATABASE_URL to match your specific configure. Example: "postgres://postgres:adminadmin@0.0.0.0:5432/db"

### Install dependency
1. open terminal in the root of the project and run 
```bash
yarn install
```

# Start application
```bash
yarn start
```

# Sql files
All sql files generated can be found under src/drizzle
