let mysql = require("mysql");

const JobDao = require("./jobDao.js");
const MessageDao = require("./messageDao.js");
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
    runSqlFile("./create_tables.sql", pool, () => {
        runSqlFile("./create_testData.sql", pool, done);
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
/*
test("get unknown person from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.length).toBe(0);
        done();
    }

    personDao.getOne(0, callback);
});

test("add person to db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }

    personDao.createOne(
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

    personDao.getAll(callback);
});*/
