// services/student.service.js
const { Student, studentCollection } = require('../models/student.model');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "jwt_secret";

class StudentService {
  async createStudent(student) {
    const encryptedPassword = CryptoJS.AES.encrypt(student.password, SECRET_KEY).toString();
    const newStudent = {
      email: student.email,
      password: encryptedPassword,
      firstName: student.firstName,
      lastName: student.lastName,
      universityId: student.universityId,
      placeholder: student.placeholder,
      approved: student.approved
    };
    const studentRef = await studentCollection.add(newStudent);
    return { id: studentRef.id, ...newStudent };
  }

  async login(email, password) {
    const querySnapshot = await studentCollection.where("email", "==", email).get();
    if (querySnapshot.empty) {
      throw new Error("Invalid email or password");
    }

    const studentDoc = querySnapshot.docs[0];
    const studentData = studentDoc.data();
    const decryptedPassword = CryptoJS.AES.decrypt(studentData.password, SECRET_KEY).toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== password) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign({ id: studentDoc.id, email: studentData.email }, SECRET_KEY, { expiresIn: '1h' });
    return { token, student: { id: studentDoc.id, email: studentData.email, firstName: studentData.firstName, lastName: studentData.lastName, universityId: studentData.universityId, placeholder: studentData.placeholder, approved: studentData.approved } };
  }

  async getStudentByEmail(email) {
    const querySnapshot = await studentCollection.where("email", "==", email).get();
    if (querySnapshot.empty) {
      throw new Error("Student not found");
    }

    const studentDoc = querySnapshot.docs[0];
    const studentData = studentDoc.data();
    const { password, ...studentWithoutPassword } = studentData;

    return { id: studentDoc.id, ...studentWithoutPassword };
  }
}

module.exports = new StudentService();
