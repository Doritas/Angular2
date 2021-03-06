import { Component, OnInit } from '@angular/core';
//import { Movimiento, Maestro } from './datos.model';
import { MaestroModel, MaestroTipoModel, Movimiento } from './datos.model';
import { DatosService } from './datos.service';
import { Observable } from 'rxjs/Observable';

// Será un componente inteligente (statefull), con acceso a datos
@Component({
  selector: 'app-movimientos', // ojo al prefijo, por defecto app
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent implements OnInit {
  // Todos los datos necesarios se gestionana en el componente 
  tiposEnElContenedor: MaestroModel[] = [];
  categorias: MaestroTipoModel[] = [];
  movimiento: Movimiento;
  movimientos: Movimiento[];
  movimientos$ : Observable<Movimiento[]>;

  // las dependencias se declaran como parámetros del constructor
  /** Depende del servicio de datos */
  constructor(private datosService: DatosService) { }

  /** Al arrancar, obtiene datos estáticos y suscripciones a otros vivos */  
  ngOnInit() {
    this.movimiento = this.datosService.getNuevoMovimiento();
    this.tiposEnElContenedor = this.datosService.getTipos();
    this.categorias = this.datosService.getCategoriasPorTipo(this.movimiento.tipo);
    this.movimientos$ = this.datosService.getMovimientos$();
    this.movimientos$.subscribe(d => this.movimientos = d);
    this.movimientos$.subscribe(function (valorConcretoDelArrayDeMovimientos) {
      this.movimientos = valorConcretoDelArrayDeMovimientos;
    });
  }

  /** Cuando ocurre un cambio en el tipo de movimiento */  
  cambiarTipoDelMovimiento() {
    this.categorias = this.datosService.getCategoriasPorTipo(this.movimiento.tipo);
    // Cambios en el tipo, crean cambios en la categoría
    this.movimiento.categoria = this.datosService.getCategoriaBase(this.movimiento.tipo);
  }
  /** Cuando se quiere guardar un movimiento */
  guardarMovimiento() {
    console.log(`Guardando ${JSON.stringify(this.movimiento)}`);
    this.datosService.postMovimiento(this.movimiento);
  }
}
