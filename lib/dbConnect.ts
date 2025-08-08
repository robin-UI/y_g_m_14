import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log('Already connected to the database');
    return;
  }

  try {
    // Attempt to connect to the database 
    // mongodb+srv://Robin:DXd7RG4HYK0r8I88@cluster0.rediqjw.mongodb.net/Y_G_M?retryWrites=true&w=majority&appName=Cluster0
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
    // const db = await mongoose.connect('mongodb+srv://Robin:uUcadUotK6LI3Q1G@cluster0.rediqjw.mongodb.net/Y_G_M?retryWrites=true&w=majority&appName=Cluster0', {});

    connection.isConnected = db.connections[0].readyState;

    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);

    // Graceful exit in case of a connection error
    process.exit(1);
  }
}

export default dbConnect;
