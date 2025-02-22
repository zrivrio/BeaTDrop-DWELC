export interface Album {
    id: number ; 
    musico_id: number; 
    titulo: string;
    anio_lanzamiento: number;
    canciones: number; 
    duracion_total?: string; 
    genero: string;
    imagen_url: string | null;
  }