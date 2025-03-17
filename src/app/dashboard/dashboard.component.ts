import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

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
  imports: [HeaderComponent, CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
})
export default class DashboardComponent implements OnInit {
  filtros = {
    anioInicio: null as number | null,
    anioFin: null as number | null,
    mesInicio: null as number | null,
    mesFin: null as number | null,
    transporte: 'Tren Eléctrico',
    estadistica: 'Todas' as string,
  };
  estadisticas: Estadistica[] = [];
  transportes: string[] = [];
  estadisticasDisponibles: string[] = [
    'Todas',
    'Ingresos por pasaje',
    'Kilómetros recorridos',
    'Longitud de servicio',
    'Pasajeros transportados',
    'Unidades en operación',
  ];
  cargando = false;

  // Configuración de la gráfica con ng2-charts
  mostrarGrafica = false; // Inicialmente oculto
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: '',
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
    ],
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Meses/Años',
        },
      },
    },
  };
  public lineChartType: ChartType = 'line';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarTiposTransporte();
  }

  cargarTiposTransporte() {
    const url = 'http://localhost:3000/transporte/tipos-transporte';
    this.http.get<string[]>(url).subscribe({
      next: (data) => {
        this.transportes = ['Todos', ...data];
      },
      error: (err) => {
        console.error('Error al cargar tipos de transporte:', err);
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
    if (this.filtros.estadistica !== 'Todas') {
      url += `&estadistica=${encodeURIComponent(this.filtros.estadistica)}`;
    }

    this.http.get<{ datosFiltrados: EstadisticaRaw[] }>(url).subscribe({
      next: (response) => {
        this.estadisticas = this.transformarDatos(response.datosFiltrados);
        this.cargando = false;
        // No mostramos la gráfica aquí, solo preparamos los datos si es necesario
        if (this.filtros.transporte !== 'Todos' && this.filtros.estadistica !== 'Todas') {
          this.prepararDatosGrafica(); // Separamos la preparación de datos
        }
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
    this.mostrarGrafica = false; // Ocultar la gráfica al aplicar nuevos filtros
  }

  getNombreMes(numeroMes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
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

  // Nueva función para preparar los datos de la gráfica sin mostrarla
  prepararDatosGrafica() {
    const labels = this.estadisticas.map(est => `${this.getNombreMes(est.mes)} ${est.anio}`);
    let data: number[] = [];

    switch (this.filtros.estadistica) {
      case 'Ingresos por pasaje':
        data = this.estadisticas.map(est => est.ingresosPorPasaje);
        break;
      case 'Kilómetros recorridos':
        data = this.estadisticas.map(est => est.kilometrosRecorridos);
        break;
      case 'Longitud de servicio':
        data = this.estadisticas.map(est => est.longitudServicio);
        break;
      case 'Pasajeros transportados':
        data = this.estadisticas.map(est => est.pasajerosTransportados);
        break;
      case 'Unidades en operación':
        data = this.estadisticas.map(est => est.unidadesOperacion);
        break;
    }

    this.lineChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          label: `${this.filtros.estadistica} - ${this.filtros.transporte}`,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: false,
        },
      ],
    };

    this.lineChartOptions = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: this.filtros.estadistica,
          },
        },
        x: {
          title: {
            display: true,
            text: 'Meses/Años',
          },
        },
      },
    };
  }

  // Función para mostrar la gráfica al presionar el botón
  mostrarGraficaClick() {
    if (this.filtros.transporte !== 'Todos' && this.filtros.estadistica !== 'Todas') {
      this.mostrarGrafica = true;
    } else {
      alert('Por favor, selecciona un transporte y una estadística específica para mostrar la gráfica.');
      this.mostrarGrafica = false;
    }
  }
}