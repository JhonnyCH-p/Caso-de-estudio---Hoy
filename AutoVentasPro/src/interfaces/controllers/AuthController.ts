import type { Request, Response } from 'express';
import type { AuthService } from '../../application/services/AuthService.js';

export class AuthController {
   constructor(private authService: AuthService) {}

   login = async (req: Request, res: Response): Promise<void> => {
      try {
         const { usuario, password } = req.body;
         if (!usuario || !password) {
            res.status(400).json({ ok: false, message: 'Usuario y contraseña requeridos' });
            return;
         }
         const result = await this.authService.login(usuario, password);
         res.json({ ok: true, data: result });
      } catch (error: any) {
         const status = error.message.includes('desactivada') ? 403 : 401;
         res.status(status).json({ ok: false, message: error.message });
      }
   };

   me = async (req: Request, res: Response): Promise<void> => {
      try {
         const profile = await this.authService.getProfile(req.user!.id);
         res.json({ ok: true, data: profile });
      } catch (error: any) {
         res.status(404).json({ ok: false, message: error.message });
      }
   };
}
