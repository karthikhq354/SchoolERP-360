const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School ERP 360 REST API',
      version: '1.0.0',
      description: 'Complete backend API for School ERP 360 system',
      contact: {
        name: 'School 360 Support',
        email: 'support@school360.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['student', 'teacher', 'admin', 'staff', 'superadmin'] },
            phone: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive', 'suspended'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Student: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            studentId: { type: 'string' },
            rollNumber: { type: 'string' },
            class: { type: 'string' },
            section: { type: 'string' },
            academicYear: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Teacher: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            teacherId: { type: 'string' },
            subjects: { type: 'array', items: { type: 'string' } },
            department: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Attendance: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            student: { type: 'string' },
            date: { type: 'string', format: 'date' },
            status: { type: 'string', enum: ['present', 'absent', 'late', 'excused'] },
            class: { type: 'string' },
            subject: { type: 'string' },
            period: { type: 'integer' },
          },
        },
        Fees: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            student: { type: 'string' },
            feeType: { type: 'string' },
            amount: { type: 'number' },
            paidAmount: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'paid', 'overdue', 'waived', 'partial'] },
            dueDate: { type: 'string', format: 'date' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };