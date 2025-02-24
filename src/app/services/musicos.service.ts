import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Musico } from '../models/musicos';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MusicosService {
 // private musicosSubject = new BehaviorSubject<Musico[]>([]);

 private url = 'http://localhost:3000/musicos';

  constructor( private http : HttpClient) {
  //  this.loadMusicos();
  }

  // Método para obtener la lista de músicos como Observable
  //getMusicos() {
  //  return this.musicosSubject.asObservable();
  //}

  // Cargar músicos desde el servidor usando async/await
  // private async loadMusicos() {
  //   try {
  //     const response = await fetch('http://localhost:3000/musicos');
  //     const data = await response.json();

  //     console.log("Datos recibidos:", data); // Verificar la estructura en consola
  //     this.musicosSubject.next(data); // Guardamos la lista de músicos
  //   } catch (error) {
  //     console.error('Error al cargar los músicos:', error);
  //   }
  // }


   getAllMusicos() {return this.http.get<Musico[]>(this.url)}
  
    getMusico(id: number) { return this.http.get<Musico>(`${this.url}/${id}`); }
  
    addMusico(musico: Musico) { return this.http.post<Musico>(this.url, musico); }
  
    updateMusico(musico: Musico) { return this.http.put<Musico>(`${this.url}/${musico.id}`, musico); }
  
    deleteMusico(id: number) { return this.http.delete(`${this.url}/${id}`); }


}
