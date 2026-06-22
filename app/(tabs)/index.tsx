import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Botao } from '../../components/Botao';
import { useCiclovias } from '../../contexts/CicloviasContext';

export default function CicloviasScreen() {
  const { ciclovias, carregando, erro, recarregar } = useCiclovias();
  const [busca, setBusca] = useState('');

  const listaFiltrada = useMemo(() => {
    if (!busca.trim()) return ciclovias;
    const termo = busca.trim().toLowerCase();
    return ciclovias.filter((c) => c.nome.toLowerCase().includes(termo));
  }, [ciclovias, busca]);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#0B7A3B" />
        <Text style={styles.textoCarregando}>
          Buscando a Malha Cicloviária na API do Dados Recife…
        </Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.textoErro}>{erro}</Text>
        <Botao titulo="Tentar novamente" onPress={recarregar} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitulo}>
        {ciclovias.length} trechos carregados da API do Dados Recife (CTTU)
      </Text>

      <TextInput
        style={styles.busca}
        placeholder="Buscar por nome da via..."
        value={busca}
        onChangeText={setBusca}
        autoCorrect={false}
      />

      <FlatList
        data={listaFiltrada}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nomeCard}>🚲 {item.nome}</Text>
            {item.tipo && <Text style={styles.tipoCard}>{item.tipo}</Text>}
            <Text style={styles.pontosCard}>
              {item.coordenadas.length} pontos georreferenciados
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma ciclovia encontrada para essa busca.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7F6', paddingHorizontal: 16, paddingTop: 12 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  textoCarregando: { textAlign: 'center', color: '#555', marginTop: 8 },
  textoErro: { textAlign: 'center', color: '#B3261E', marginBottom: 8, fontSize: 15 },
  subtitulo: { color: '#5A6B63', marginBottom: 10, fontSize: 13 },
  busca: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#DCE3DF',
    marginBottom: 12,
  },
  lista: { paddingBottom: 24 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E4EAE7',
  },
  nomeCard: { fontSize: 15, fontWeight: '600', color: '#1F2A24' },
  tipoCard: { fontSize: 13, color: '#0B7A3B', marginTop: 2 },
  pontosCard: { fontSize: 12, color: '#8A958F', marginTop: 4 },
  vazio: { textAlign: 'center', color: '#8A958F', marginTop: 40 },
});