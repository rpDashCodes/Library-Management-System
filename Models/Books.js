import mongoose from "mongoose";

const booksSchema = new mongoose.Schema({
    bookId:{type:String,required:true,unique:true},
    totalCopies:{type:Number,required:true},
    availableCopies:{type:Number,required:true},
    name:{type:String,required:true,unique:true},
    author:String,
    category:{type:[String],required:true}
},{collection:"books"});

const issuedBooksSchema = new mongoose.Schema({
    bookId:{type:String,required:true},
    issueId:{type:String,required:true,unique:true},
    issueDate:{type:String,required:true},
    returnBy:{type:String,required:true},
    isReturned:Boolean,
    returnDate:String,
    memberId:String,
    isApproved:Boolean
},{collection:"issuedBooks"});

const Books = mongoose.model('Books',booksSchema);
const IssuedBooks = mongoose.model('IssuedBooks',issuedBooksSchema);

export {Books,IssuedBooks};