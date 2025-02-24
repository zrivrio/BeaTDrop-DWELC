import { Component, OnInit } from '@angular/core';
import { Musico } from '../../../models/musicos';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MusicosService } from '../../../services/musicos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";

@Component({
  selector: 'app-editar-musicos',
imports: [ReactiveFormsModule, CommonModule, NavbarComponent],
  templateUrl: './editar-musicos.component.html',
  styleUrls: ['./editar-musicos.component.css']
})
export class EditarMusicosComponent implements OnInit {

  musicoForm: FormGroup;
  numMusico: number = 0;
  musicoId: number = 0;

  constructor(
    private fb: FormBuilder,
    private musicosService: MusicosService,
    private router: Router,
    private route: ActivatedRoute // ActivatedRoute para acceder a los parámetros de la URL
  ) {
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
  }

  ngOnInit(): void {
    // Obtener el ID del músico desde la URL
    this.musicoId = Number(this.route.snapshot.paramMap.get('id'));

    // Cargar los datos del músico desde el servicio
    this.musicosService.getMusico(this.musicoId).subscribe(musico => {
      this.musicoForm.patchValue({
        nombre: musico.nombre,
        nacionalidad: musico.nacionalidad,
        genero: musico.genero,
        anio_debut: musico.anio_debut,
        pais: musico.ubicacion.pais,
        ciudad: musico.ubicacion.ciudad,
        latitud: musico.ubicacion.coordenadas.latitud,
        longitud: musico.ubicacion.coordenadas.longitud,
        retirado: musico.retirado,
        imagen_url: musico.imagen_url
      });

      // Rellenar instrumentos y premios
      musico.instrumentos.forEach(instrumento => this.agregarInstrumento(instrumento));
      musico.premios.forEach(premio => this.agregarPremio(premio));
    });
  }

  get instrumentos() {
    return this.musicoForm.get('instrumentos') as FormArray;
  }

  get premios() {
    return this.musicoForm.get('premios') as FormArray;
  }

  agregarInstrumento(instrumento: string = '') {
    this.instrumentos.push(this.fb.control(instrumento, Validators.required));
  }

  eliminarInstrumento(index: number) {
    this.instrumentos.removeAt(index);
  }

  agregarPremio(premio: string = '') {
    this.premios.push(this.fb.control(premio, Validators.required));
  }

  eliminarPremio(index: number) {
    this.premios.removeAt(index);
  }

  onSubmit() {
    if (this.musicoForm.valid) {
      const updatedMusico: Musico = {
        id: this.musicoId,
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

      this.musicosService.updateMusico(updatedMusico).subscribe(() => {
        console.log("Músico actualizado:", updatedMusico);
      });

      this.router.navigate(['/musicos']);
    }
  }
}
