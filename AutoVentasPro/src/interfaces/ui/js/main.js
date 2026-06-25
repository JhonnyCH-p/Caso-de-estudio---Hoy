/* =====================================================
   AutoVentas Pro — main.js
   Lógica CRUD del panel de administración.
   Refleja las validaciones de las entidades del dominio:
   Vehiculo.ts | Asesor.ts | PlanFinanciamiento.ts | usuario.entity.ts
   ===================================================== */

let idCounters = { v: 2, a: 1, p: 1, u: 1 };

/* ---------- NAVEGACIÓN ---------- */
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});

/* ---------- UTILIDADES ---------- */
function updateCount(module, tbody) {
  const n = tbody.querySelectorAll('tr:not(.empty-row)').length;
  document.getElementById('count-' + module).textContent = n + (n === 1 ? ' registro' : ' registros');
}

function clearEmpty(tbody) {
  const empty = tbody.querySelector('.empty-row');
  if (empty) empty.remove();
}

function checkEmpty(tbody, cols) {
  if (!tbody.querySelector('tr:not(.empty-row)')) {
    const tr = document.createElement('tr');
    tr.className = 'empty-row';
    tr.innerHTML = `<td colspan="${cols}">Sin registros</td>`;
    tbody.appendChild(tr);
  }
}

function fmtPrecio(n) {
  return '$' + Number(n).toLocaleString('es-EC');
}

function tipoBadge(tipo) {
  const map = { SEDAN: 'badge-sedan', SUV: 'badge-suv', HATCHBACK: 'badge-hatch', PICKUP: 'badge-pickup', DEPORTIVO: 'badge-dep' };
  return `<span class="badge-tipo ${map[tipo] || ''}">${tipo}</span>`;
}

function rolBadge(rol) {
  const map   = { asesor: 'rol-asesor', jefe_ventas: 'rol-jefe', administrador: 'rol-admin' };
  const label = { asesor: 'Asesor', jefe_ventas: 'Jefe de ventas', administrador: 'Administrador' };
  return `<span class="badge-rol ${map[rol] || ''}">${label[rol] || rol}</span>`;
}

function padId(prefix, n) {
  return prefix + String(n).padStart(3, '0');
}

/* ---------- ELIMINAR FILA (global para onclick inline) ---------- */
function delRow(btn, module) {
  const tbody = btn.closest('tr').parentElement;
  btn.closest('tr').remove();
  const cols = { vehiculo: 8, asesor: 6, plan: 8, usuario: 6 };
  checkEmpty(tbody, cols[module]);
  updateCount(module, tbody);
}

