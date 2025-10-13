// Variable global para el presupuesto
let presupuesto = 0;

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

// Función constructora para crear gastos - PROPER CONSTRUCTOR
function CrearGasto(descripcion, valor) {
    // Validar que el valor sea un número no negativo
    if (typeof valor === 'number' && valor >= 0) {
        this.valor = valor;
    } else {
        this.valor = 0;
    }
    
    this.descripcion = descripcion;
}

// Añadir métodos al prototipo (mejor práctica)
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
    // Si no es válido, no hace nada (mantiene el valor anterior)
};

// Exportación de funciones
export {
    actualizarPresupuesto,
    mostrarPresupuesto,
    CrearGasto,
    presupuesto
};