import Admin from "../Models/Admin.js";
import { Books, IssuedBooks } from "../Models/Books.js";
import User from "../Models/User.js";
import Counter from "../Models/Counter.js";

import { nameRefactor } from "./utility.js";
import path from 'path';

import { __dirName } from "../server.js";


async function getAdminDashboard(req, res) {
    try {

        const admin = await Admin.findOne({ adminId: req.session.user.userId });
        const adminName = admin.firstName;
        const numberOfBooks = await Books.aggregate([
            { $group: { _id: null, total: { $sum: "$totalCopies" } } },
        ]);
        const totalBooks = numberOfBooks[0]?.total || 0;
        const numberOfAvailableBooks = await Books.aggregate([
            { $group: { _id: null, total: { $sum: "$availableCopies" } } },
        ]);
        const totalAvailableBooks = numberOfAvailableBooks[0]?.total || 0;

        const issuedBooksCount = await IssuedBooks.countDocuments();
        const memberCount = await User.countDocuments({ isApproved: true });
        const requestCount = await User.countDocuments({ isApproved: false });

        res.render("adminDashboard", {
            adminName,
            numberOfBooks: totalBooks,
            numberOfIssuedBooks: issuedBooksCount,
            numberOfMembers: memberCount,
            availableBooks: totalAvailableBooks,
            pendingRequests: requestCount
        });
    } catch (error) {
        res.status(500).json({ message: "Error loading dashboard", error });
    }
};

async function getAdminName(req, res) {
    const admin = await Admin.findOne({ adminId: req.session.user.userId });
    const adminName = admin.firstName;
    res.status(200).json({ adminName });
}


async function fetchNumber(collection) {
    try {
        const count = await collection.countDocuments();
        return count;
    }
    catch (error) {
        console.log('Error in fetching data');
    }
};

async function getAllBook(req, res) {
    const books = await Books.find();

    res.render('partial/books', { books });
};

async function getAllMember(req, res) {
    const members = await User.find({ isApproved: true });
    res.render('partial/members', { members });
}

async function getAdminBook(req, res) {
    try {
        const filePath = path.join(__dirName, 'resource', 'adminBooks.html');
        res.sendFile(filePath);
    } catch (error) {
        res.status(500).json({ message: "Error loading book", error });
    };
};

async function generateBookID() {
    try {
        const counter = await Counter.findOneAndUpdate(
            { name: 'bookId' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );
        const bookId = counter.value.toString().padStart(7, '0');

        return bookId;

    } catch (error) {
        console.log('Error generating book id');
    }
}

async function addBook(req, res) {

    try {
        const bookId = await generateBookID();
        let { totalCopies, author, name, category } = req.body;
        name = name.toUpperCase();
        const book = new Books({ bookId: bookId, name: name, author: author, totalCopies: totalCopies, availableCopies: totalCopies, category: category });
        await book.save();
        res.status(201).json({ message: `${book.name} book added successfully!` });

    } catch (error) {
        res.status(401).json({ message: ` Error While Adding Book Check if book already exists` });
    }
}

async function updateBook(req, res) {
    try {
        let { bookName, addQuantity, removeQuantity } = req.body;
        bookName = bookName.toUpperCase();
        bookName = bookName.trim();
        addQuantity = parseInt(addQuantity);
        removeQuantity = parseInt(removeQuantity);
        isNaN(addQuantity) ? addQuantity = 0 : parseInt(addQuantity);
        isNaN(removeQuantity) ? removeQuantity = 0 : parseInt(removeQuantity);

        const book = await Books.findOne({ name: bookName });      

        if (!book) {
            return res.status(404).json({ message: "Book not found" });

        }
        if (book.availableCopies < removeQuantity) {
            return res.status(400).json({ message: "Cannot remove more copies than available" });

        }
        else {
            book.totalCopies = book.totalCopies + addQuantity - removeQuantity;
            book.availableCopies = book.availableCopies + addQuantity - removeQuantity;
            await book.save();
            res.status(200).json({ message: `${book.name} book count updated successfully!` });
        }
    } catch (error) {
        res.status(401).json({ message: ` Error While Updating Book` });
    }
}

async function deleteBook(req, res) {
    try {
        let { bookName } = req.body;
        bookName = bookName.toUpperCase();
        bookName = bookName.trim();
        const book = await Books.findOne({ name: bookName });
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        } else {
            await book.deleteOne({ name: book.name });
            res.status(200).json({ message: `${book.name} book deleted successfully!` });
        }
    } catch (error) {
        res.status(500).json({ message: ` Error While Deleting Book` });
    }
}

