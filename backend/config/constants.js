// config/constants.js - Application-wide constants

module.exports = {
  // User Roles
  ROLES: {
    SUPER_ADMIN: 'superadmin',
    ADMIN:       'admin',
    TEACHER:     'teacher',
    STUDENT:     'student',
    STAFF:       'staff',
  },

  // User Status
  STATUS: {
    ACTIVE:   'active',
    INACTIVE: 'inactive',
    SUSPENDED:'suspended',
  },

  // Attendance Status
  ATTENDANCE_STATUS: {
    PRESENT: 'present',
    ABSENT:  'absent',
    LATE:    'late',
    EXCUSED: 'excused',
  },

  // Fee Status
  FEE_STATUS: {
    PENDING:   'pending',
    PAID:      'paid',
    OVERDUE:   'overdue',
    WAIVED:    'waived',
    PARTIAL:   'partial',
  },

  // Fee Types
  FEE_TYPES: {
    TUITION:     'tuition',
    EXAM:        'exam',
    LIBRARY:     'library',
    SPORTS:      'sports',
    TRANSPORT:   'transport',
    HOSTEL:      'hostel',
    MISCELLANEOUS: 'miscellaneous',
  },

  // Pagination
  DEFAULT_PAGE:     1,
  DEFAULT_LIMIT:    10,
  MAX_LIMIT:        100,

  // Classes
  CLASSES: [
    'Class 1', 'Class 2', 'Class 3', 'Class 4',
    'Class 5', 'Class 6', 'Class 7', 'Class 8',
    'Class 9', 'Class 10', 'Class 11', 'Class 12',
  ],

  // Sections
  SECTIONS: ['A', 'B', 'C', 'D', 'E'],

  // Subjects
  SUBJECTS: [
    'Mathematics', 'Science', 'English', 'Hindi',
    'Social Studies', 'Computer Science', 'Physics',
    'Chemistry', 'Biology', 'History', 'Geography',
    'Economics', 'Physical Education', 'Art',
  ],

  // Days of Week
  DAYS: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};