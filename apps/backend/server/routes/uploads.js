import { Router } from 'express';
import { upload, handleUpload } from '../controllers/uploadController.js';

const router = Router();

router.post('/', (req, res) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    handleUpload(req, res);
  });
});

export default router;