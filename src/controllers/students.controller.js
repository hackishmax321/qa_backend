// controllers/student.controller.js
const express = require('express');
const httpStatus = require('http-status');
const StudentService = require('../services/students.service');

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName, universityId, placeholder } = req.body;
  const student = { email, password, firstName, lastName, universityId, placeholder, approved: true };
  console.log(student)
  try {
    const newStudent = await StudentService.createStudent(student);
    res.status(httpStatus.CREATED).send(newStudent);
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await StudentService.login(email, password);
    res.status(httpStatus.OK).send(result);
  } catch (error) {
    console.error(error);
    res.status(httpStatus.UNAUTHORIZED).send({ message: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // await sendPasswordResetEmail(email);
    res.status(200).send({ message: 'Password reset link sent' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to send reset link' });
  }
});

router.get('/student/:email', async (req, res) => {
  const { email } = req.params;
  console.log(email)
  try {
    const student = await StudentService.getStudentByEmail(email);
    res.status(httpStatus.OK).send(student);
  } catch (error) {
    console.error(error);
    res.status(httpStatus.NOT_FOUND).send({ message: 'Student not found' });
  }
});

module.exports = router;
