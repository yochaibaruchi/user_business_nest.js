for dev 

1. copy .env.example file to .env file
2. RUN npm i
3. RUN docker-compose up -d


**TypeORM Scripts


RUN npm run migration:generate db/migrations/{name of the migration} --> for looking for changes and create new migration file if there is any change

RUN npm run migration:run --> run the migration file you created earlier to insert your changes to the database



RUN npm run   typeorm:revert-migration




