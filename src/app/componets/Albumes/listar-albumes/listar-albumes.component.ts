import { Component, inject, OnInit } from '@angular/core';
import { AlbumesService } from '../../../services/albumes.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Musico } from '../../../models/musicos';
import { MusicosService } from '../../../services/musicos.service';
import { Album } from '../../../models/albumes';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';



@Component({
  selector: 'app-listar-albumes',
  imports: [CommonModule, RouterModule, NavbarComponent, ReactiveFormsModule],
  templateUrl: './listar-albumes.component.html',
  styleUrl: './listar-albumes.component.css'
})
export class ListarAlbumesComponent implements OnInit {
  musicos: Musico[] = [];
  albumes: Album[] = []; 
  filtrosForm: FormGroup; 
  cargando: boolean = true; 

  private albumesService: AlbumesService = inject(AlbumesService);
  private musicosService: MusicosService = inject(MusicosService);

  constructor(private fb: FormBuilder) {
    // Inicializar el formulario reactivo
    this.filtrosForm = this.fb.group({
      busqueda: [''],
    });
  }

  ngOnInit(): void {
    // Obtener la lista de músicos
    this.musicosService.getAllMusicos().subscribe((data) => {
      this.musicos = data;
      this.cargando = false;
    });

    // Obtener la lista de álbumes
    this.albumesService.getAllAlbumes().subscribe((data) => {
      this.albumes = data;
      this.cargando = false;
    });

  }

  // Función para obtener los álbumes de un músico específico
  getAlbumesByMusicoId(musicoId: number): Album[] {
    const { busqueda, genero } = this.filtrosForm.value;
    return this.albumes.filter((album) => {
      const coincideMusico = Number(album.musico_id) === Number(musicoId);
      const coincideBusqueda = album.titulo.toLowerCase().includes(busqueda.toLowerCase());
      const coincideGenero = !genero || album.genero === genero;
      return coincideMusico && coincideBusqueda && coincideGenero;
    });
  }

  // Función para eliminar los álbumes
  deleteAlbum(id: number): void {
    this.albumes = this.albumes.filter((album) => album.id !== id);
    this.albumesService.deleteAlbum(id).subscribe();
  }


}
