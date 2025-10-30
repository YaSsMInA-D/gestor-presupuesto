
import { 
    actualizarPresupuesto, 
    mostrarPresupuesto, 
    CrearGasto, 
    listarGastos, 
    anyadirGasto, 
    borrarGasto, 
    calcularTotalGastos, 
    calcularBalance,
    presupuesto 
} from './gestionPresupuesto.js';


function inicializarDatosPrueba() {
    
    actualizarPresupuesto(1000);
    
    
    const gasto1 = new CrearGasto("Comida supermercado", 45.50, "2024-01-15", "alimentacion", "supermercado");
    const gasto2 = new CrearGasto("Gasolina", 60.00, "2024-01-16", "transporte", "coche");
    const gasto3 = new CrearGasto("Cena restaurante", 35.75, "2024-01-14", "alimentacion", "restaurante");
    
    anyadirGasto(gasto1);
    anyadirGasto(gasto2);
    anyadirGasto(gasto3);
    
    console.log("Datos de prueba inicializados");
}


function crearFormularioGasto() {
    const formularioContainer = document.getElementById('formulario-gasto');
    
    const form = document.createElement('form');
    form.id = 'form-gasto';
   
    const descripcionLabel = document.createElement('label');
    descripcionLabel.textContent = 'Descripción:';
    descripcionLabel.htmlFor = 'descripcion';
    
    const descripcionInput = document.createElement('input');
    descripcionInput.type = 'text';
    descripcionInput.id = 'descripcion';
    descripcionInput.name = 'descripcion';
    descripcionInput.required = true;
    
  
    const valorLabel = document.createElement('label');
    valorLabel.textContent = 'Valor (€):';
    valorLabel.htmlFor = 'valor';
    
    const valorInput = document.createElement('input');
    valorInput.type = 'number';
    valorInput.id = 'valor';
    valorInput.name = 'valor';
    valorInput.step = '0.01';
    valorInput.min = '0';
    valorInput.required = true;
    
  
    const fechaLabel = document.createElement('label');
    fechaLabel.textContent = 'Fecha:';
    fechaLabel.htmlFor = 'fecha';
    
    const fechaInput = document.createElement('input');
    fechaInput.type = 'date';
    fechaInput.id = 'fecha';
    fechaInput.name = 'fecha';
    fechaInput.value = new Date().toISOString().split('T')[0]; // Today's date
    
    
    const etiquetasLabel = document.createElement('label');
    etiquetasLabel.textContent = 'Etiquetas (separadas por comas):';
    etiquetasLabel.htmlFor = 'etiquetas';
    
    const etiquetasInput = document.createElement('input');
    etiquetasInput.type = 'text';
    etiquetasInput.id = 'etiquetas';
    etiquetasInput.name = 'etiquetas';
    etiquetasInput.placeholder = 'ej: comida, transporte, casa';
    
   
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Añadir Gasto';
    
    
    form.appendChild(descripcionLabel);
    form.appendChild(descripcionInput);
    form.appendChild(valorLabel);
    form.appendChild(valorInput);
    form.appendChild(fechaLabel);
    form.appendChild(fechaInput);
    form.appendChild(etiquetasLabel);
    form.appendChild(etiquetasInput);
    form.appendChild(submitButton);
    
    
    formularioContainer.appendChild(form);
    
    return form;
}


function manejarEnvioFormulario(event) {
    event.preventDefault(); 
    
    // Get form values
    const descripcion = document.getElementById('descripcion').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const fecha = document.getElementById('fecha').value;
    const etiquetasTexto = document.getElementById('etiquetas').value;
    
    
    const etiquetas = etiquetasTexto
        .split(',')
        .map(etiqueta => etiqueta.trim())
        .filter(etiqueta => etiqueta !== '');
    
                                        // Create new expense
    const nuevoGasto = new CrearGasto(descripcion, valor, fecha, ...etiquetas);
    anyadirGasto(nuevoGasto);
    
   
    document.getElementById('form-gasto').reset();
    document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
    
   
    actualizarDisplay();
    
    console.log('Nuevo gasto añadido:', nuevoGasto);
}

function mostrarListadoGastos() {
    const listadoContainer = document.getElementById('listado-gastos');
    const gastos = listarGastos();
    
   
    listadoContainer.innerHTML = '';
    
    if (gastos.length === 0) {
        listadoContainer.innerHTML = '<p>No hay gastos registrados.</p>';
        return;
    }
    
    gastos.forEach(gasto => {
        const gastoElement = document.createElement('div');
        gastoElement.className = 'gasto-item';
        gastoElement.id = `gasto-${gasto.id}`;
        
        
        const fechaFormateada = new Date(gasto.fecha).toLocaleDateString();
        
      
        const etiquetasTexto = gasto.etiquetas.length > 0 
            ? gasto.etiquetas.join(', ') 
            : 'Sin etiquetas';
        
        gastoElement.innerHTML = `
            <strong>${gasto.descripcion}</strong> - ${gasto.valor}€
            <br>
            <small>Fecha: ${fechaFormateada} | Etiquetas: ${etiquetasTexto}</small>
            <br>
            <button class="btn-borrar" data-id="${gasto.id}">🗑️ Borrar</button>
        `;
        
        listadoContainer.appendChild(gastoElement);
    });
    
    // event listeners to  delete buttons
    document.querySelectorAll('.btn-borrar').forEach(button => {
        button.addEventListener('click', manejarBorradoGasto);
    });
}

// Handle expense deletion
function manejarBorradoGasto(event) {
    const idGasto = parseInt(event.target.getAttribute('data-id'));
    
  
    if (confirm('are you sure wanna delete this expence?')) {
        borrarGasto(idGasto);
        actualizarDisplay();
        console.log('Gasto borrado:', idGasto);
    }
}

// Update totals and balance
function actualizarTotales() {
    const totalGastosElement = document.getElementById('total-gastos');
    const balanceElement = document.getElementById('balance');
    
    const totalGastos = calcularTotalGastos();
    const balance = calcularBalance();
    
    totalGastosElement.textContent = `Total de gastos: ${totalGastos}€`;
    balanceElement.textContent = `Balance: ${balance}€`;
    
   
    if (balance < 0) {
        balanceElement.style.color = 'red';
    } else {
        balanceElement.style.color = 'green';
    }
}


function actualizarDisplay() {
    mostrarListadoGastos();
    actualizarTotales();
}


function inicializarAplicacion() {
    console.log('Inicializando aplicación web...');
    
    
    inicializarDatosPrueba();
    
    // Create form here
    const formulario = crearFormularioGasto();
    formulario.addEventListener('submit', manejarEnvioFormulario);
    
    // Initial display
    actualizarDisplay();
    
    console.log('Aplicación web inicializada correctamente');
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', inicializarAplicacion);