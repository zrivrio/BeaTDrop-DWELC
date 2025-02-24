import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Musico } from '../../../models/musicos';
import { AlbumesService } from '../../../services/albumes.service';
import { MusicosService } from '../../../services/musicos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from '../../../models/albumes';
import { NavbarComponent } from "../../navbar/navbar.component";

@Component({
  selector: 'app-editar-albumes',
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent],
  templateUrl: './editar-albumes.component.html',
  styleUrl: './editar-albumes.component.css',
})
export class EditarAlbumesComponent {
  albumForm: FormGroup;
  musicos: Musico[] = [];
  album: Album | undefined;

  constructor(
    private fb: FormBuilder,
    private albumService: AlbumesService,
    private musicoService: MusicosService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.albumForm = this.fb.group({
      musico_id: ['', Validators.required],
      titulo: ['', Validators.required],
      anio_lanzamiento: ['', Validators.required],
      canciones: ['', Validators.required],
      duracion_total: ['', Validators.required],
      genero: ['', Validators.required],
      imagen_url: [null],
    });
  }

  ngOnInit(): void {
    this.musicoService.getAllMusicos().subscribe((musicos) => {
      this.musicos = musicos;
    });

    const idAlbum = this.route.snapshot.paramMap.get('idAlbum');
    this.albumService.getAlbum(Number(idAlbum)).subscribe((albumGet) => {
      this.album = albumGet;
      this.albumForm.patchValue({
        musico_id: albumGet.musico_id,
        titulo: albumGet.titulo,
        anio_lanzamiento: albumGet.anio_lanzamiento,
        canciones: albumGet.canciones,
        duracion_total: albumGet.duracion_total,
        genero: albumGet.genero,
        imagen_url: albumGet.imagen_url,
      });
    });
  }

  onSubmit(): void {
    if (this.albumForm.valid && this.album) {
      const albumActualizado: Album = {
        ...this.album,
        ...this.albumForm.value,
      };

      this.albumService.updateAlbum(albumActualizado).subscribe({});
      this.router.navigate(['/albumes']);
    }   
  }  


}