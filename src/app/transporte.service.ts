import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransporteService {
  private apiUrl = 'http://localhost:3000/transporte/estadisticas?anioInicio=2020&anioFin=2023&mesInicio=1&mesFin=1&transporte=Tren%20El%C3%A9ctrico'; // Reemplaza con la URL real

  constructor(private http: HttpClient) {}

  obtenerDatos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
