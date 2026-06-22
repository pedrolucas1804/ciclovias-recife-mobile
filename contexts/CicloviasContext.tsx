import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchCiclovias } from '../services/dadosRecifeApi';
import type { Ciclovia } from '../types/ciclovia';

interface CicloviasContextValor {
  ciclovias: Ciclovia[];
  carregando: boolean;
  erro: string | null;
  recarregar: () => void;
}

const CicloviasContext = createContext<CicloviasContextValor | undefined>(undefined);

export function CicloviasProvider({ children }: { children: React.ReactNode }) {
  const [ciclovias, setCiclovias] = useState<Ciclovia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await fetchCiclovias();
      setCiclovias(dados);
    } catch (excecao) {
      setErro(
        excecao instanceof Error
          ? excecao.message
          : 'Erro desconhecido ao buscar dados do Dados Recife.'
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <CicloviasContext.Provider value={{ ciclovias, carregando, erro, recarregar: carregar }}>
      {children}
    </CicloviasContext.Provider>
  );
}

export function useCiclovias() {
  const contexto = useContext(CicloviasContext);
  if (!contexto) {
    throw new Error('useCiclovias precisa ser usado dentro de um <CicloviasProvider>.');
  }
  return contexto;
}