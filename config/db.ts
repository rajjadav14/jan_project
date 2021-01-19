import mongoose from 'mongoose';
 import  config from 'config';
 const db:string = config.get('mongoURI');
  const connectDB = async()=>{
     try {
         await mongoose.connect(db,{
             useNewUrlParser:true,
             useUnifiedTopology: true,
         });
         console.log("database connected.")
     } catch (err) {
         console.error(err.msg);
         process.exit(1);
     }
 }
 export default connectDB