import { Router } from 'express';
import {
  getAllSwaps, getSwapById, createSwap, updateSwap, deleteSwap,
} from '../controllers/swapController.js';

const router = Router();
router.get('/', getAllSwaps);
router.get('/:id', getSwapById);
router.post('/', createSwap);
router.put('/:id', updateSwap);
router.delete('/:id', deleteSwap);

export default router;