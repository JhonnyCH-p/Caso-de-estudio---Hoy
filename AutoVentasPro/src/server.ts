import { app } from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📡 Endpoints:`);
    console.log(`   POST   /api/employees`);
    console.log(`   GET    /api/employees`);
    console.log(`   GET    /api/employees/stats`);
    console.log(`   GET    /api/employees/:id`);
    console.log(`   PUT    /api/employees/:id`);
    console.log(`   DELETE /api/employees/:id`);
    console.log(`   PATCH  /api/employees/:id/salary`);
});
