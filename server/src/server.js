import app from './app.js';
import connectDB from './config/db.js';

const port = process.env.PORT || 8080;
connectDB();

const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();
