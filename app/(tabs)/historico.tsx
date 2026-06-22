import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { buscarHistorico } from '../../services/backendApi';
import type { LocalizacaoSalva } from '../../types/localizacao';

function formatarDistancia(metros: number): string {
  if (metros < 1000) return `${metros.toFixed(0)} m`;
  return `${(metros / 1000).toFixed(2)} km`;
}

export default function HistoricoScreen() {
  const [historico, setHistorico] = useState<LocalizacaoSalva[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const dados = await buscarHistorico();
      setHistorico(dados);
    } catch (excecao) {
      setErro(
        excecao instanceof Error
          ? excecao.message
          : 'Não foi possível buscar o histórico. O backend está rodando?'
      );
    } finally {
      setCarregando(false);
    }
  }, []);


  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subtitulo}>Dados salvos no backend (SQLite), puxados via GET</Text>

      {erro && <Text style={styles.erro}>{erro}</Text>}

      <FlatList
        data={historico}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={carregando} onRefresh={carregar} />}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.data}>{item.criado_em}</Text>
            <Text style={styles.linha}>
              📍 {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
            </Text>
            <Text style={styles.linha}>🚲 {item.ciclovia_nome}</Text>
            <Text style={styles.distancia}>{formatarDistancia(item.distancia_metros)}</Text>
          </View>
        )}
        ListEmptyComponent={
          !carregando ? (
            <Text style={styles.vazio}>
              Nenhuma localização salva ainda. Vá até a aba "Localização" e salve uma!
            </Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7F6', paddingHorizontal: 16, paddingTop: 12 },
  subtitulo: { color: '#5A6B63', marginBottom: 10, fontSize: 13 },
  erro: { color: '#B3261E', marginBottom: 10, fontSize: 14 },
  lista: { paddingBottom: 24 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E4EAE7',
  },
  data: { fontSize: 12, color: '#8A958F', marginBottom: 6 },
  linha: { fontSize: 14, color: '#1F2A24', marginBottom: 2 },
  distancia: { fontSize: 16, fontWeight: '700', color: '#0B7A3B', marginTop: 6 },
  vazio: { textAlign: 'center', color: '#8A958F', marginTop: 40 },
});