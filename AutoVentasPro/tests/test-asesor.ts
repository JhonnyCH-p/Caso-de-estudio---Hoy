(async () => {
  console.log(" PROBANDO MÓDULO ASESOR - ARQUITECTURA HEXAGONAL");
  console.log("====================================================\n");

  const { Asesor } = await import("../src/domain/entities/Asesor");
  const { AsesorRepositoryImpl } =
    await import("../src/infrastructure/repositories/AsesorRepositoryImpl");
  const { AsesorService } =
    await import("../src/application/services/AsesorService");

  const repository = new AsesorRepositoryImpl();
  const service = new AsesorService(repository);

  try {
    // ──  Crear asesor ────────────
    console.log("1.  Crear asesor");
    const resp1 = await service.createAsesor({
      especialidad: "Vehículos Eléctricos",
      experienciaAnios: 8,
      metaMensual: 50000,
    });
    console.log(`    Creado: ${resp1.especialidad} | ID: ${resp1.id}\n`);

    // ── Crear segundo asesor ───────
    console.log("2.  Crear segundo asesor");
    const resp2 = await service.createAsesor({
      especialidad: "Financiamiento",
      experienciaAnios: 3,
      metaMensual: 30000,
    });
    console.log(`    Creado: ${resp2.especialidad} | ID: ${resp2.id}\n`);

    // ── Obtener por ID ────────
    console.log("3.  Obtener asesor por ID");
    const encontrado = await service.getAsesorById(resp1.id);
    console.log(
      `    Encontrado: ${encontrado.especialidad} - ${encontrado.experienciaAnios} años\n`,
    );

    // ── Listar todos ────────
    console.log("4.  Listar todos los asesores");
    const todos = await service.getAllAsesores();
    console.log(`    Total: ${todos.length} asesores`);
    todos.forEach((a) =>
      console.log(`      • ${a.especialidad} | meta: $${a.metaMensual}`),
    );
    console.log("");

    // ── Actualizar ────────────
    console.log("5.   Actualizar asesor");
    const actualizado = await service.updateAsesor(resp1.id, {
      metaMensual: 60000,
      experienciaAnios: 9,
    });
    console.log(
      `    Meta actualizada a: $${actualizado.metaMensual} | Exp: ${actualizado.experienciaAnios} años\n`,
    );

    // ── Calcular comisión ───────────
    console.log("6.  Calcular comisión (venta: $70,000)");
    const comision1 = await service.calcularComision(resp1.id, 70000);
    console.log(
      `    Comisión para ${comision1.especialidad}: $${comision1.comision}`,
    );

    console.log("    Calcular comisión (venta: $25,000 - bajo la meta)");
    const comision2 = await service.calcularComision(resp2.id, 25000);
    console.log(
      `    Comisión para ${comision2.especialidad}: $${comision2.comision}\n`,
    );

    // ── Buscar por especialidad ────────────────
    console.log('7.  Buscar por especialidad "Finan"');
    const porEsp = await service.getAseforesByEspecialidad("Finan");
    console.log(`    Encontrados: ${porEsp.length}`);
    porEsp.forEach((a) => console.log(`      • ${a.especialidad}`));
    console.log("");

    // ── Buscar por experiencia mínima ──────────
    console.log("8.  Buscar asesores con ≥ 5 años de experiencia");
    const porExp = await service.getAsesoresByExperiencia(5);
    console.log(`    Encontrados: ${porExp.length}`);
    porExp.forEach((a) =>
      console.log(`      • ${a.especialidad} - ${a.experienciaAnios} años`),
    );
    console.log("");

    // ── Eliminar ───────────────────
    console.log("9.   Eliminar asesor");
    await service.deleteAsesor(resp2.id);
    const restantes = await service.getAllAsesores();
    console.log(`    Eliminado. Quedan: ${restantes.length} asesor(es)\n`);

    // ── Error esperado ────────────────
    console.log("10.  Prueba de error (datos inválidos)");
    try {
      await service.createAsesor({
        especialidad: "AB",
        experienciaAnios: -1,
        metaMensual: 0,
      });
    } catch (err: any) {
      console.log(`     Error capturado correctamente: ${err.message}\n`);
    }

    console.log("🎉 ¡TODAS LAS PRUEBAS PASARON!");
  } catch (error: any) {
    console.error("❌ ERROR INESPERADO:", error.message);
  }
})();
