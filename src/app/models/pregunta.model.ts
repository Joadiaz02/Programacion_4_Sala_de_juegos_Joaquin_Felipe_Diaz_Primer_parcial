export interface Pregunta {

  id?: string;

  pregunta: string;

  categoria: string;

  correcta: string;

  opcion_1: string;

  opcion_2: string;

  opcion_3: string;

  opcion_4: string;

  opciones?: string[];

}