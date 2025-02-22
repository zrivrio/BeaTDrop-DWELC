import { Album } from "./albumes";
import { Ubicacion } from "./ubicacion";

export interface Musico {
  id: number; 
  nombre: number; 
  genero: string; 
  nacionalidad: string;
  anio_debut: number; 
  instrumentos: string[]; 
  premios: string[]; 
  retirado: boolean; 
  imagen_url: string;
  ubicacion: Ubicacion; 
}
  


  