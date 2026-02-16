/**
 * OpenAPI 3.0 spec for Milk App backend.
 * Served at /api-docs
 */
const PORT = process.env.PORT || 5000;

const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Milk App API',
    description: 'Backend API for Milk App – customers, vendors, subscriptions, and transactions.',
    version: '1.0.0',
  },
  servers: [
    { url: `http://localhost:${PORT}/api`, description: 'Local' },
    { url: '/api', description: 'Relative (same host)' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT from POST /login (token field in response)',
      },
    },
    schemas: {
      ApiSuccess: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          status: { type: 'integer', example: 200 },
          message: { type: 'string' },
          data: { type: 'object', nullable: true },
        },
      },
      ApiError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          status: { type: 'integer' },
          error: { type: 'string' },
          details: { type: 'object', nullable: true },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Registration, login, password reset' },
    { name: 'Customer', description: 'Customer profile, topup, withdraw' },
    { name: 'Vendor', description: 'Vendor profile, inventory, reports' },
    { name: 'Vendors (list)', description: 'List vendors (any authenticated user)' },
    { name: 'Subscription', description: 'Subscribe, list, update, cancel' },
    { name: 'Transaction', description: 'Buy, balance, transactions, delivery' },
    { name: 'Admin', description: 'User and data management (admin only)' },
  ],
  paths: {
    '/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'phone', 'email', 'password', 'role'],
                properties: {
                  name: { type: 'string', minLength: 2, maxLength: 50 },
                  phone: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  role: { type: 'string', enum: ['customer', 'vendor'] },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Registration successful' }, 400: { description: 'Validation error' } },
      },
    },
    '/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['identifier', 'password', 'role'],
                properties: {
                  identifier: { type: 'string', description: 'Email or phone' },
                  password: { type: 'string' },
                  role: { type: 'string', enum: ['customer', 'vendor', 'admin'] },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Login successful; returns token and user' }, 401: { description: 'Invalid credentials' } },
      },
    },
    '/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Forgot password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'role'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  role: { type: 'string', enum: ['customer', 'vendor'] },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Reset token generated' }, 500: { description: 'Error' } },
      },
    },
    '/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'newPassword', 'role'],
                properties: {
                  token: { type: 'string' },
                  newPassword: { type: 'string', minLength: 6 },
                  role: { type: 'string', enum: ['customer', 'vendor'] },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Password reset successful' }, 500: { description: 'Error' } },
      },
    },
    '/customer/me': {
      get: {
        tags: ['Customer'],
        summary: 'Get customer profile',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Profile fetched' }, 403: { description: 'Not a customer' } },
      },
    },
    '/customer/topup': {
      post: {
        tags: ['Customer'],
        summary: 'Top up wallet',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['amount'],
                properties: { amount: { type: 'number', minimum: 10, maximum: 50000 } },
              },
            },
          },
        },
        responses: { 200: { description: 'Topup successful' }, 403: { description: 'Not a customer' } },
      },
    },
    '/customer/profile': {
      put: {
        tags: ['Customer'],
        summary: 'Update customer profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 2, maxLength: 50 },
                  phone: { type: 'string' },
                  password: { type: 'string', minLength: 6 },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Profile updated' }, 403: { description: 'Not a customer' } },
      },
    },
    '/customer/withdraw': {
      post: {
        tags: ['Customer'],
        summary: 'Withdraw from wallet',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['amount'],
                properties: { amount: { type: 'number', minimum: 10 } },
              },
            },
          },
        },
        responses: { 200: { description: 'Withdrawal successful' }, 403: { description: 'Not a customer' } },
      },
    },
    '/vendor/me': {
      get: {
        tags: ['Vendor'],
        summary: 'Get vendor profile',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Vendor data fetched' }, 403: { description: 'Not a vendor' } },
      },
    },
    '/vendor/update': {
      put: {
        tags: ['Vendor'],
        summary: 'Update vendor (rate, add/remove milk)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  rate: { type: 'number', minimum: 20, maximum: 200 },
                  addMilk: { type: 'number', minimum: 0 },
                  removeMilk: { type: 'number', minimum: 0 },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Vendor updated' }, 403: { description: 'Not a vendor' } },
      },
    },
    '/vendor/process-subscriptions': {
      post: {
        tags: ['Vendor'],
        summary: 'Process pending subscriptions',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Processed count and remaining milk' }, 403: { description: 'Not a vendor' } },
      },
    },
    '/vendor/inventory-history': {
      get: {
        tags: ['Vendor'],
        summary: 'Get inventory history',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Inventory history' }, 403: { description: 'Not a vendor' } },
      },
    },
    '/vendor/reports': {
      get: {
        tags: ['Vendor'],
        summary: 'Get vendor reports',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Reports' }, 403: { description: 'Not a vendor' } },
      },
    },
    '/vendor/profile': {
      put: {
        tags: ['Vendor'],
        summary: 'Update vendor profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  phone: { type: 'string' },
                  password: { type: 'string', minLength: 6 },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Profile updated' }, 403: { description: 'Not a vendor' } },
      },
    },
    '/vendor/toggle-availability': {
      put: {
        tags: ['Vendor'],
        summary: 'Toggle availability (active/holiday)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Availability updated' }, 403: { description: 'Not a vendor' } },
      },
    },
    '/vendors': {
      get: {
        tags: ['Vendors (list)'],
        summary: 'List all vendors',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Vendors list' } },
      },
    },
    '/subscribe': {
      post: {
        tags: ['Subscription'],
        summary: 'Create subscription',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['vendorId', 'quantity', 'duration'],
                properties: {
                  vendorId: { type: 'integer' },
                  quantity: { type: 'number', minimum: 0.1, maximum: 50 },
                  duration: { type: 'string', enum: ['7_days', '1_month', '3_months'] },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Subscribed successfully' }, 403: { description: 'Only customers' } },
      },
    },
    '/subscriptions': {
      get: {
        tags: ['Subscription'],
        summary: 'Get my subscriptions',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Subscriptions list' } },
      },
      put: {
        tags: ['Subscription'],
        summary: 'Update subscription',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } },
        responses: { 200: { description: 'Subscription updated' } },
      },
    },
    '/subscriptions/{id}/toggle': {
      put: {
        tags: ['Subscription'],
        summary: 'Toggle subscription status',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Status toggled' } },
      },
    },
    '/subscriptions/{id}/cancel': {
      put: {
        tags: ['Subscription'],
        summary: 'Cancel subscription',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Subscription cancelled' } },
      },
    },
    '/subscriptions/{id}': {
      delete: {
        tags: ['Subscription'],
        summary: 'Delete subscription',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Subscription deleted' } },
      },
    },
    '/buy': {
      post: {
        tags: ['Transaction'],
        summary: 'Buy milk (one-time)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['vendorId', 'quantity'],
                properties: {
                  vendorId: { type: 'integer' },
                  quantity: { type: 'number', minimum: 0.1, maximum: 100 },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Purchase successful' }, 403: { description: 'Only customers' } },
      },
    },
    '/transactions': {
      get: {
        tags: ['Transaction'],
        summary: 'Get transactions',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'paginate', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } },
        ],
        responses: { 200: { description: 'Transactions list' } },
      },
    },
    '/transactions/{id}/verify': {
      put: {
        tags: ['Transaction'],
        summary: 'Verify delivery (customer)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { status: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Delivery verified' } },
      },
    },
    '/transactions/{id}/delivery': {
      put: {
        tags: ['Transaction'],
        summary: 'Update delivery status (vendor)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { status: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Delivery updated' }, 403: { description: 'Only vendors' } },
      },
    },
    '/transactions/{id}/pay': {
      put: {
        tags: ['Transaction'],
        summary: 'Mark transaction as paid (customer)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Payment successful' }, 403: { description: 'Only customers' } },
      },
    },
    '/balance': {
      get: {
        tags: ['Transaction'],
        summary: 'Get balance',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Balance' } },
      },
    },
    '/admin/customers': {
      get: {
        tags: ['Admin'],
        summary: 'List all customers',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Customers list' }, 403: { description: 'Admin only' } },
      },
    },
    '/admin/vendors': {
      get: {
        tags: ['Admin'],
        summary: 'List all vendors',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Vendors list' }, 403: { description: 'Admin only' } },
      },
    },
    '/admin/transactions': {
      get: {
        tags: ['Admin'],
        summary: 'List all transactions',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Transactions list' }, 403: { description: 'Admin only' } },
      },
    },
    '/admin/subscriptions': {
      get: {
        tags: ['Admin'],
        summary: 'List all subscriptions',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Subscriptions list' }, 403: { description: 'Admin only' } },
      },
    },
    '/admin/user/{role}/{id}': {
      put: {
        tags: ['Admin'],
        summary: 'Update user',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'role', in: 'path', required: true, schema: { type: 'string', enum: ['customer', 'vendor'] } },
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                  rate: { type: 'number', description: 'Vendor only' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'User updated' }, 404: { description: 'User not found' } },
      },
      delete: {
        tags: ['Admin'],
        summary: 'Delete user',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'role', in: 'path', required: true, schema: { type: 'string', enum: ['customer', 'vendor'] } },
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: { 200: { description: 'User deleted' }, 404: { description: 'User not found' } },
      },
    },
    '/admin/user/{role}/{id}/reset-password': {
      post: {
        tags: ['Admin'],
        summary: 'Trigger password reset for user',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'role', in: 'path', required: true, schema: { type: 'string', enum: ['customer', 'vendor'] } },
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: { 200: { description: 'Reset link generated' }, 404: { description: 'User not found' } },
      },
    },
  }
  }
};

module.exports = openApiSpec;
