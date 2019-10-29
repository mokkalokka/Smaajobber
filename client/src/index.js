// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { Alert, NavBar, Card, Row, Column, Button } from './widgets';
import { Student, studentService } from './services';

import { createHashHistory } from 'history';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component {
  render() {
    return (
      <NavBar brand="React example">
        <NavBar.Link to="/students">Students</NavBar.Link>
      </NavBar>
    );
  }
}

class Home extends Component {
  render() {
    return <Card title="React example"></Card>;
  }
}

class StudentList extends Component {
  students: Student[] = [];

  render() {
    return (
      <Card title="Students">
        {this.students.map(student => (
          <Row key={student.id}>
            <Column width={2}>
              <NavLink activeStyle={{ color: 'darkblue' }} exact to={'/students/' + student.id}>
                {student.firstName} {student.lastName}
              </NavLink>
            </Column>
            <Column>
              <NavLink activeStyle={{ color: 'darkblue' }} to={'/students/' + student.id + '/edit'}>
                edit
              </NavLink>
            </Column>
          </Row>
        ))}
      </Card>
    );
  }

  mounted() {
    studentService
      .getStudents()
      .then(students => (this.students = students))
      .catch((error: Error) => Alert.danger(error.message));
  }
}

class StudentDetails extends Component<{ match: { params: { id: number } } }> {
  student = null;

  render() {
    if (!this.student) return null;

    return (
      <Card title="Details">
        <Row>
          <Column width={2}>First name</Column>
          <Column>{this.student.firstName}</Column>
        </Row>
        <Row>
          <Column width={2}>Last name</Column>
          <Column>{this.student.lastName}</Column>
        </Row>
        <Row>
          <Column width={2}>Email</Column>
          <Column>{this.student.email}</Column>
        </Row>
      </Card>
    );
  }

  mounted() {
    studentService
      .getStudent(this.props.match.params.id)
      .then(student => (this.student = student))
      .catch((error: Error) => Alert.danger(error.message));
  }
}

class StudentEdit extends Component<{ match: { params: { id: number } } }> {
  student = null;

  render() {
    if (!this.student) return null;

    return (
      <Card title="Edit">
        <form>
          <Row>
            <Column width={2}>First name</Column>
            <Column>
              <input
                type="text"
                value={this.student.firstName}
                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                  if (this.student) this.student.firstName = event.target.value;
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>Last name</Column>
            <Column>
              <input
                type="text"
                value={this.student.lastName}
                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                  if (this.student) this.student.lastName = event.target.value;
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>Email</Column>
            <Column>
              <input
                type="text"
                value={this.student.email}
                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                  if (this.student) this.student.email = event.target.value;
                }}
              />
            </Column>
          </Row>
          <Button.Danger onClick={this.save}>Save</Button.Danger>
        </form>
      </Card>
    );
  }

  mounted() {
    studentService
      .getStudent(this.props.match.params.id)
      .then(student => (this.student = student))
      .catch((error: Error) => Alert.danger(error.message));
  }

  save() {
    if (!this.student) return null;

    studentService
      .updateStudent(this.student)
      .then(() => {
        let studentList = StudentList.instance();
        if (studentList) studentList.mounted(); // Update Studentlist-component
        if (this.student) history.push('/students/' + this.student.id);
      })
      .catch((error: Error) => Alert.danger(error.message));
  }
}

const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
        <Alert />
        <Menu />
        <Route exact path="/" component={Home} />
        <Route path="/students" component={StudentList} />
        <Route exact path="/students/:id" component={StudentDetails} />
        <Route exact path="/students/:id/edit" component={StudentEdit} />
      </div>
    </HashRouter>,
    root
  );
