import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Musico } from '../../../models/musicos';
import { MusicosService } from '../../../services/musicos.service';

@Component({
  selector: 'app-listar-musicos',
  imports: [RouterModule, CommonModule],
  templateUrl: './listar-musicos.component.html',
  styleUrl: './listar-musicos.component.css'
})
export class ListarMusicosComponent {
  musicos: Musico[] = [];

  constructor(private musicosService: MusicosService) {}

  ngOnInit(): void {
    this.musicosService.getAllMusicos().subscribe(data => {
      console.log("Músicos:", data);
      this.musicos = data;
    });
  }

}
