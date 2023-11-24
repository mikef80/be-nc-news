# Northcoders News API

This is the backend project of my Northcoders Software Development Bootcamp.

It is a backend Reddit-clone client, serving data via a variety of API endpoints.

For a summary of available endpoints and data provided, please visit the hosted version of this app at [https://reddit-backend-client.onrender.com/api](https://reddit-backend-client.onrender.com/api)

## How to use this repo

1. Clone the repo to your local machine

2. Run `npm install` to install all required dependencies.
    - Minimum versions required:
      - Node - v20.5.0
      - PostgreSQL - v15

3. This repo requires you to set up your own database connections as these will be specific to you. This assumes that you have PSQL installed locally on your machine.

    - As the repo uses both `dev` and `test` environments, you will need to set up separate databases for each of these, using the following steps:

      1. create a file in the root of the repo named `.env.test` and place the following code inside the file:
      ```
      PGDATABASE=nc_news_test
      ```
      2. create a second file in the root of the repo named `.env.development` and place the following code inside the file:
      ```
      PGDATABASE=nc_news
      ```
      3. Make sure to save both files.

4. Run `npm run setup-dbs`

5. if creating a production environment using a hosted DB such as [ElephantSQL](http://www.elephantsql.com), you will need to create a `.env.production` file in the root of the project.
          - Paste the following into the file, replace the URL with your own `DATABASE_URL=postgres://YOUR_URL_GOES_HERE`


5. Run `npm run seed` to seed the test DB, and/or run `npm run seed-prod` to seed the production DB.

6. To run all provided tests, run `npm test`
