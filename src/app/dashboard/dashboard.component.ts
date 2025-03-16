import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

interface EstadisticaRaw {
  id: number;
  _id: string;
  Anio: number;
  ID_mes: number;
  Transporte: string;
  Variable: string;
  Valor: string;
  Entidad: string;
  Municipio: string;
  Estatus: string;
  fechaCarga: string;
}

interface Estadistica {
  anio: number;
  mes: number;
  transporte: string;
  ingresosPorPasaje: number;
  kilometrosRecorridos: number;
  longitudServicio: number;
  pasajerosTransportados: number;
  unidadesOperacion: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
})
export default class DashboardComponent implements OnInit {
  filtros = {
    anioInicio: null as number | null,
    anioFin: null as number | null,
    mesInicio: null as number | null,
    mesFin: null as number | null,
    transporte: 'Tren Eléctrico', // Valor inicial, puede cambiarse
  };
  estadisticas: Estadistica[] = [];
  transportes: string[] = []; // Ahora será llenado desde la API
  cargando = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarTiposTransporte(); // Cargar los tipos de transporte al iniciar
  }

  // Nueva función para cargar los tipos de transporte
  cargarTiposTransporte() {
    const url = 'http://localhost:3000/transporte/tipos-transporte';
    this.http.get<string[]>(url).subscribe({
      next: (data) => {
        this.transportes = ['Todos', ...data]; // Agregar "Todos" como opción inicial
      },
      error: (err) => {
        console.error('Error al cargar tipos de transporte:', err);
        // Fallback a lista estática en caso de error
        this.transportes = [
          'Todos',
          'Tren Eléctrico',
          'Macrobús Servicio Alimentador',
          'Mi Transporte Eléctrico',
          'MI Macro Periférico Alimentador',
          'Trolebús',
          'Sistema Integral del Tren Ligero',
          'Mi Macro Periférico Troncal',
          'Macrobús Servicio Troncal',
        ];
      },
    });
  }

  cargarEstadisticas() {
    if (!this.filtros.anioInicio || !this.filtros.anioFin || !this.filtros.mesInicio || !this.filtros.mesFin) {
      alert('Por favor, completa todos los filtros.');
      return;
    }

    this.cargando = true;
    let url = `http://localhost:3000/transporte/estadisticas?anioInicio=${this.filtros.anioInicio}&anioFin=${this.filtros.anioFin}&mesInicio=${this.filtros.mesInicio}&mesFin=${this.filtros.mesFin}`;
    if (this.filtros.transporte !== 'Todos') {
      url += `&transporte=${encodeURIComponent(this.filtros.transporte)}`;
    }

    this.http.get<{ datosFiltrados: EstadisticaRaw[] }>(url).subscribe({
      next: (response) => {
        this.estadisticas = this.transformarDatos(response.datosFiltrados);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar estadísticas:', err);
        alert('Hubo un error al cargar los datos.');
        this.cargando = false;
      },
    });
  }

  transformarDatos(data: EstadisticaRaw[]): Estadistica[] {
    const resultado: { [key: string]: Estadistica } = {};

    data.forEach((item) => {
      const key = `${item.Anio}-${item.ID_mes}-${item.Transporte}`;
      if (!resultado[key]) {
        resultado[key] = {
          anio: item.Anio,
          mes: item.ID_mes,
          transporte: item.Transporte,
          ingresosPorPasaje: 0,
          kilometrosRecorridos: 0,
          longitudServicio: 0,
          pasajerosTransportados: 0,
          unidadesOperacion: 0,
        };
      }

      const valor = parseFloat(item.Valor) || 0;
      switch (item.Variable) {
        case 'Ingresos por pasaje':
          resultado[key].ingresosPorPasaje = valor;
          break;
        case 'Kilómetros recorridos':
          resultado[key].kilometrosRecorridos = valor;
          break;
        case 'Longitud de servicio':
          resultado[key].longitudServicio = valor;
          break;
        case 'Pasajeros transportados':
          resultado[key].pasajerosTransportados = valor;
          break;
        case 'Unidades en operación':
          resultado[key].unidadesOperacion = valor;
          break;
      }
    });

    return Object.values(resultado);
  }

  aplicarFiltros() {
    this.cargarEstadisticas();
  }

  // Nuevas funciones para el dashboard mejorado
  getNombreMes(numeroMes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[numeroMes - 1];
  }

  getTotalPasajeros(): number {
    return this.estadisticas.reduce((total, est) => total + est.pasajerosTransportados, 0);
  }

  getTotalKilometros(): number {
    return this.estadisticas.reduce((total, est) => total + est.kilometrosRecorridos, 0);
  }

  getTotalIngresos(): number {
    return this.estadisticas.reduce((total, est) => total + est.ingresosPorPasaje, 0);
  }

  getPromedioUnidades(): number {
    if (this.estadisticas.length === 0) return 0;
    const total = this.estadisticas.reduce((total, est) => total + est.unidadesOperacion, 0);
    return total / this.estadisticas.length;
  }

  getPeriodoTexto(): string {
    if (!this.filtros.anioInicio || !this.filtros.anioFin || !this.filtros.mesInicio || !this.filtros.mesFin) {
      return 'Período no seleccionado';
    }
    
    const mesInicio = this.getNombreMes(this.filtros.mesInicio);
    const mesFin = this.getNombreMes(this.filtros.mesFin);
    
    if (this.filtros.anioInicio === this.filtros.anioFin) {
      return `${mesInicio} - ${mesFin} ${this.filtros.anioInicio}`;
    }
    
    return `${mesInicio} ${this.filtros.anioInicio} - ${mesFin} ${this.filtros.anioFin}`;
  }
}