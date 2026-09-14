import crypto from 'crypto';
import User from '../models/User.js';
import { sendVerificationEmail } from '../services/emailService.js';

// @desc   Get all students/users
// @route  GET /api/admin/students
// @access Private/Admin
export const getAllStudents = async (req, res) => {
  try {
    // Only fetch non-admin users
    const students = await User.find({ role: { $ne: 'admin' } })
      .select('-password -resetPasswordToken')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create a student account (Admin)
// @route  POST /api/admin/students
// @access Private/Admin
export const createStudent = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: cleanEmail });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create account relying on existing Mongoose pre-save hook for password hashing
    const student = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      phone,
      address,
      role: 'user', // Explicitly prevent admin creation
      isVerified: false,
      isActive: true,
      verificationToken
    });

    await sendVerificationEmail(student.email, verificationToken);
    
    // Provide fallback URL for development testing
    const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;

    res.status(201).json({
      success: true,
      message: 'Student account created successfully. Verification email dispatched.',
      verifyUrl, 
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        isVerified: student.isVerified,
        isActive: student.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update student active status
// @route  PATCH /api/admin/students/:id/status
// @access Private/Admin
export const updateStudentStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    if (student.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Security Alert: Cannot modify administrative accounts.' });
    }

    student.isActive = isActive;
    await student.save();

    res.status(200).json({
      success: true,
      message: `Student account ${isActive ? 'activated' : 'suspended'} successfully.`,
      data: {
        id: student._id,
        name: student.name,
        isActive: student.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};