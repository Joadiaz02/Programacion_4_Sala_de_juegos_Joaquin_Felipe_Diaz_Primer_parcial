export interface Mensaje {

  id: number;

  usuario_id: string;

  contenido: string;

  created_at: string;

  usuarios?: {
    nombre: string;
    apellido: string;
  };

}