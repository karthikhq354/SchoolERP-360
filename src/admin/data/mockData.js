// src/admin/data/mockData.js
export const mockUsers = [
  // Students
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
  
  // Teachers
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
  
  // Staff
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
  
  // More students
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
];

export const getUsers = () => {
  return mockUsers;
};

export const getUserById = (id) => {
  return mockUsers.find(user => user.id === id);
};

export const getUsersByRole = (role) => {
  return mockUsers.filter(user => user.role === role);
};