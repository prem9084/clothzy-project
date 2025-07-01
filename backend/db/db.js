import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
      const db = await mongoose.connect(process.env.MONGODB_URI );
        console.log(`MongoDB connected successfully at ${db.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    }
}