import expres from 'express';

import { isAuthenticated,isMember } from '../middlewears/authMiddlewears.js';
import {
    getMemberDashboard, getMemberName, searchBook, getBook,getActiveBooks, getPastBooks,getSettings, changePassword, issueBook
} from '../controllers/memberController.js';

const router = expres.Router();
//home endpoints here
router.get('/dashboard', isAuthenticated,isMember,getMemberDashboard);
router.get('/getMemberName', isAuthenticated,isMember,getMemberName);
router.post('/dashboard/search', isAuthenticated,isMember,searchBook);//end point for search book
router.post('/dashboard/issue',isAuthenticated,isMember,issueBook)

//books endpoints here
router.get('/book',getBook)
router.get('/book/active', isAuthenticated,isMember, getActiveBooks);
router.get('/book/past', isAuthenticated,isMember, getPastBooks);

//setting endpoints here
router.get('/setting', isAuthenticated,isMember,getSettings); 
router.post('/changePassword', isAuthenticated,isMember,changePassword);

export default router;