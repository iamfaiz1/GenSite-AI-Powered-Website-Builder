import mongoose from "mongoose";

const connectDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL, {
        dbName: "GenSite"   // FORCE THIS
        });
        //console.log('Database Connected', mongoose.connection.name);
    } catch(error){
        //console.error('Error DB:', error.message);
    }

}
export default connectDb;
