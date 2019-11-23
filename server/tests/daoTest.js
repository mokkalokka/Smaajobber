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


beforeAll(done => {
    runSqlFile("../tests/create_tables.sql", pool, () => {
        runSqlFile("../tests/create_testData.sql", pool, done);
    });
});

afterAll(() => {
    pool.end();
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
        expect(data.length).toBe(0);
        done();
    }

    jobDao.getJobs( callback);
});

test("add job", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }

    jobDao.postJob(
        { navn: "Nils Nilsen", alder: 34, adresse: "Gata 3" },
        callback
    );
});

test("get all persons from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data.length=" + data.length
        );
        expect(data.length).toBeGreaterThanOrEqual(2);
        done();
    }

    jobDao.getAll(callback);
});
