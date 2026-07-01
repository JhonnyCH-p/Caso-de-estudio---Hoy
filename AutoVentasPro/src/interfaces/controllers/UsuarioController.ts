import type { Request, Response } from 'express';
import type { UsuarioService } from '../../application/services/UsuarioService.js';

export class UsuarioController {
  constructor(private service: UsuarioService) {}

  crear = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.crearUsuario(req.body);
      res.status(201).json({ ok: true, data: result });
    } catch (error: any) {
      res.status(400).json({ ok: false, message: error.message });
    }
  };

  listar = async (req: Request, res: Response): Promise<void> => {
    try {
      const activos = req.query.activos === 'true';
      const result = await this.service.listarUsuarios(activos);
      res.status(200).json({ ok: true, data: result });
    } catch (error: any) {
      res.status(500).json({ ok: false, message: error.message });
    }
  };

  obtenerPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.obtenerUsuarioPorId(req.params.id);
      res.status(200).json({ ok: true, data: result });
    } catch (error: any) {
      res.status(404).json({ ok: false, message: error.message });
    }
  };

  actualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.actualizarUsuario(req.params.id, req.body);
      res.status(200).json({ ok: true, data: result });
    } catch (error: any) {
      res.status(400).json({ ok: false, message: error.message });
    }
  };

  eliminar = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.service.eliminarUsuario(req.params.id);
      res.status(200).json({ ok: true, message: 'Usuario eliminado correctamente' });
    } catch (error: any) {
      res.status(404).json({ ok: false, message: error.message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { usuario, password } = req.body;
      if (!usuario || !password) {
        res.status(400).json({ ok: false, message: 'Usuario y contraseña requeridos' });
        return;
      }
      const result = await this.service.login({ usuario, password });
      res.status(200).json({ ok: true, data: result });
    } catch (error: any) {
      const status = error.message.includes('desactivada') ? 403 : 401;
      res.status(status).json({ ok: false, message: error.message });
    }
  };

  buscarPorRol = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.buscarPorRol(req.params.rol);
      res.status(200).json({ ok: true, data: result });
    } catch (error: any) {
      res.status(400).json({ ok: false, message: error.message });
    }
  };

  calcularComision = async (req: Request, res: Response): Promise<void> => {
    try {
      const montoVenta = Number(req.body.montoVenta);
      if (isNaN(montoVenta)) {
        res.status(400).json({ ok: false, message: 'montoVenta debe ser un número' });
        return;
      }
      const result = await this.service.calcularComision(req.params.id, montoVenta);
      res.status(200).json({ ok: true, data: result });
    } catch (error: any) {
      res.status(400).json({ ok: false, message: error.message });
    }
  };

  estadisticas = async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.obtenerEstadisticas();
      res.status(200).json({ ok: true, data: result });
    } catch (error: any) {
      res.status(500).json({ ok: false, message: error.message });
    }
  };
}
