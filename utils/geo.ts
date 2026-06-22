export function distanciaMetros(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const RAIO_TERRA_METROS = 6371000;
  const paraRadianos = (graus: number) => (graus * Math.PI) / 180;

  const dLat = paraRadianos(lat2 - lat1);
  const dLon = paraRadianos(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(paraRadianos(lat1)) *
      Math.cos(paraRadianos(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return RAIO_TERRA_METROS * c;
}

function amostrarPontos<T>(pontos: T[], maxPontos = 5): T[] {
  if (pontos.length <= maxPontos) return pontos;

  const passo = Math.ceil(pontos.length / maxPontos);
  const amostra: T[] = [];
  for (let i = 0; i < pontos.length; i += passo) {
    amostra.push(pontos[i]);
  }
  return amostra;
}

export interface ResultadoProximidade<T> {
  item: T;
  distanciaMetros: number;
}

export function encontrarMaisProxima
  T extends { coordenadas: [number, number][] }
>(itens: T[], latitude: number, longitude: number): ResultadoProximidade<T> | null {
  let melhorResultado: ResultadoProximidade<T> | null = null;

  for (const item of itens) {
    const pontosAmostrados = amostrarPontos(item.coordenadas);

    for (const [lonPonto, latPonto] of pontosAmostrados) {
      const distancia = distanciaMetros(latitude, longitude, latPonto, lonPonto);

      if (!melhorResultado || distancia < melhorResultado.distanciaMetros) {
        melhorResultado = { item, distanciaMetros: distancia };
      }
    }
  }

  return melhorResultado;
}