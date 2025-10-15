// Variable global para el presupuesto
let presupuesto = 0;

// NEW: Global variables for Practical 2
let gastos = [];
let idGasto = 0;

// Función para actualizar el presupuesto
function actualizarPresupuesto(cantidad) {
    if (typeof cantidad === 'number' && cantidad >= 0) {
        presupuesto = cantidad;
        return presupuesto;
    } else {
        console.error("Error: El valor introducido no es un número válido");
        return -1;
    }
}

// Función para mostrar el presupuesto
function mostrarPresupuesto() {
    return `Tu presupuesto actual es de ${presupuesto} €`;
}

// Función constructora para crear gastos - UPDATED for Practical 2
function CrearGasto(descripcion, valor, fecha, ...etiquetas) {
    // Validar que el valor sea un número no negativo
    if (typeof valor === 'number' && valor >= 0) {
        this.valor = valor;
    } else {
        this.valor = 0;
    }
    
    this.descripcion = descripcion;
    
    // NEW: Handle fecha
    if (fecha) {
        const timestamp = Date.parse(fecha);
        this.fecha = isNaN(timestamp) ? Date.now() : timestamp;
    } else {
        this.fecha = Date.now();
    }
    
    // NEW: Handle etiquetas - FIXED: Add directly without calling method
    this.etiquetas = [];
    if (etiquetas.length > 0) {
        // Add etiquetas directly, removing duplicates
        etiquetas.forEach(etiqueta => {
            if (!this.etiquetas.includes(etiqueta)) {
                this.etiquetas.push(etiqueta);
            }
        });
    }
}

// Original methods from Practical 1
CrearGasto.prototype.mostrarGasto = function() {
    return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`;
};

CrearGasto.prototype.actualizarDescripcion = function(nuevaDescripcion) {
    this.descripcion = nuevaDescripcion;
};

CrearGasto.prototype.actualizarValor = function(nuevoValor) {
    if (typeof nuevoValor === 'number' && nuevoValor >= 0) {
        this.valor = nuevoValor;
    }
};

// NEW: Additional methods for Practical 2
CrearGasto.prototype.mostrarGastoCompleto = function() {
    const fechaFormateada = new Date(this.fecha).toLocaleString();
    
    let etiquetasText = '';
    if (this.etiquetas.length > 0) {
        etiquetasText = this.etiquetas.map(etiqueta => `- ${etiqueta}`).join('\n');
    } else {
        etiquetasText = '(sin etiquetas)';
    }
    
    // Add a trailing newline after the etiquetas block to match test expected string
    return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.
Fecha: ${fechaFormateada}
Etiquetas:
${etiquetasText}
`;
};

CrearGasto.prototype.actualizarFecha = function(nuevaFecha) {
    const timestamp = Date.parse(nuevaFecha);
    if (!isNaN(timestamp)) {
        this.fecha = timestamp;
    }
    // If invalid, leave unchanged
};

CrearGasto.prototype.anyadirEtiquetas = function(...nuevasEtiquetas) {
    nuevasEtiquetas.forEach(etiqueta => {
        if (!this.etiquetas.includes(etiqueta)) {
            this.etiquetas.push(etiqueta);
        }
    });
};

CrearGasto.prototype.borrarEtiquetas = function(...etiquetasABorrar) {
    this.etiquetas = this.etiquetas.filter(etiqueta => 
        !etiquetasABorrar.includes(etiqueta)
    );
};

// NEW: Global functions for Practical 2
function listarGastos() {
    return gastos;
}

function anyadirGasto(gasto) {
    gasto.id = idGasto;
    idGasto++;
    gastos.push(gasto);
}

function borrarGasto(id) {
    const index = gastos.findIndex(gasto => gasto.id === id);
    if (index !== -1) {
        gastos.splice(index, 1);
    }
}

function calcularTotalGastos() {
    return gastos.reduce((total, gasto) => total + gasto.valor, 0);
}

function calcularBalance() {
    return presupuesto - calcularTotalGastos();
}

export {
    actualizarPresupuesto,
    mostrarPresupuesto,
    CrearGasto,
    presupuesto,
    // NEW: Export the new functions
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    calcularBalance
};