import { Router } from 'express';
import {
  getAllListings, getListingById, createListing, updateListing, deleteListing,
  getMyAvailableListings,
} from '../controllers/listingController.js';

const router = Router();
router.get('/mine/:userId', getMyAvailableListings);
router.get('/', getAllListings);
router.get('/:id', getListingById);
router.post('/', createListing);
router.put('/:id', updateListing);
router.delete('/:id', deleteListing);

export default router;