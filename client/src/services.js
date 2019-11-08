// @flow
import axios from 'axios';

export class Job{
  id: number;
  title: string;
  content: string;
  dateTime: string;
  imageUrl: string;
  category: string;
  alias: string;
  importance: number;
  ratings: Array<number>;

  getRating(){
    if (this.ratings.length > 0){
      return this.ratings.reduce((sum, e) =>(sum + e)) / this.ratings.length
    }
    else return 0;
  }

}

export class Message {
  id: number;
  job_id: number;
  alias: string;
  content: string;
  dateTime: string;
}

class JobService {
  getJobs() {
    return axios.get<Job[]>('/jobs').then(response => response.data);
  }

  getCategory(category: string) {
    return axios.get<Job[]>('/category/' + category).then(response => response.data);
  }

  getJob(id: number) {
    return axios.get<Job>('/Jobs/' + id).then(response => response.data);
  }

  updateJob(job: Job) {
    return axios.put<Job, void>('/jobs', job).then(response => response.data);
  }

  postJob(job: Job) {
    return axios.post<Job, void>('/jobs', job).then(response => response.data);
  }

  deleteJob(job: Job) {
    return axios.delete<Job, void>('/jobs/' + job.id).then(response => response.data);
  }

  //3 siste jobber
  getNewestJobs(){
    return axios.get<Job[]>('/livefeed/' + 3).then(response => response.data);
  }

  searchJobs(keyword: string){
    return axios.get<Job[]>('/search/' + keyword).then(response => response.data);
  }

}
export let jobService = new JobService();

class MessageService {
  getMessages(job_id: number) {
    //console.log(job_id);
    return axios.get<Message[]>('/messages/' + job_id).then(response => response.data);
  }

  postMessage(message: Message) {
    return axios.post<Message, void>('/jobs/' + message.job_id + '/messages/' , message).then(response => response.data);
  }
}
export let messageService = new MessageService();

