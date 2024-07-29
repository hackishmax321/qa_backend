// models/student.model.js
const firebase = require('../configs/db');
const firestore = firebase.firestore();

class Student {
  constructor(id, email, password, firstName, lastName, universityId, placeholder, approved = true) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.universityId = universityId;
    this.placeholder = placeholder;
    this.approved = approved;
  }
}

const studentCollection = firestore.collection("students");

module.exports = { Student, studentCollection };
