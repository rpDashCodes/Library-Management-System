//importing required libraries
import mongoose from "mongoose";
import MongoStore from "connect-mongo";//session of user stored in db
import express from "express";
import session from "express-session";//helps store sessiondata of user to keep logged in
import dotenv from 'dotenv';

//importing database models
import User from "./Models/User.js";
import Admin from "./Models/Admin.js";
import { Books, IssuedBooks } from "./Models/Books.js";



import { fileURLToPath } from "url";
import path, { dirname, join } from 'path';
import { error } from "console";


dotenv.config();//reading .env file
const dbURL = process.env.DB_URL;//fetching data from .env file
await mongoose.connect(dbURL)

const app = express();
const port = 3000;
const __dirName = dirname(fileURLToPath(import.meta.url));
const publicPath = join(__dirName, 'public');



app.set('view engine', 'ejs');
app.set('views', join(__dirName, 'views'));


//All functions
async function login(req, res) {
    console.log('login attempted');
    if (req.body.role == 'member') {
        try {
            const student = await User.findOne({ rollNo: req.body.rollNo });
            if (student) {
                if (student.password == req.body.password) {

                    req.session.user = {
                        userId: student._id,
                        role: req.body.role,
                        username: student.firstName
                    }
                    console.log(req.session);

                    req.session.save((err) => {
                        if (err) {
                            console.error('Error saving session:', err);
                        } else {
                            console.log('Session saved successfully');
                        }
                    });

                    res.status(200).json({ message: 'Login Successfull' })
                }
                else {
                    res.status(500).json({ message: 'Invalid Password' })
                }
            }
            else {
                throw new error();
            }
        } catch (error) {
            res.status(500).json({ message: 'No Student found ' });
        }
    } else if (req.body.role == "admin") {

        try {
            const admin = await Admin.findOne({ adminId: req.body.adminId });
            if (admin) {

                if (admin.password == req.body.password) {
                    req.session.user = {
                        userId: admin._id,
                        role: req.body.role,
                        username: admin.firstName
                    };
                    console.log(req.session.user);
                    req.session.save(err => {
                        if (err) {
                            console.error('Error saving session:', err);
                        }
                    })
                    res.status(200).send({
                        message: "signed in Successfully Press OK to Continue",
                        redirect: "/adDashboard"
                    })
                }
                else {
                    res.status(500).json({ message: 'Invalid Password' })
                }
            }
            else {
                throw new error();
            }
        } catch (error) {
            res.status(500).json({ message: 'Invalid admin credential' });
        }
    }

}
//authenticated or not check function

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    }
    else {
        res.render('error', { message: "Unauthorized Access pleease log in " });
    }

}

function isAdmin(req, res, next) {
    if (req.session.user.role == "admin") {
        next();
    }
    else {
        res.render('error', { message: "Unauthorized acces. Page is acessible to admin only" })
    }
}

function isMember(req, res, next) {
    if (req.session.user.role == "member") {
        next();
    }

    else {
        res.render('error', { message: "Acessible to members only" });
    }
}
// fetch number of entries
async function fetchNumber(collection) {
    try {
        const count = await collection.countDocuments();
        return count;
    }
    catch (error) {
        console.log('Error in fetching data');
    }
}




app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.DB_URL,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 1, //session will auto ends in 1 hour
        },
    })
)
app.use(express.static(publicPath));
app.use(express.json());
app.get('/', (req, res) => {

    let Path = join(__dirName, 'resource/home.html');
    res.sendFile(Path);

});
app.get('/signUp', (req, res) => {
    let path = join(__dirName, 'resource', 'registration.html');
    res.sendFile(path);
})
app.get('/login', (req, res) => {
    const role = req.query.role;
    switch (role) {
        case "member":
            let memberpath = join(__dirName, 'resource/mlogin.html');
            res.sendFile(memberpath);
            break;

        case "admin":
            let adminpath = join(__dirName, 'resource/adlogin.html');
            res.sendFile(adminpath);
            break;
    }


});
app.post('/signSubmit', async (req, res) => {
    const { email, firstName, lastName, password, rollNo, gender, dateOfBirth } = req.body;

    const user = new User({ rollNo: rollNo, password: password, firstName: firstName, lastName: lastName, dateOfBirth: new Date(dateOfBirth), email: email, gender: gender });
    try {
        console.log('insert requsted');

        await user.save();
        res.status(201).json({ message: 'User registered successfully!' })
    } catch (error) {
        res.status(500).json({
            message: 'user already registered click on sign in bellow ',
        });
    }
});

app.post('/loginSubmit', login);

app.get('/adDashboard', isAuthenticated, isAdmin, async (req, res) => {
    const adminName = req.session.user.username;
    const numberOfBooks = await fetchNumber(Books);
    const numberOfIssuedBooks = await fetchNumber(IssuedBooks);
    const numberOfMembers = await fetchNumber(User);
    const availableBooks = await fetchNumber(Books);
    res.render('adminDashboard', { adminName, numberOfBooks, numberOfIssuedBooks, numberOfMembers,availableBooks });
    console.log(adminName);
})
app.get('/adDashboard/members', isAuthenticated, isAdmin, async (req, res) => {
    const members = await User.find();
    res.render('partial/members', { members });
})

app.listen(port, () => {
    console.log('app is listening at port 3000');

})