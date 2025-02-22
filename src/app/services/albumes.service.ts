import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Musico } from '../models/musicos';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Album } from '../models/albumes';

@Injectable({
  providedIn: 'root'
})
export class AlbumesService {
  //private musicosSubject = new BehaviorSubject<Musico[]>([]);

  private url = 'http://localhost:3000/albumes';

  constructor(private http:HttpClient) {
    //this.loadAlbumes();
  }

  // Método para obtener la lista de músicos con sus álbumes
  // getMusicos() {
  //   return this.musicosSubject.asObservable();
  // }

  // Carga los álbumes desde el servidor
  // private async loadAlbumes() {
  //   try {
  //     const response = await fetch('http://localhost:3000/albumes');
  //     const data = await response.json();

  //     console.log("Datos recibidos:", data); // Para verificar la estructura
  //     this.musicosSubject.next(data); // Guardamos la lista de músicos con sus álbumes
  //   } catch (error) {
  //     console.error('Error al cargar los álbumes:', error);
  //   }
  // }

  getAllAlbumes() {return this.http.get<Album[]>(this.url)}

  getAlbum(id: number) { return this.http.get<Album>(`${this.url}/${id}`); }

  addAlbum(album: Album) { return this.http.post<Album>(this.url, album); }

  updateAlbum(album: Album) { return this.http.put<Album>(`${this.url}/${album.id}`, album); }

  deleteAlbum(id: number) {
    return this.http.delete(`${this.url}/${id}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

}