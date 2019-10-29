// @flow
import axios from 'axios';

export class Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

class StudentService {
  getStudents() {
    return axios.get<Student[]>('/students').then(response => response.data);
  }

  getStudent(id: number) {
    return axios.get<Student>('/students/' + id).then(response => response.data);
  }

  updateStudent(student: Student) {
    return axios.put<Student, void>('/students', student).then(response => response.data);
  }
}
export let studentService = new StudentService();
