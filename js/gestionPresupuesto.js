let presupuesto = 0;


let gastos = [];
let idGasto = 0;


function actualizarPresupuesto(cantidad) {
    if (typeof cantidad === 'number' && cantidad >= 0) {
        presupuesto = cantidad;
        return presupuesto;
    } else {
        console.error("Error: El valor introducido no es un número válido");
        return -1;
    }
}


function mostrarPresupuesto() {
    return `tu presupuesto actual es de ${presupuesto} €`;
}


function CrearGasto(descripcion, valor, fecha, ...etiquetas) {
    
    if (typeof valor === 'number' && valor >= 0) {
        this.valor = valor;
    } else {
        this.valor = 0;
    }
    
    this.descripcion = descripcion;
    
    //  Handle date
    if (fecha) {
        const timestamp = Date.parse(fecha);
        this.fecha = isNaN(timestamp) ? Date.now() : timestamp;
    } else {
        this.fecha = Date.now();
    }
    
   
    this.etiquetas = [];
    if (etiquetas.length > 0) {
        
        etiquetas.forEach(etiqueta => {
            if (!this.etiquetas.includes(etiqueta)) {
                this.etiquetas.push(etiqueta);
            }
        });
    }
}


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

                            //  methods  Practical 2
CrearGasto.prototype.mostrarGastoCompleto = function() {
    const fechaFormateada = new Date(this.fecha).toLocaleString();
    
    let etiquetasText = '';
    if (this.etiquetas.length > 0) {
        etiquetasText = this.etiquetas.map(etiqueta => `- ${etiqueta}`).join('\n');
    } else {
        etiquetasText = '(sin etiquetas)';
    }
    
    
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

//  Practical 3
CrearGasto.prototype.obtenerPeriodoAgrupacion = function(periodo) {
    const date = new Date(this.fecha);
    
    switch(periodo) {
        case 'dia':
            return date.toISOString().split('T')[0]; 
        case 'mes':
            return date.toISOString().substring(0, 7); // yyyy-mm
        case 'anyo':
            return date.getFullYear().toString();
        default:
            return date.toISOString().substring(0, 7); 
    }
};


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

// Functions  3
function filtrarGastos(filtros = {}) {
    return gastos.filter(gasto => {
        
        if (filtros.fechaDesde) {
            const fechaDesdeTimestamp = Date.parse(filtros.fechaDesde);
            if (!isNaN(fechaDesdeTimestamp) && gasto.fecha < fechaDesdeTimestamp) {
                return false;
            }
        }
        
        
        if (filtros.fechaHasta) {
            const fechaHastaTimestamp = Date.parse(filtros.fechaHasta);
            if (!isNaN(fechaHastaTimestamp) && gasto.fecha > fechaHastaTimestamp) {
                return false;
            }
        }
        
        if (filtros.valorMinimo !== undefined && gasto.valor < filtros.valorMinimo) {
            return false;
        }
        
        
        if (filtros.valorMaximo !== undefined && gasto.valor > filtros.valorMaximo) {
            return false;
        }
        
        
        if (filtros.descripcionContiene) {
            const descripcionLower = gasto.descripcion.toLowerCase();
            const busquedaLower = filtros.descripcionContiene.toLowerCase();
            if (!descripcionLower.includes(busquedaLower)) {
                return false;
            }
        }
        
        
        if (filtros.etiquetasTiene && filtros.etiquetasTiene.length > 0) {
            const tieneEtiqueta = filtros.etiquetasTiene.some(etiquetaFiltro => 
                gasto.etiquetas.some(etiquetaGasto => 
                    etiquetaGasto.toLowerCase() === etiquetaFiltro.toLowerCase()
                )
            );
            if (!tieneEtiqueta) {
                return false;
            }
        }
        
        return true;
    });
}

function agruparGastos(periodo = 'mes', etiquetas = [], fechaDesde, fechaHasta) {

    const filtros = {};
    
    if (fechaDesde) filtros.fechaDesde = fechaDesde;
    if (fechaHasta) filtros.fechaHasta = fechaHasta;
    if (etiquetas.length > 0) filtros.etiquetasTiene = etiquetas;
    
   
    const gastosFiltrados = filtrarGastos(filtros);
    
    
    const agrupacion = gastosFiltrados.reduce((acumulador, gasto) => {
        const periodoKey = gasto.obtenerPeriodoAgrupacion(periodo);
        
        if (!acumulador[periodoKey]) {
            acumulador[periodoKey] = 0;
        }
        
        acumulador[periodoKey] += gasto.valor;
        
        return acumulador;
    }, {});
    
    return agrupacion;
}

export {
    actualizarPresupuesto,
    mostrarPresupuesto,
    CrearGasto,
    presupuesto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    calcularBalance,
    // this functions for Practical 3
    filtrarGastos,
    agruparGastos
};