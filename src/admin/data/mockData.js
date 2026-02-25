// src/admin/data/mockData.js

// Initial mock data
const initialUsers = [
  // Students (7 students)
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@student.school360.com',
    role: 'student',
    class: 'Class 10-A',
    phone: '+91 98765 43210',
    status: 'active',
    joinDate: '2024-01-15',
    avatar: 'https://i.pravatar.cc/100?img=1'
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.patel@student.school360.com',
    role: 'student',
    class: 'Class 10-B',
    phone: '+91 98765 43211',
    status: 'active',
    joinDate: '2024-01-15',
    avatar: 'https://i.pravatar.cc/100?img=5'
  },
  {
    id: 3,
    name: 'Amit Kumar',
    email: 'amit.kumar@student.school360.com',
    role: 'student',
    class: 'Class 9-A',
    phone: '+91 98765 43212',
    status: 'inactive',
    joinDate: '2024-02-01',
    avatar: 'https://i.pravatar.cc/100?img=12'
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    email: 'sneha.reddy@student.school360.com',
    role: 'student',
    class: 'Class 11-A',
    phone: '+91 98765 43213',
    status: 'active',
    joinDate: '2024-01-20',
    avatar: 'https://i.pravatar.cc/100?img=9'
  },
  {
    id: 11,
    name: 'Anjali Mehta',
    email: 'anjali.mehta@student.school360.com',
    role: 'student',
    class: 'Class 12-A',
    phone: '+91 98765 43220',
    status: 'active',
    joinDate: '2024-01-10',
    avatar: 'https://i.pravatar.cc/100?img=45'
  },
  {
    id: 12,
    name: 'Karan Desai',
    email: 'karan.desai@student.school360.com',
    role: 'student',
    class: 'Class 8-B',
    phone: '+91 98765 43221',
    status: 'active',
    joinDate: '2024-01-25',
    avatar: 'https://i.pravatar.cc/100?img=3'
  },
  {
    id: 13,
    name: 'Deepika Singh',
    email: 'deepika.singh@student.school360.com',
    role: 'student',
    class: 'Class 9-B',
    phone: '+91 98765 43222',
    status: 'active',
    joinDate: '2024-02-05',
    avatar: 'https://i.pravatar.cc/100?img=10'
  },
  
  // Teachers (3 teachers)
  {
    id: 5,
    name: 'Dr. Rajesh Verma',
    email: 'rajesh.verma@teacher.school360.com',
    role: 'teacher',
    subject: 'Mathematics',
    phone: '+91 98765 43214',
    status: 'active',
    joinDate: '2023-06-10',
    avatar: 'https://i.pravatar.cc/100?img=33'
  },
  {
    id: 6,
    name: 'Mrs. Anita Singh',
    email: 'anita.singh@teacher.school360.com',
    role: 'teacher',
    subject: 'English',
    phone: '+91 98765 43215',
    status: 'active',
    joinDate: '2023-07-15',
    avatar: 'https://i.pravatar.cc/100?img=47'
  },
  {
    id: 7,
    name: 'Mr. Suresh Gupta',
    email: 'suresh.gupta@teacher.school360.com',
    role: 'teacher',
    subject: 'Science',
    phone: '+91 98765 43216',
    status: 'active',
    joinDate: '2023-08-01',
    avatar: 'https://i.pravatar.cc/100?img=15'
  },
  
  // Staff (3 staff)
  {
    id: 8,
    name: 'Vijay Menon',
    email: 'vijay.menon@staff.school360.com',
    role: 'staff',
    department: 'Administration',
    phone: '+91 98765 43217',
    status: 'active',
    joinDate: '2023-05-10',
    avatar: 'https://i.pravatar.cc/100?img=8'
  },
  {
    id: 9,
    name: 'Kavita Joshi',
    email: 'kavita.joshi@staff.school360.com',
    role: 'staff',
    department: 'Library',
    phone: '+91 98765 43218',
    status: 'active',
    joinDate: '2023-06-20',
    avatar: 'https://i.pravatar.cc/100?img=20'
  },
  {
    id: 10,
    name: 'Ramesh Nair',
    email: 'ramesh.nair@staff.school360.com',
    role: 'staff',
    department: 'Maintenance',
    phone: '+91 98765 43219',
    status: 'inactive',
    joinDate: '2023-04-15',
    avatar: 'https://i.pravatar.cc/100?img=11'
  },
];

// Initialize localStorage with initial data if not exists
const initializeStorage = () => {
  if (!localStorage.getItem('school360_users')) {
    localStorage.setItem('school360_users', JSON.stringify(initialUsers));
  }
};

// Get users from localStorage
export const getUsers = () => {
  initializeStorage();
  const users = localStorage.getItem('school360_users');
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
export const saveUsers = (users) => {
  localStorage.setItem('school360_users', JSON.stringify(users));
};

// Add new user
export const addUser = (user) => {
  const users = getUsers();
  const newUser = {
    ...user,
    id: Date.now(),
    joinDate: new Date().toISOString().split('T')[0],
    avatar: user.avatar || `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 50)}`
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

// Update user
export const updateUser = (updatedUser) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsers(users);
  }
  return updatedUser;
};

// Delete user
export const deleteUser = (userId) => {
  const users = getUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  saveUsers(filteredUsers);
  return true;
};

// Get user by ID
export const getUserById = (id) => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

// Get users by role
export const getUsersByRole = (role) => {
  const users = getUsers();
  return users.filter(user => user.role === role);
};

// Get active users
export const getActiveUsers = () => {
  const users = getUsers();
  return users.filter(user => user.status === 'active');
};

// Get user stats
export const getUserStats = () => {
  const users = getUsers();
  const students = users.filter(u => u.role === 'student');
  const teachers = users.filter(u => u.role === 'teacher');
  const staff = users.filter(u => u.role === 'staff');
  const active = users.filter(u => u.status === 'active');
  
  return {
    students: students.length,
    teachers: teachers.length,
    staff: staff.length,
    active: active.length,
    total: users.length
  };
};

// Reset to initial data (useful for testing)
export const resetData = () => {
  localStorage.setItem('school360_users', JSON.stringify(initialUsers));
  return initialUsers;
};

// Export mockUsers for backward compatibility
export const mockUsers = getUsers();