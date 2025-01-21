import express from 'express';

import { Books } from '../Models/Books.js';

import { isAdmin, isAuthenticated } from '../middlewears/authMiddlewears.js';
import {
    getAdminDashboard,getAdminName , getAllBook, getAllMember, getAdminBook, addBook, updateBook,
    deleteBook, getAdminMembersPage, getPendingRequest, approveMember, rejectMember,
    blockMember, unblockMember, deleteMember, getAdminSettings, changeAdminName, changePassword
} from '../controllers/adminControllers.js';


const router = express.Router();
router.get('/adDashboard', isAuthenticated, isAdmin, getAdminDashboard);
router.get('/adDashboard/book', isAuthenticated, isAdmin, getAllBook);
router.get('/adDashboard/member', isAuthenticated, isAdmin, getAllMember);

//books endpoint of navigation bar
router.get('/adBook', isAuthenticated, isAdmin, getAdminBook);
router.post('/adBook/addBookForm', isAuthenticated, isAdmin, addBook);
router.post('/adBook/updateBookForm', isAuthenticated, isAdmin, updateBook);
router.post('/adBook/deleteBookForm', isAuthenticated, isAdmin, deleteBook);

//members endpoint
router.get('/adMember', isAuthenticated, isAdmin, getAdminMembersPage);
router.get('/adMember/pending', isAuthenticated, isAdmin, getPendingRequest);
router.post('/adMember/approve', isAuthenticated, isAdmin, approveMember);
router.post('/adMember/reject', isAuthenticated, isAdmin, rejectMember);
router.post('/adMember/blockUserForm', isAuthenticated, isAdmin, blockMember);
router.post('/adMember/deleteUserForm', isAuthenticated, isAdmin, deleteMember);
router.post('/adMember/unblockUserForm', isAuthenticated, isAdmin, unblockMember);

//setings endpoint
router.get('/adSetting', isAuthenticated, isAdmin, getAdminSettings);
router.get('/adSetting/getAdminName', isAuthenticated, isAdmin, getAdminName);
router.post('/adSetting/changeName', isAuthenticated, isAdmin, changeAdminName);
router.post('/adSetting/changePassword', isAuthenticated, isAdmin, changePassword);

export default router;
