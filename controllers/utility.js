import { join } from 'path';
import { __dirName } from '../server.js';
import User from "../Models/User.js";


function getHomePage(req, res) {

    let Path = join(__dirName, 'resource/home.html');
    res.sendFile(Path);

}

function getSignUpPage(req, res) {
    let path = join(__dirName, 'resource', 'registration.html');
    res.sendFile(path);
}

function getLoginPage(req, res) {
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
}
function capitalizeWord(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
function nameRefactor(word) {
    return word
        .trim()
        .split(/\s+/)
        .map(capitalizeWord)
        .join(' ');
}

async function createUser(req, res) {
    let { email, firstName, lastName, password, rollNo, gender, dateOfBirth } = req.body;
    firstName = nameRefactor(firstName);
    lastName = nameRefactor(lastName);
    

    const user = new User({ rollNo: rollNo, password: password, firstName: firstName, lastName: lastName, dateOfBirth: new Date(dateOfBirth), email: email, gender: gender });
    try {
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({
            message: 'user already registered click on sign in bellow ',
        });
    }
}

function logOut(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/home');
        }
        res.clearCookie('sid');
        res.redirect('/');
    });
}

export { getLoginPage, getHomePage, getSignUpPage, createUser, nameRefactor, logOut };