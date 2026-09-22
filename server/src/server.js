import './config/ipv4First.js';
import env from './config/env.js';
import connectDb from './config/db.js';
import app from './app.js';

async function start() {
  try {
    await connectDb();
    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();
