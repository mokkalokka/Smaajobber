const Dao = require('./dao.js');

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

module.exports = class JobDao extends Dao {
    getJobs(callback) {
        super.query('select * from job', [], callback);
    }

    getCategory(category: String, callback) {
        super.query('select * from job where category=?', [category], callback);
    }

    getSearchResults(keyword: String, callback) {
        super.query(
            'select * from job where title like ? or content like ? or alias like ?',
            [keyword, keyword, keyword],
            callback
        );
    }

    getLiveFeed(callback) {
        super.query('select * from job order by dateTime desc limit 3', [], callback);
    }

    getJob(id: Number, callback) {
        super.query('select * from job where id=?', [id], callback);
    }

    updateJob(job: Job, callback) {
        super.query(
            'update job set title=?, content=?, imageUrl=?, category=?, alias=?, importance=? where id=?',
            [job.title, job.content, job.imageUrl, job.category, job.alias, job.importance, job.id],
            callback
        );
    }

    postJob(job: Job, callback) {
        super.query(
            'insert into job(title, content, imageUrl, category, alias, importance, dateTime) ' +
                'values (?, ?, ?, ?, ?, ?, NOW())',
            [job.title, job.content, job.imageUrl, job.category, job.alias, job.importance],
            callback
        );
    }

    deleteJob(id: Number, callback) {
        super.query('DELETE FROM job WHERE id=?', [id], callback);
    }
};
