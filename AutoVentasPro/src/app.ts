import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { EmpleadoRoutes } from './interfaces/routes/empleadoRoutes.js';
import { UsuarioRoutes } from './interfaces/routes/usuarioRoutes.js';
import { VehiculoRoutes } from './interfaces/routes/vehiculoRoutes.js';
import { PlanRoutes } from './interfaces/routes/planRoutes.js';
import { CotizacionRoutes } from './interfaces/routes/cotizacionRoutes.js';
import { VentaRoutes } from './interfaces/routes/ventaRoutes.js';
import { AuthRoutes } from './interfaces/routes/authRoutes.js';
import { DashboardRoutes } from './interfaces/routes/dashboardRoutes.js';
import { UploadRoutes } from './interfaces/routes/uploadRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());
app.use('/api/employees', EmpleadoRoutes);
app.use('/api/usuarios', UsuarioRoutes);
app.use('/api/vehiculos', VehiculoRoutes);
app.use('/api/planes', PlanRoutes);
app.use('/api/cotizaciones', CotizacionRoutes);
app.use('/api/ventas', VentaRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/dashboard', DashboardRoutes);
app.use('/api/upload', UploadRoutes);

app.use(express.static(path.join(__dirname, '../src/interfaces/ui')));
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, '../src/interfaces/ui/home.html')));

export { app };
