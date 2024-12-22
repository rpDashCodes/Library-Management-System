import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    adminId:{type:String,},
    password:{type:String,required:true},
    firstName:{type:String,required:true},
    lastName:String
});
export default mongoose.model("Admin",adminSchema,"admin");