function getAdminMembersPage(req, res) {
    const filePath = path.join(__dirName, "resource", 'adminMember.html');
    res.sendFile(filePath);
}

async function getPendingRequest(req, res) {
    const pendingMembers = await User.find({ isApproved: false });
    if (pendingMembers.length == 0) {
        res.send( "No pending request found" );
    }
    else {
        res.render('partial/pendingMember', { pendingMembers });
    }

}

async function approveMember(req, res) {
    const { rollNo } = req.body;
    try {
        const user = await User.findOne({ rollNo: rollNo });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isApproved = true;
        await user.save();
        res.status(200).json({ message: "User approved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error approving user try again later" });
    }
}

async function rejectMember(req, res) {
    const { rollNo } = req.body;
    try {
        const user = await User.findOne({ rollNo: rollNo });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await user.deleteOne({ rollNo: rollNo });
        res.status(200).json({ message: "User rejected successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error rejecting user try again later" });
    }
}
async function blockMember(req, res) {
    let { rollNo } = req.body;
    rollNo = rollNo.toUpperCase();
    rollNo = rollNo.trim();
    try {
        const user = await User.findOne({ rollNo: rollNo });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            user.isBlocked = true;
            await user.save();
            res.status(200).json({ message: "User blocked successfully" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error blocking user try again later" });
    }
}
async function unblockMember(req, res) {
    let { rollNo } = req.body;
    rollNo = rollNo.toUpperCase();
    rollNo = rollNo.trim();
    try {
        const user = await User.findOne({ rollNo: rollNo });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            user.isBlocked = false;
            await user.save();
            res.status(200).json({ message: "User unblocked successfully" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error unblocking user try again later" });
    }
}
async function deleteMember(req, res) {
    let { rollNo } = req.body;
    rollNo = rollNo.toUpperCase();
    rollNo = rollNo.trim();
    try {
        const user = await User.findOne({ rollNo: rollNo });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            await user.deleteOne({ rollNo: rollNo });
            res.status(200).json({ message: "User deleted successfully" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error deleting user try again later" });
    }
}

function getAdminSettings(req, res) {
    const filePath = path.join(__dirName, 'resource', 'adminSetting.html');
    res.sendFile(filePath);
}

async function changeAdminName(req, res) {

    try{
        let { firstName, lastName } = req.body;
        firstName = nameRefactor(firstName);
        lastName = nameRefactor(lastName);
        const admin =await Admin.findOne({ adminId: req.session.user.userId });
        if(admin){

            admin.firstName = firstName;
            admin.lastName = lastName;
            await admin.save();
            res.status(200).json({message:"Name changed Successfully",redirect:"/"});
        }
        else{
            res.status(500).json({message:"Admin not found please try again later"});
        }
    }catch(error){
        res.status(500).json({message:"Error while changing Name"});
    }
   
}
async function changePassword(req, res) {

    try{
        let { oldPassword, newPassword } = req.body;
        const admin = await Admin.findOne({ adminId: req.session.user.userId });
        
        if(oldPassword == admin.password)
        {
            admin.password = newPassword;
            await admin.save();
            res.status(200).json({message:"Password changed Successfully"});
        }
        else{
            res.status(500).json({message:"Incorrect Password Re-enter old password "});
        }
        
        
    }catch(error){
        res.status(500).json({message:"Error while changing "});
    }
   
}


export {
    getAdminDashboard, getAdminName, fetchNumber, getAllBook, getAllMember, getAdminBook, addBook,
    updateBook, deleteBook, getAdminMembersPage, getPendingRequest, approveMember, rejectMember,
    blockMember, deleteMember, unblockMember, getAdminSettings, changeAdminName, changePassword
};