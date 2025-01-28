import expres from 'express';
import { Books } from '../Models/Books.js';


import { isAuthenticated,isMember } from '../middlewears/authMiddlewears.js';
import {
    getMemberDashboard, getMemberName, searchBook,getSettings, changePassword, issueBook
} from '../controllers/memberController.js';
import { get } from 'mongoose';

const router = expres.Router();
//home endpoints here
router.get('/dashboard', isAuthenticated,isMember,getMemberDashboard);
router.get('/getMemberName', isAuthenticated,isMember,getMemberName);
router.post('/dashboard/search', isAuthenticated,isMember,searchBook);//end point for search book
router.post('/dashboard/issue',isAuthenticated,isMember,issueBook)
//setting endpoints here
router.get('/setting', isAuthenticated,isMember,getSettings); 
router.post('/changePassword', isAuthenticated,isMember,changePassword);

export default router;