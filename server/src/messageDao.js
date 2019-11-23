const Dao = require("./dao.js");

class Message {
    id: number;
    job_id: number;
    alias: string;
    content: string;
    dateTime: string;
}

module.exports = class MessageDao extends Dao {

    getMessages(id: Number, callback){
        super.query('select * from message where job_id=?', [id], callback);
    }

    postMessage(message: Message, callback){
        super.query('insert into message(job_id, alias, content, dateTime) ' +
            'values (?, ?, ?, NOW())',
            [message.job_id, message.alias, message.content, message.dateTime], callback)
    }
};