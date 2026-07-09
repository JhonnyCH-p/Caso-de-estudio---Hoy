import type { Request, Response } from 'express';
import { uploadFile } from '../../infrastructure/storage/supabase.storage.js';

export class UploadController {
   upload = async (req: Request, res: Response): Promise<void> => {
      try {
         const file = req.file;
         if (!file) {
            res.status(400).json({ error: 'No se envió ningún archivo' });
            return;
         }
         const url = await uploadFile(file.buffer, file.originalname, file.mimetype);
         res.status(200).json({ url });
      } catch (error: any) {
         res.status(500).json({ error: error.message });
      }
   };
}
