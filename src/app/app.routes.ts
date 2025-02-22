import { Routes } from '@angular/router';
import { ListarMusicosComponent } from './componets/Musicos/listar-musicos/listar-musicos.component';
import { ListarAlbumesComponent } from './componets/Albumes/listar-albumes/listar-albumes.component';
import { HomeComponent } from './componets/home/home.component';
import { CrearMusicosComponent } from './componets/Musicos/crear-musicos/crear-musicos.component';
import { EditarMusicosComponent } from './componets/Musicos/editar-musicos/editar-musicos.component';
import { CrearAlbumesComponent } from './componets/Albumes/crear-albumes/crear-albumes.component';
import { EditarAlbumesComponent } from './componets/Albumes/editar-albumes/editar-albumes.component';

export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'musicos', component:ListarMusicosComponent},
    {path:'albumes', component:ListarAlbumesComponent},
    {path:'musicos/crear', component:CrearMusicosComponent},
    {path:'musicos/editar/:idMusico', component:EditarMusicosComponent},
    {path:'albumes/crear', component:CrearAlbumesComponent},
    {path:'albumes/editar/:idAlbum', component:EditarAlbumesComponent}


];