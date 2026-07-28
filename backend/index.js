require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://192.168.97.100:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://192.168.97.100:5000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- SWAGGER ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./swagger/openapi.js'), {
  customCss: '.swagger-ui .topbar { display: none }',
}));

// --- ROUTES ---
app.use('/api', routes);

// --- SERVER START ---
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log(`✅ Connected to PostgreSQL on port ${process.env.DB_PORT || 5433}`);
    await sequelize.sync({ alter: true });
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server Status:`);
      console.log(`   🏠 Local:   http://localhost:${PORT}`);
      console.log(`   🌐 Network: http://192.168.97.100:${PORT}`);
      console.log(`   📚 Swagger: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ DB Connection Error:', error.message);
  }
}

startServer();