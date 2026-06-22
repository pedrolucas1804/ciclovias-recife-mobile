import { BACKEND_URL } from '../constants/config';
import type { LocalizacaoSalva, NovaLocalizacao } from '../types/localizacao';

export async function salvarLocalizacao(
  dados: NovaLocalizacao
): Promise<LocalizacaoSalva> {
  const resposta = await fetch(`${BACKEND_URL}/api/localizacoes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });

  if (!resposta.ok) {
    const corpoErro = await resposta.json().catch(() => ({}));
    throw new Error(
      corpoErro.erro ?? 'Não foi possível salvar a localização no backend.'
    );
  }

  return resposta.json();
}

export async function buscarHistorico(): Promise<LocalizacaoSalva[]> {
  const resposta = await fetch(`${BACKEND_URL}/api/localizacoes`);

  if (!resposta.ok) {
    throw new Error('Não foi possível buscar o histórico no backend.');
  }

  return resposta.json();
}