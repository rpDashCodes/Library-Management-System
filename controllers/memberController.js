import Admin from "../Models/Admin.js";
import { Books, IssuedBooks } from "../Models/Books.js";
import User from "../Models/User.js";
import Counter from "../Models/Counter.js";

import { nameRefactor } from "./utility.js";
import path from 'path';

import { __dirName } from "../server.js";

//to set user name in frontend

async function getMemberName(req, res) {
    const user = await User.findOne({ rollNo: req.session.user.userId });
    if (user) {
        res.json({ name: user.firstName });
    }
}

//get user dashboard
async function getMemberDashboard(req, res) {
    const dashboardPath = path.join(__dirName, 'resource', 'member', 'mDashboard.html');
    res.status(200).sendFile(dashboardPath);
}
async function searchBook(req, res) {

    const searchBy = req.body.searchBy;
    const searchInput = req.body.searchInput;
    let books;
    try {
        if (searchBy === "category") {
            books = await Books.find({ category: { $regex: searchInput, $options: 'i' } });

            if (books.length > 0) {
                res.render('partial/member/book', { books: books });

            }
        }
        else {
            books = await Books.find({ [searchBy]: { $regex: searchInput, $options: 'i' } });


            if (books.length > 0) {
                res.render('partial/member/book', { books: books });
            }
        }

    } catch (error) {
        res.json({ message: "can't reach to server try aagain later" });
    }
}

async function checkRepeatIssue(req, res) {
    try {
      const  userId = req.session.user.userId; 
      const { bookId } = req.body;
      console.log('repeat checking',userId,bookId);
      
  
      // Find unreturned copies of the same book issued by the user
      const duplicateIssue = await IssuedBooks.findOne({ 
        memberId:userId, 
        bookId, 
        isReturned: false 
      }); 
  
      if (duplicateIssue) {
        if (duplicateIssue.isApproved) {
          return 'approved';
        }
       return 1;
      }
      else{
          return 0;
      }
  
    } catch (error) {
      console.error("Error checking for duplicate issue:", error);
        throw error;
    }
  }

const generateIssueId = async () => {
    try {
        // Get the current year and month in 'yyyymm' format
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
        const prefix = `${year}${month}`;

        // Find the last issued book for the current month
        const lastIssuedBook = await IssuedBooks.findOne({ issueId: new RegExp(`^${prefix}`) })
            .sort({ issueId: -1 }) // Sort in descending order by issueId
            .exec();

        let newCounter = 1;

        if (lastIssuedBook) {
            // Extract the numeric part of the last issueId and increment it
            const lastCounter = parseInt(lastIssuedBook.issueId.slice(6), 10);
            newCounter = lastCounter + 1;
        }

        // Format the new issueId with the incremented counter
        const issueId = `${prefix}${String(newCounter).padStart(6, "0")}`;


        console.log('issueId',issueId);
        
        return issueId;
    } catch (error) {
        console.error("Error generating issueId:", error);
        throw error; // Re-throw the error for further handling
    }
};

// function to generate the issue date and return by date. Both dates will include only the day, month, and year (in DD-MM-YYYY format). The return date will be exactly 7 days after the issue date.


function generateDates()  {
    const today = new Date();

    // Format the issue date (DD-MM-YYYY)
    const issueDate = formatDate(today);

    // Calculate the return by date (7 days from today)
    const returnByDateObj = new Date(today);
    returnByDateObj.setDate(returnByDateObj.getDate() + 7);

    const returnByDate = formatDate(returnByDateObj);

    return { issueDate, returnByDate };
};

// function to format a date as to tthe standard format DD-MM-YYYY
const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
    const year = date.getFullYear();
console.log('date',`${day}-${month}-${year}`); 

    return `${day}-${month}-${year}`;
};


async function issueBook(req,res){//function to issue new book
    const bookId = req.body.bookId;
    const memberId = req.session.user.userId;
    console.log('bookId',bookId);
    
    try {
        let repeatIssue = await checkRepeatIssue(req,res);
        if(repeatIssue){
            if(repeatIssue === 'approved'){
                res.status(500).json({message:`Hey, ${req.session.user.userName}You already owned this book and yet to be returned.`});
            }
            else{
                console.log('repeatIssue',repeatIssue);
                
                res.status(500).json({
                    message:`Hey, ${req.session.user.userName} You have already issued this book please wait for the approval by admin.`
                });
            }
            return;
        }
        const dates = generateDates();
        const book = await Books.findOne({ bookId: bookId });
        const issueId = await generateIssueId();

        const newIsuue = new IssuedBooks({
            bookId:bookId,
            issueId:issueId,
            issueDate:dates.issueDate,
            returnBy:dates.returnByDate,
            isReturned:false,
            returnDate:null,
            memberId:memberId,
            isApproved:false
        });
        await newIsuue.save(); 
        res.status(200).json({
            message:`${book.name} book Issued Successfully waiting for Admin's approval`
        })
    }catch(error)
    {
        console.log(error);
        res.status(500).json({message:
            "Unable to Reach the Server at The moment"
        })

    }


}


//settings functions here
function getSettings(req, res) {
    const settingsPath = path.join(__dirName, 'resource', 'member', 'settings.html');
    res.sendFile(settingsPath);
}
async function changePassword(req, res) {

    try {
        let { oldPassword, newPassword } = req.body;
        const user = await User.findOne({ rollNo: req.session.user.userId });

        if (oldPassword == user.password) {
            user.password = newPassword;
            await user.save();
            res.status(200).json({ message: "Password changed Successfully" });
        }
        else {
            res.status(500).json({ message: "Incorrect Password Re-enter old password " });
        }


    } catch (error) {
        res.status(500).json({ message: "Error while changing password" });
    }

}



export { getMemberName, getMemberDashboard, searchBook,issueBook, getSettings, changePassword };