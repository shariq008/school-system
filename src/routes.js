const express = require('express');
const router = express.Router();
const { Student, Teacher, Fee, Class } = require('./models');

// Create a student
router.post('/students', async (req, res) => {
    const { name, age, class: studentClass } = req.body;
    const student = new Student({ name, age, class: studentClass });
    await student.save();
    res.status(201).json(student);
});

// Get all students
router.get('/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// Create a teacher
router.post('/teachers', async (req, res) => {
    const { name, subject } = req.body;
    const teacher = new Teacher({ name, subject });
    await teacher.save();
    res.status(201).json(teacher);
});

// Get all teachers
router.get('/teachers', async (req, res) => {
    const teachers = await Teacher.find();
    res.json(teachers);
});

// Create a fee
router.post('/fees', async (req, res) => {
    const { studentId, amount } = req.body;
    const fee = new Fee({ studentId, amount });
    await fee.save();
    res.status(201).json(fee);
});

// Get all fees
router.get('/fees', async (req, res) => {
    const fees = await Fee.find().populate('studentId');
    res.json(fees);
});

// Create a class
router.post('/classes', async (req, res) => {
    const { name, teacherId, students } = req.body;

    // Check for required fields
    if (!name || !teacherId) {
        return res.status(400).json({ error: 'Name and teacherId are required' });
    }

    try {
        // Create and save class
        const classObj = new Class({ name, teacherId, students });
        await classObj.save();
        res.status(201).json(classObj);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all classes
router.get('/classes', async (req, res) => {
    try {
        const classes = await Class.find().populate('students').populate('teacherId');
        res.json(classes);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
module.exports = router;
