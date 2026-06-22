export interface NovaLocalizacao {
  latitude: number;
  longitude: number;
  ciclovia_nome: string;
  ciclovia_tipo: string | null;
  distancia_metros: number;
}

export interface LocalizacaoSalva extends NovaLocalizacao {
  id: number;
  criado_em: string;
}