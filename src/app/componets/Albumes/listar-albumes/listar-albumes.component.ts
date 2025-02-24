import { Component, inject, OnInit } from '@angular/core';
import { AlbumesService } from '../../../services/albumes.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Musico } from '../../../models/musicos';
import { MusicosService } from '../../../services/musicos.service';
import { Album } from '../../../models/albumes';
import { NavbarComponent } from "../../navbar/navbar.component";



@Component({
  selector: 'app-listar-albumes',
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './listar-albumes.component.html',
  styleUrl: './listar-albumes.component.css'
})
export class ListarAlbumesComponent implements OnInit {
  musicos: Musico[] = []; // Lista de músicos
  albumes: Album[] = [];

  private albumesService: AlbumesService = inject(AlbumesService);
  private musicosService: MusicosService = inject(MusicosService);

  constructor() {}

  ngOnInit(): void {
    // Obtener la lista de músicos
    this.musicosService.getAllMusicos().subscribe((data) => {
      this.musicos = data;
    });

    // Obtener la lista de álbumes
    this.albumesService.getAllAlbumes().subscribe((data) => {
      this.albumes = data;
    });
  }

  // Función para obtener los álbumes de un músico específico
  getAlbumesByMusicoId(musicoId: number): Album[] {
    return this.albumes.filter((album) => Number(album.musico_id)=== Number( musicoId));
  }

  // Función para eliminar los álbumes
  deleteAlbum(id: number): void {
   this.albumes = this.albumes.filter((album) => album.id !== id);
   console.log(this.albumes);
  }

}
