import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}

let cachedConnection: Connection | null = null;

export async function connectDB() {
  if (cachedConnection) {
    console.log('Using cached db connection');
    return cachedConnection;
  }

  try {
    const cnx = await mongoose.connect(MONGODB_URI);
    cachedConnection = cnx.connection;
    console.log('New mongodb connection established');
    return cachedConnection;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
