# Example client-server application using a client service object
The application will reload on source changes.

## Client: run tests and start
From the top-level repository folder:
```sh
cd client
npm install
npm test
npm start
```

## Server: run tests and start
First, create a `Students`-table with initial data at https://mysql-ait.stud.idi.ntnu.no:
```sql
CREATE TABLE Students (
  id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  firstName text NOT NULL,
  lastName text NOT NULL,
  email text NOT NULL
);
INSERT INTO Students (firstName, lastName, email) VALUES ('Ola', 'Jensen', 'ola.jensen@ntnu.no');
INSERT INTO Students (firstName, lastName, email) VALUES ('Kari', 'Larsen', 'kari.larsen@ntnu.no');
```

Then, add your own username and password in `server/src/server.js`.

Finally, from the top-level repository folder:
```sh
cd server
npm install
npm test
npm start
```

## Open application
http://localhost:3000
