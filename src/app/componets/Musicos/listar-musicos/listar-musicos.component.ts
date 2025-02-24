import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MusicosService } from '../../../services/musicos.service';
import { Musico } from '../../../models/musicos';
import { CommonModule } from '@angular/common';
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

  constructor(private musicosService: MusicosService) {}

  ngOnInit(): void {
    this.musicosService.getAllMusicos().subscribe(data => {
      console.log("Músicos:", data);
      this.musicos = data;
    });
  }

  ngAfterViewInit(): void {
    this.mostrarMapas(); // Llamamos a mostrarMapas cuando la vista se haya cargado
  }

  mostrarMapas(): void {
    // Usar import dinámico para cargar Leaflet solo en el navegador
    import('leaflet').then(L => {
      this.musicos.forEach(musico => {
        const lat = musico.ubicacion.coordenadas.latitud;
        const lon = musico.ubicacion.coordenadas.longitud;

        // Crear un mapa para cada músico
        const map = L.map('map-' + musico.id).setView([lat, lon], 13); // Asumiendo zoom 13

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Crear un marcador para cada ubicación
        L.marker([lat, lon]).addTo(map)
          .bindPopup(`<b>${musico.nombre}</b><br>${musico.ubicacion.ciudad}, ${musico.ubicacion.pais}`)
          .openPopup();
      });
    }).catch(err => {
      console.error('Error cargando Leaflet:', err);
    });
  }

  deleteMusico(id: number): void {
    this.musicos = this.musicos.filter(musico => musico.id !== id);
    this.musicosService.deleteMusico(id).subscribe();
  }
}
