import mongoose from "mongoose";

const booksSchema = new mongoose.Schema({
    bookId:{type:Number,required:true,unique:true},
    totalCopies:{type:Number,required:true},
    availableCopies:{type:Number,required:true},
    name:{type:String,required:true,unique:true},
    author:String,
    category:{type:[String],required:true}
},{collection:"books"});

const issuedBooksSchema = new mongoose.Schema({
    bookId:{type:Number,required:true},
    issueDate:{type:Date,required:true},
    returnBy:{type:Date,required:true},
    isReturned:Boolean,
    returnDate:Date,
    memberId:String,
    issueId:Number
},{collection:"issuedBooks"});

const Books = mongoose.model('Books',booksSchema);
const IssuedBooks = mongoose.model('IssuedBooks',issuedBooksSchema);

export {Books,IssuedBooks};