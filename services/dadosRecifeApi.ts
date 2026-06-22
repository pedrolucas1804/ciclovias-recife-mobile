import type { Ciclovia } from '../types/ciclovia';

const URL_METADADOS_DATASET =
  'https://dados.recife.pe.gov.br/api/3/action/package_show?id=malha-cicloviaria-do-recife';

interface RecursoCkan {
  id: string;
  format: string;
  url: string;
  name?: string;
}

interface RespostaPackageShow {
  success: boolean;
  result?: {
    resources: RecursoCkan[];
  };
}

function extrairTexto(
  properties: Record<string, unknown>,
  chaves: string[]
): string | null {
  for (const chave of chaves) {
    const valor = properties[chave];
    if (typeof valor === 'string' && valor.trim().length > 0) {
      return valor.trim();
    }
  }
  return null;
}

function achatarCoordenadas(geometry: any): [number, number][] {
  if (!geometry) return [];
  if (geometry.type === 'LineString') {
    return geometry.coordinates as [number, number][];
  }
  if (geometry.type === 'MultiLineString') {
    return (geometry.coordinates as [number, number][][]).flat();
  }
  return [];
}

export async function fetchCiclovias(): Promise<Ciclovia[]> {
  const respMetadados = await fetch(URL_METADADOS_DATASET);
  if (!respMetadados.ok) {
    throw new Error('Não foi possível consultar o Dados Recife. Tente novamente em instantes.');
  }

  const metadados: RespostaPackageShow = await respMetadados.json();
  if (!metadados.success || !metadados.result) {
    throw new Error('O Dados Recife retornou uma resposta inesperada.');
  }

  const recursoGeoJson = metadados.result.resources.find((recurso) =>
    (recurso.format || '').toUpperCase().includes('GEOJSON')
  );

  if (!recursoGeoJson) {
    throw new Error('O dataset da Malha Cicloviária não tem um arquivo GeoJSON disponível no momento.');
  }

  const respGeoJson = await fetch(recursoGeoJson.url);
  if (!respGeoJson.ok) {
    throw new Error('Não foi possível baixar os dados das ciclovias.');
  }

  const geojson = await respGeoJson.json();
  const features: any[] = geojson.features ?? [];

  return features.map((feature, indice): Ciclovia => {
    const properties = feature.properties ?? {};

    const nome =
      extrairTexto(properties, ['nome', 'Nome', 'NOME', 'logradouro', 'Logradouro', 'name']) ??
      `Trecho ${indice + 1}`;

    const tipo = extrairTexto(properties, ['tipo', 'Tipo', 'TIPO', 'type', 'classe', 'classificacao']);

    return {
      id: String(properties.id ?? properties.objectid ?? indice),
      nome,
      tipo,
      coordenadas: achatarCoordenadas(feature.geometry),
    };
  });
}