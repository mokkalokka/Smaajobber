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

const public_path = path.join(__dirname, '/../../client/public');
const JobDao = require("./jobDao.js");
const MessageDao = require("./messageDao.js");
let jobDao = new JobDao(pool);
let messageDao = new MessageDao(pool);

let app = express();

app.use(express.static(public_path));
app.use(express.json()); // For parsing application/json



//----------- JOB -----------//

app.get('/jobs', (req: express$Request, res: express$Response) => {
    jobDao.getJobs((status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get('/category/:category', (req: express$Request, res: express$Response) => {
    jobDao.getCategory(req.params.category, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get('/search/:keyword', (req: express$Request, res: express$Response) => {
    jobDao.getSearchResults(req.params.keyword, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get('/livefeed/:number', (req: express$Request, res: express$Response) => {
    jobDao.getLiveFeed((status, data) => {
        res.status(status);
        res.json(data);
    });

});

app.get('/jobs/:id', (req: express$Request, res: express$Response) => {
    jobDao.getJob(req.params.id, (status, data) => {
        console.log(data);
        res.status(status);
        res.json(data[0]);
    });
});

app.put('/jobs', (req: { body: Object }, res: express$Response) => {
    jobDao.updateJob(req.body,(status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.post('/jobs', (req: { body: Object }, res: express$Response) => {
    jobDao.postJob(req.body,(status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.delete('/jobs/:id', (req: express$Request, res: express$Response) => {
    jobDao.deleteJob(req.params.id,(status, data) => {
        res.status(status);
        res.json(data);
    });
});


//----------- MESSAGE -----------//

app.get('/messages/:id', (req: express$Request, res: express$Response) => {
    messageDao.getMessages(req.params.id,(status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.post('/jobs/:id/messages', (req: { body: Object }, res: express$Response) => {
    messageDao.postMessage(req.body,(status, data) => {
        res.status(status);
        res.json(data);
    });
});



/*
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
*/
