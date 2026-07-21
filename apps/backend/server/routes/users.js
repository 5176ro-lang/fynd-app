import { Router } from 'express';
import { getAllUsers, getUserById, getUserProfile, updateUser, checkUsername } from '../controllers/userController.js';
import { getUserRating } from '../controllers/reviewController.js';

const router = Router();
router.get('/check-username', checkUsername);
router.get('/', getAllUsers);
router.get('/:id/profile', getUserProfile);
router.get('/:id/rating', getUserRating);
router.get('/:id', getUserById);
router.put('/:id', updateUser);

export default router;