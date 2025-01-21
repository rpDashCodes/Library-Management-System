import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    rollNo:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    firstName:{type:String,required:true},
    lastName:String,
    dateOfBirth:{type:Date},
    email:{type:String,required:true},
    gender:String,
    isApproved:{type:Boolean,default:false},
    isBlocked:{type:Boolean,default:false}
},{collection: 'members' });
export default  mongoose.model('User', userSchema);