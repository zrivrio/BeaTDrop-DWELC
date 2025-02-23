import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlbumesService } from '../../../services/albumes.service';
import { MusicosService } from '../../../services/musicos.service';
import { Musico } from '../../../models/musicos';
import { CommonModule } from '@angular/common';
import { Album } from '../../../models/albumes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-albumes',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crear-albumes.component.html',
  styleUrl: './crear-albumes.component.css'
})
export class CrearAlbumesComponent {
  albumForm: FormGroup;
  musicos: Musico[] = [];

  constructor(private fb: FormBuilder, 
    private albumService: AlbumesService, 
    private musicoService: MusicosService,
    private router: Router) {
    this.albumForm = this.fb.group({
      musico_id: ['', Validators.required],
      titulo: ['', Validators.required],
      anio_lanzamiento: ['', [Validators.required, Validators.min(1900)]],
      canciones: ['', [Validators.required, Validators.min(1)]],
      duracion_total: ['', Validators.required],
      genero: ['', Validators.required],
      imagen_url: [null], 
    });
  }

  ngOnInit(): void {
   this.musicoService.getAllMusicos().subscribe((musicos) => {
    this.musicos = musicos;
    });

  }

  onSubmit(): void {
    if (this.albumForm.valid) {
      console.log('Formulario enviado:', this.albumForm.value);
    
      // Obtener la lista de álbumes (suponiendo que ya la tienes)
      this.albumService.getAllAlbumes().subscribe((albumes) => {
        // Filtrar los álbumes del músico actual
        const albumesDelMusico = albumes.filter(
          (album) => album.musico_id === this.albumForm.value.musico_id
        );
    
        // Obtener el último ID de los álbumes del músico
        const lastId = albumesDelMusico.length > 0
          ? Math.max(...albumesDelMusico.map((a) => +a.id)) // Convertir a número
          : 0;
    
        // Generar el nuevo ID sumando 1 al último ID
        const newId = lastId + 1;
    
        // Crear el nuevo álbum
        const newAlbum: Album = {
          id: newId, 
          musico_id: Number(this.albumForm.value.musico_id),
          titulo: this.albumForm.value.titulo,
          anio_lanzamiento: this.albumForm.value.anio_lanzamiento,
          duracion_total: this.albumForm.value.duracion_total,
          canciones: this.albumForm.value.canciones,
          genero: this.albumForm.value.genero,
          imagen_url: this.albumForm.value.imagen_url,
        };
    
       
        this.albumService.addAlbum(newAlbum).subscribe((res) => {
          console.log('Álbum creado:', res);
        });
      });
      this.router.navigate(['/albumes']);
      
    } else {
      console.log('Formulario no válido');
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.albumForm.patchValue({
      imagen_url: file,
    });
  }
}
