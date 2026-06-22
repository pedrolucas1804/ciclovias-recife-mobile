export interface Ciclovia {
  id: string;
  nome: string;
  tipo: string | null;

  coordenadas: [number, number][];
}