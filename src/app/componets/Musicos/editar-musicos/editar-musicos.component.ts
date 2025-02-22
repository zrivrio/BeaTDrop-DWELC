import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: 'app-editar-musicos',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './editar-musicos.component.html',
  styleUrl: './editar-musicos.component.css'
})
export class EditarMusicosComponent {

}
