import { Component, OnInit, AfterViewInit, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { MusicosService } from '../../../services/musicos.service';
import { Musico } from '../../../models/musicos';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-listar-musicos',
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './listar-musicos.component.html',
  styleUrls: ['./listar-musicos.component.css']
})
export class ListarMusicosComponent implements OnInit, AfterViewInit {
  musicos: Musico[] = [];
  private isBrowser: boolean;

  constructor(
    private musicosService: MusicosService,
    @Inject(PLATFORM_ID) private platformId: object // Detecta si estamos en el navegador
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.musicosService.getAllMusicos().subscribe(data => {
      console.log("Músicos:", data);
      this.musicos = data;
    });
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.mostrarMapas();
    }
  }

  mostrarMapas(): void {
    if (!this.isBrowser) {
      return; // Evita la ejecución en el servidor
    }

    import('leaflet').then(L => {
      this.musicos.forEach(musico => {
        const lat = musico.ubicacion.coordenadas.latitud;
        const lon = musico.ubicacion.coordenadas.longitud;
        const mapId = `map-${musico.id}`;

        const mapElement = document.getElementById(mapId);
        if (!mapElement) {
          console.error(`No se encontró el contenedor del mapa con ID: ${mapId}`);
          return;
        }

        const map = L.map(mapId).setView([lat, lon], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Definir un icono personalizado
        const iconoMusico = L.icon({
          iconUrl: 'assets/icono-musico.png',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40]
        });

        // Agregar marcador con icono personalizado
        L.marker([lat, lon], { icon: iconoMusico }).addTo(map)
          .bindPopup(`<b>${musico.nombre}</b><br>${musico.ubicacion.ciudad}, ${musico.ubicacion.pais}`)
          .openPopup();
      });
    }).catch(err => {
      console.error('Error cargando Leaflet:', err);
    });
  }

  deleteMusico(id: number){

    this.musicos = this.musicos.filter(musico => musico.id !== id);
    this.musicosService.deleteMusico(id).subscribe();
  }
}
