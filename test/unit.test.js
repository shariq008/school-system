const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { Student, Teacher, Fee, Class } = require('../src/models');
const routes = require('../src/routes');

const app = express();
app.use(bodyParser.json());
app.use('/api', routes);

describe('School System API', () => {
    beforeAll(async () => {
        await Student.deleteMany({});
        await Teacher.deleteMany({});
        await Fee.deleteMany({});
        await Class.deleteMany({});
    });

    test('should create a student', async () => {
        const res = await request(app)
            .post('/api/students')
            .send({ name: 'John Doe', age: 15, class: '10A' })
            .expect(201);

        expect(res.body.name).toBe('John Doe');
        expect(res.body.age).toBe(15);
    });

    test('should get all students', async () => {
        await request(app).post('/api/students').send({ name: 'Jane Doe', age: 14, class: '9B' });

        const res = await request(app).get('/api/students').expect(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('should create a teacher', async () => {
        const res = await request(app)
            .post('/api/teachers')
            .send({ name: 'Mr. Smith', subject: 'Mathematics' })
            .expect(201);

        expect(res.body.name).toBe('Mr. Smith');
        expect(res.body.subject).toBe('Mathematics');
    });

    test('should create a fee', async () => {
        const student = await new Student({ name: 'Alice', age: 16, class: '11C' }).save();
        const res = await request(app)
            .post('/api/fees')
            .send({ studentId: student._id, amount: 500 })
            .expect(201);

        expect(res.body.amount).toBe(500);
    });

    test('should create a class', async () => {
        const teacher = await new Teacher({ name: 'Ms. Johnson', subject: 'Science' }).save();
        const student = await new Student({ name: 'Bob', age: 16, class: '11D' }).save();
        const res = await request(app)
            .post('/api/classes')
            .send({ name: 'Class 11D', teacherId: teacher._id, students: [student._id] })
            .expect(201);

        expect(res.body.name).toBe('Class 11D');
        expect(res.body.teacherId.toString()).toBe(teacher._id.toString());
        expect(res.body.students[0].toString()).toBe(student._id.toString());
    });

    test('should get all classes', async () => {
        await request(app).post('/api/classes').send({ name: 'Class 12A', teacherId: new Teacher()._id, students: [] });

        const res = await request(app).get('/api/classes').expect(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});
