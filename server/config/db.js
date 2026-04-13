import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL, {
        dbName: "GenSite"   // FORCE THIS
        });
        console.log('Database Connected', mongoose.connection.name);
    } catch(error){
        console.log('Error DB:', error);
    }

}
export default connectDb;
