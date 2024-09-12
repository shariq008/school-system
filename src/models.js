const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/school-system', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('MongoDB connected');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    class: String
});

const teacherSchema = new mongoose.Schema({
    name: String,
    subject: String
});

const feeSchema = new mongoose.Schema({
    studentId: mongoose.Schema.Types.ObjectId,
    amount: Number
});

const classSchema = new mongoose.Schema({
    name: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

// Create models
const Student = mongoose.model('Student', studentSchema);
const Teacher = mongoose.model('Teacher', teacherSchema);
const Fee = mongoose.model('Fee', feeSchema);
const Class = mongoose.model('Class', classSchema);

module.exports = { Student, Teacher, Fee, Class };