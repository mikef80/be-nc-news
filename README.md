# Northcoders News API

## How to use this repo

This repo requires you to set up your own database connections as these will be specific to you. This assumes that you have PSQL installed locally on your machine.

As the repo uses both `dev` and `test` environments, you will need to set up separate databases for each of these, using the following steps:

1. create a file in the root of the repo named `.env.test` and place the following code inside the file:
```
PGDATABASE=nc_news_test
```
2. create a second file in the root of the repo named `.env.development` and place the following code inside the file:
```
PGDATABASE=nc_news
```
3. Make sure to save both of these files.

Once these steps are completed, this will allow the DB setup and data population to happen correctly.