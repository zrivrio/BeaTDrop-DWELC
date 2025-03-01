import { Component, OnInit, AfterViewInit, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { MusicosService } from '../../../services/musicos.service';
import { Musico } from '../../../models/musicos';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-musicos',
  imports: [CommonModule, RouterModule, NavbarComponent, ReactiveFormsModule],
  templateUrl: './listar-musicos.component.html',
  styleUrls: ['./listar-musicos.component.css']
})
export class ListarMusicosComponent implements OnInit, AfterViewInit {
  musicos: Musico[] = [];
  private isBrowser: boolean;
  filtrosForm: FormGroup; 
  cargando: boolean = true; 
  private L: any;

  constructor(
    private musicosService: MusicosService,
    @Inject(PLATFORM_ID) private platformId: object, // Detecta si estamos en el navegador
    private fb: FormBuilder
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
   
    this.filtrosForm = this.fb.group({
      busqueda: [''],
    });
  }

  ngOnInit(): void {
    this.musicosService.getAllMusicos().subscribe(data => {
      console.log("Músicos:", data);
      this.musicos = data;
      this.cargando = false;
    });
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.isBrowser) {
      this.L = await import('leaflet');
      this.mostrarMapas();
    }
  }

  private mostrarMapas(): void {
    if (!this.isBrowser || !this.L) return;

    setTimeout(() => {
      this.musicos.forEach(musico => {
        const lat = musico.ubicacion.coordenadas.latitud;
        const lon = musico.ubicacion.coordenadas.longitud;
        const mapId = `map-${musico.id}`;

        const mapElement = document.getElementById(mapId);
        if (!mapElement) {
          console.error(`No se encontró el contenedor del mapa con ID: ${mapId}`);
          return;
        }

        const map = this.L.map(mapId).setView([lat, lon], 13);

        this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const iconoMusico = this.L.icon({
          iconUrl: 'assets/marcador.png',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40]
        });

        this.L.marker([lat, lon], { icon: iconoMusico }).addTo(map)
          .bindPopup(`<b>${musico.nombre}</b><br>${musico.ubicacion.ciudad}, ${musico.ubicacion.pais}`)
          .openPopup();
      });
    }, 100);
  }

  deleteMusico(id: number){
    this.musicos = this.musicos.filter(musico => musico.id !== id);
    this.musicosService.deleteMusico(id).subscribe();
  }

  getFilteredMusicos(): Musico[] {
    const busqueda = this.filtrosForm.value.busqueda.toLowerCase();
    return this.musicos.filter(musico =>
      musico.nombre.toLowerCase().includes(busqueda) ||
      musico.genero.toLowerCase().includes(busqueda) ||
      musico.nacionalidad.toLowerCase().includes(busqueda)
    );
  }
  
}
