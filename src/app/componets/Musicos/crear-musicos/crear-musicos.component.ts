import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Musico } from '../../../models/musicos';
import { MusicosService } from '../../../services/musicos.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { Router } from '@angular/router';


@Component({
  selector: 'app-crear-musicos',
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent],
  templateUrl: './crear-musicos.component.html',
  styleUrl: './crear-musicos.component.css'
})
export class CrearMusicosComponent {
  musicoForm: FormGroup
  numMusico: number = 0;

  constructor(private fb: FormBuilder, private musicosService: MusicosService, private router: Router) {
    this.musicoForm = this.fb.group({
      nombre: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      genero: ['', Validators.required],
      anio_debut: [null, Validators.required],
      instrumentos: this.fb.array([]),  
      premios: this.fb.array([]),
      pais: ['', Validators.required],
      ciudad: ['', Validators.required],
      latitud: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitud: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      retirado: [false],
      imagen_url: ['']
    });
    this.musicosService.getAllMusicos().subscribe(musicos => {
      this.numMusico = musicos.length;
    });
  }

  get instrumentos() {
    return this.musicoForm.get('instrumentos') as FormArray;
  }

  get premios() {
    return this.musicoForm.get('premios') as FormArray;
  }

  agregarInstrumento() {
    this.instrumentos.push(this.fb.control('', Validators.required));
  }

  eliminarInstrumento(index: number) {
    this.instrumentos.removeAt(index);
  }

  agregarPremio() {
    this.premios.push(this.fb.control('', Validators.required));
  }

  eliminarPremio(index: number) {
    this.premios.removeAt(index);
  }


  onSubmit() {
    if (this.musicoForm.valid) {
      const nuevoMusico: Musico = {
        id: this.numMusico + 1,
        ...this.musicoForm.value,
        ubicacion: {
          pais: this.musicoForm.value.pais,
          ciudad: this.musicoForm.value.ciudad,
          coordenadas: {
            latitud: this.musicoForm.value.latitud,
            longitud: this.musicoForm.value.longitud
          }
        }
      };

     this.musicosService.addMusico(nuevoMusico).subscribe(() => {
      console.log("Músico agregado:", nuevoMusico);
     });
      
      this.router.navigate(['/musicos']);
    }
  }
 
}
