// @flow

import express from 'express';
import path from 'path';
import reload from 'reload';
import fs from 'fs';
import mysql from 'mysql';

let pool = mysql.createPool({
  host: 'mysql-ait.stud.idi.ntnu.no',
  user: 'username', // Replace "username" with your mysql-ait.stud.idi.ntnu.no username
  password: 'password', // Replae "password" with your mysql-ait.stud.idi.ntnu.no password
  database: 'username' // Replace "username" with your mysql-ait.stud.idi.ntnu.no username
});

class Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const public_path = path.join(__dirname, '/../../client/public');

let app = express();

app.use(express.static(public_path));
app.use(express.json()); // For parsing application/json

app.get('/students', (req: express$Request, res: express$Response) => {
  pool.query('select * from Students', (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500);
    }

    res.send(results);
  });
});

app.get('/students/:id', (req: express$Request, res: express$Response) => {
  pool.query('select * from Students where id=?', [req.params.id], (error, results: Student[]) => {
    if (error) {
      console.error(error);
      return res.status(500);
    }
    if (results.length == 0) return res.sendStatus(404); // No row found

    res.send(results[0]);
  });
});

app.put('/students', (req: { body: Student }, res: express$Response) => {
  pool.query(
    'update Students set firstName=?, lastName=?, email=? where id=?',
    [req.body.firstName, req.body.lastName, req.body.email, req.body.id],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500);
      }
      if (results.affectedRows == 0) return res.sendStatus(404); // No row updated

      res.sendStatus(200);
    }
  );
});

// The listen promise can be used to wait for the web server to start (for instance in your tests)
export let listen = new Promise<void>((resolve, reject) => {
  // Setup hot reload (refresh web page on client changes)
  reload(app).then(reloader => {
    app.listen(3000, (error: ?Error) => {
      if (error) reject(error.message);
      console.log('Express server started');
      // Start hot reload (refresh web page on client changes)
      reloader.reload(); // Reload application on server restart
      fs.watch(public_path, () => reloader.reload());
      resolve();
    });
  });
});
