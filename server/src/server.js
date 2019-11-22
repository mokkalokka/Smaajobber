// @flow

import express from 'express';
import path from 'path';
import reload from 'reload';
import fs from 'fs';
import mysql from 'mysql';

let pool = mysql.createPool({
    host: 'mysql.stud.ntnu.no',
    user: 'michaesl_public',
    password: '0987654321',
    database: 'michaesl_smajobber',
    dateStrings: true
});

class Job {
    id: number;
    title: string;
    content: string;
    dateTime: string;
    imageUrl: string;
    category: string;
    alias: string;
    importance: number;
}

class Message {
    id: number;
    job_id: number;
    alias: string;
    content: string;
    dateTime: string;
}

const public_path = path.join(__dirname, '/../../client/public');

let app = express();



app.use(express.static(public_path));
app.use(express.json()); // For parsing application/json



app.get('/jobs', (req: express$Request, res: express$Response) => {
    pool.query('select * from job', (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500);
        }
        res.send(results);
    });
});

app.get('/category/:category', (req: express$Request, res: express$Response) => {
    pool.query('select * from job where category=?',[req.params.category], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500);
        }
        res.send(results);
    });
});

app.get('/search/:keyword', (req: express$Request, res: express$Response) => {
    pool.query('select * from job where title like ? or content like ? or alias like ?',[("%" + req.params.keyword + "%"), ("%" + req.params.keyword + "%"), ("%" + req.params.keyword + "%")], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500);
        }
        res.send(results);
    });
});


app.get('/livefeed/:number', (req: express$Request, res: express$Response) => {
    pool.query('select * from job order by dateTime desc limit 3',[req.params.category], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500);
        }
        res.send(results);
    });
});

app.get('/jobs/:id', (req: express$Request, res: express$Response) => {
    pool.query('select * from job where id=?', [req.params.id], (error, results: Job[]) => {
        if (error) {
            console.error(error);
            return res.status(500);
        }
        if (results.length == 0) return res.sendStatus(404); // No row found

        res.send(results[0]);
    });
});

app.get('/messages/:id', (req: express$Request, res: express$Response) => {
    pool.query('select * from message where job_id=?', [req.params.id], (error, results: Message[]) => {
        if (error) {
            console.error(error);
            return res.status(500);
        }
        //if (results.length == 0) return res.sendStatus(404); // No row found

        res.send(results);
    });
});


app.put('/jobs', (req: { body: Job }, res: express$Response) => {
    pool.query(
        'update job set title=?, content=?, imageUrl=?, category=?, alias=?, importance=? where id=?',
        [req.body.title, req.body.content, req.body.imageUrl, req.body.category, req.body.alias,req.body.importance, req.body.id],
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

app.post('/jobs', (req: { body: Job }, res: express$Response) => {
    pool.query(
        'insert into job(title, content, imageUrl, category, alias, importance, dateTime) ' +
        'values (?, ?, ?, ?, ?, ?, ?)',
        [req.body.title, req.body.content, req.body.imageUrl, req.body.category, req.body.alias, req.body.importance, new Date()],
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

app.post('/jobs/:id/messages', (req: { body: Message }, res: express$Response) => {
    pool.query(
        'insert into message(job_id, alias, content, dateTime) ' +
        'values (?, ?, ?, NOW())',
        [req.body.job_id, req.body.alias, req.body.content],
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

app.delete('/jobs/:id', (req: express$Request, res: express$Response) => {
    console.log(req.params.id);
    pool.query(
        'DELETE FROM job WHERE id=?',
        [req.params.id],
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
