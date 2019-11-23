let mysql = require("mysql");

const JobDao = require("../src/jobDao.js");
const MessageDao = require("../src/messageDao.js");
const runSqlFile = require("./runSqlFile.js");


// GitLab CI Pool
let pool = mysql.createPool({
    connectionLimit: 1,
    host: "mysql",
    user: "root",
    password: "secret",
    database: "supertestdb",
    debug: false,
    multipleStatements: true
});

let jobDao = new JobDao(pool);
let messageDao = new MessageDao(pool);

class Message {
    id: number;
    job_id: number;
    alias: string;
    content: string;
    dateTime: string;


    constructor(job_id: number, alias: string, content: string) {
        this.job_id = job_id;
        this.alias = alias;
        this.content = content;
    }
}

class Job {
    id: number;
    title: string;
    content: string;
    dateTime: string;
    imageUrl: string;
    category: string;
    alias: string;
    importance: number;

    constructor(id: number, title: string, content: string, dateTime: string, imageUrl: string, category: string, alias: string, importance: number) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.dateTime = dateTime;
        this.imageUrl = imageUrl;
        this.category = category;
        this.alias = alias;
        this.importance = importance;
    }
}

beforeAll(done => {
    runSqlFile("tests/create_tables.sql", pool, () => {
        runSqlFile("tests/create_testData.sql", pool, done);
    });
});

afterAll(() => {
    pool.end();
});

test("post message", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.length).toBe(0);
        done();
    }

    let message = new Message(0,"Test","test");

    messageDao.postMessage(message, callback);
});

test("get messages from job 1", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.length).toBe(1);
        done();
    }

    messageDao.getMessages(0, callback);
});


test("get one job from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.length).toBe(1);
        expect(data[0].alias).toBe("Anders");
        done();
    }

    jobDao.getJob(1, callback);
});

test("get jobs", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.length).toBe(2);
        done();
    }

    jobDao.getJobs(callback);
});

test("delete job", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data.length=" + data.length
        );
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }

    jobDao.deleteJob(1,callback);
});

test("add job", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }

    let job = new Job(1,'Trenger noen til å måke snø på taket!',
        'Betaling etter avtale',
        'https://vkmagasinet.no/wp-content/uploads/2015/12/h%C3%A5ndm%C3%A5king-bilde.jpg',
        'diverse',
        'Kari',
        '2019-30-2 08:16',
        2);

    jobDao.postJob(job, callback);
});

test("update job", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }

    let job = new Job(0,'Trenger noen til å måke snø på taket!',
        'Endret',
        'https://vkmagasinet.no/wp-content/uploads/2015/12/h%C3%A5ndm%C3%A5king-bilde.jpg',
        'diverse',
        'Gunnar',
        '2019-30-2 08:16',
        2);

    jobDao.updateJob(job, callback);
});





