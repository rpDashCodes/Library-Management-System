import express from 'express';
import { getLoginPage, getSignUpPage, getHomePage, createUser, logOut } from '../controllers/utility.js';
import login from '../controllers/authenticationController.js';

const router = express.Router();
router.get('/', getHomePage);
router.get('/signUp', getSignUpPage);
router.get('/login', getLoginPage);
router.post('/signSubmit', createUser);
router.post('/loginSubmit', login);
router.get('/logout', logOut);
export default router;