/* ---------- VEHÍCULO ----------
   Validaciones según Vehiculo.ts:
   - marca.length >= 2
   - modelo.length >= 2
   - anio: 1900 <= x <= currentYear+1
   - precioBase >= 0
   - stock >= 0
*/
function addVehiculo() {
  const marca  = document.getElementById('v-marca').value.trim();
  const modelo = document.getElementById('v-modelo').value.trim();
  const anio   = parseInt(document.getElementById('v-anio').value);
  const precio = parseFloat(document.getElementById('v-precio').value);
  const tipo   = document.getElementById('v-tipo').value;
  const stock  = parseInt(document.getElementById('v-stock').value);

  if (!marca  || marca.length  < 2) return alert('Marca inválida (mín. 2 caracteres)');
  if (!modelo || modelo.length < 2) return alert('Modelo inválido (mín. 2 caracteres)');
  if (!anio   || anio < 1900 || anio > new Date().getFullYear() + 1) return alert('Año inválido');
  if (isNaN(precio) || precio < 0) return alert('Precio no puede ser negativo');
  if (!tipo) return alert('Selecciona el tipo de vehículo');
  if (isNaN(stock) || stock < 0)   return alert('Stock no puede ser negativo');

  const id    = padId('VEH-', idCounters.v++);
  const tbody = document.getElementById('tbody-vehiculo');
  clearEmpty(tbody);

  const tr = document.createElement('tr');
  tr.dataset.id = id;
  tr.innerHTML = `
    <td class="id-cell">${id}</td>
    <td>${marca}</td>
    <td>${modelo}</td>
    <td>${anio}</td>
    <td>${fmtPrecio(precio)}</td>
    <td>${tipoBadge(tipo)}</td>
    <td class="${stock > 0 ? 'stock-ok' : 'stock-no'}">${stock}</td>
    <td><button class="btn-del" onclick="delRow(this,'vehiculo')">Eliminar</button></td>
  `;
  tbody.appendChild(tr);
  updateCount('vehiculo', tbody);
  ['v-marca','v-modelo','v-anio','v-precio','v-stock'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('v-tipo').value = '';
}

/* ---------- ASESOR ----------
   Validaciones según Asesor.ts:
   - especialidad.trim().length >= 3
   - experienciaAnios: 0 <= x <= 60
   - metaMensual > 0
   Lógica de negocio: calcularComision()
   - base 2%, +1% si exp > 5 años, +0.5% si venta > meta
*/
function addAsesor() {
  const esp  = document.getElementById('a-esp').value.trim();
  const exp  = parseInt(document.getElementById('a-exp').value);
  const meta = parseFloat(document.getElementById('a-meta').value);

  if (!esp || esp.length < 3)  return alert('La especialidad debe tener al menos 3 caracteres');
  if (isNaN(exp) || exp < 0)   return alert('Los años de experiencia no pueden ser negativos');
  if (exp > 60)                 return alert('Los años de experiencia no pueden superar 60');
  if (!meta || meta <= 0)      return alert('La meta mensual debe ser mayor a 0');

  let pct = 0.02;
  if (exp > 5) pct += 0.01;
  const comisionBase = parseFloat((meta * pct).toFixed(2));

  const id    = padId('ASE-', idCounters.a++);
  const tbody = document.getElementById('tbody-asesor');
  clearEmpty(tbody);

  const tr = document.createElement('tr');
  tr.dataset.id = id;
  tr.innerHTML = `
    <td class="id-cell">${id}</td>
    <td>${esp}</td>
    <td>${exp} años</td>
    <td>${fmtPrecio(meta)}</td>
    <td class="commission-cell">${fmtPrecio(comisionBase)} (${(pct * 100).toFixed(1)}%)</td>
    <td><button class="btn-del" onclick="delRow(this,'asesor')">Eliminar</button></td>
  `;
  tbody.appendChild(tr);
  updateCount('asesor', tbody);
  ['a-esp','a-exp','a-meta'].forEach(id => document.getElementById(id).value = '');
}

/* ---------- PLAN DE FINANCIAMIENTO ----------
   Validaciones según PlanFinanciamiento.ts:
   - plazosDisponibles: array de números
   - tasaInteresAnual usada en calcularCuota()
   - comision y entradaMinima son atributos del constructor
*/
function addPlan() {
  const nombre    = document.getElementById('p-nombre').value.trim();
  const entrada   = parseFloat(document.getElementById('p-entrada').value);
  const tasa      = parseFloat(document.getElementById('p-tasa').value);
  const plazosStr = document.getElementById('p-plazos').value.trim();
  const comision  = parseFloat(document.getElementById('p-comision').value);

  if (!nombre) return alert('Ingresa el nombre del plan');
  if (isNaN(entrada) || entrada < 0) return alert('Entrada mínima inválida');
  if (isNaN(tasa))   return alert('Tasa de interés inválida');
  if (!plazosStr)    return alert('Ingresa los plazos disponibles');

  const plazos = plazosStr.split(',').map(p => parseInt(p.trim())).filter(n => !isNaN(n));
  if (plazos.length === 0) return alert('Formato de plazos inválido. Usa: 12,24,36');

  const id    = padId('PLA-', idCounters.p++);
  const tbody = document.getElementById('tbody-plan');
  clearEmpty(tbody);

  const tr = document.createElement('tr');
  tr.dataset.id = id;
  tr.innerHTML = `
    <td class="id-cell">${id}</td>
    <td>${nombre}</td>
    <td>${entrada}%</td>
    <td>${tasa}%</td>
    <td style="font-family:monospace;font-size:12px">${plazos.join(', ')}</td>
    <td>${isNaN(comision) ? '—' : comision + '%'}</td>
    <td><span class="badge-rol badge-activo">Activo</span></td>
    <td><button class="btn-del" onclick="delRow(this,'plan')">Eliminar</button></td>
  `;
  tbody.appendChild(tr);
  updateCount('plan', tbody);
  ['p-nombre','p-entrada','p-tasa','p-plazos','p-comision'].forEach(id => document.getElementById(id).value = '');
}

/* ---------- USUARIO ----------
   Validaciones según usuario.entity.ts:
   - usuario.length >= 4 (se guarda en lowercase)
   - passwordHash.length >= 6
   - rol: 'asesor' | 'jefe_ventas' | 'administrador'
*/
function addUsuario() {
  const usu  = document.getElementById('u-nombre').value.trim().toLowerCase();
  const pass = document.getElementById('u-pass').value;
  const rol  = document.getElementById('u-rol').value;
  const area = document.getElementById('u-area').value.trim();

  if (!usu  || usu.length  < 4) return alert('El usuario debe tener al menos 4 caracteres');
  if (!pass || pass.length < 6) return alert('La contraseña debe tener al menos 6 caracteres');
  if (!['asesor','jefe_ventas','administrador'].includes(rol)) return alert('Selecciona un rol válido');

  const id    = padId('USR-', idCounters.u++);
  const tbody = document.getElementById('tbody-usuario');
  clearEmpty(tbody);

  const tr = document.createElement('tr');
  tr.dataset.id = id;
  tr.innerHTML = `
    <td class="id-cell">${id}</td>
    <td>${usu}</td>
    <td>${rolBadge(rol)}</td>
    <td>${area || '—'}</td>
    <td><span class="badge-rol badge-activo">Activo</span></td>
    <td><button class="btn-del" onclick="delRow(this,'usuario')">Eliminar</button></td>
  `;
  tbody.appendChild(tr);
  updateCount('usuario', tbody);
  ['u-nombre','u-pass','u-area'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('u-rol').value = '';
}