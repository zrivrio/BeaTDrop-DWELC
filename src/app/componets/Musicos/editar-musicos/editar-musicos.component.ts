import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MusicosService } from '../../../services/musicos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Musico } from '../../../models/musicos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-musicos',
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './editar-musicos.component.html',
  styleUrl: './editar-musicos.component.css'
})
export class EditarMusicosComponent {
  musicoForm: FormGroup;
  musicoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private musicosService: MusicosService,
    private router: Router,
    private route: ActivatedRoute
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
      imagen_url: [''],
    });
  }

  ngOnInit(): void {
    this.musicoId = Number(this.route.snapshot.paramMap.get('idMusico'));

    if (this.musicoId) {
      this.musicosService.getMusico(this.musicoId).subscribe((musico) => {
        this.cargarDatosEnFormulario(musico);
      });
    }
  }

  cargarDatosEnFormulario(musico: Musico): void {
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
      imagen_url: musico.imagen_url,
    });

    musico.instrumentos.forEach((instrumento) => {
      this.instrumentos.push(this.fb.control(instrumento, Validators.required));
    });

    musico.premios.forEach((premio) => {
      this.premios.push(this.fb.control(premio, Validators.required));
    });
  }

  get instrumentos(): FormArray {
    return this.musicoForm.get('instrumentos') as FormArray;
  }

  get premios(): FormArray {
    return this.musicoForm.get('premios') as FormArray;
  }

  agregarInstrumento(): void {
    this.instrumentos.push(this.fb.control('', Validators.required));
  }

  eliminarInstrumento(index: number): void {
    this.instrumentos.removeAt(index);
  }

  agregarPremio(): void {
    this.premios.push(this.fb.control('', Validators.required));
  }

  eliminarPremio(index: number): void {
    this.premios.removeAt(index);
  }

  onSubmit(): void {
    if (this.musicoForm.valid) {
      const musicoActualizado: Musico = {
        id: this.musicoId!,
        ...this.musicoForm.value,
        ubicacion: {
          pais: this.musicoForm.value.pais,
          ciudad: this.musicoForm.value.ciudad,
          coordenadas: {
            latitud: this.musicoForm.value.latitud,
            longitud: this.musicoForm.value.longitud,
          },
        },
      };

      this.musicosService.updateMusico(musicoActualizado).subscribe(() => {
        this.router.navigate(['/musicos']);
      });
    }
  }
}
