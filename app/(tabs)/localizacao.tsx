import * as Location from 'expo-location';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Botao } from '../../components/Botao';
import { useCiclovias } from '../../contexts/CicloviasContext';
import { salvarLocalizacao } from '../../services/backendApi';
import type { Ciclovia } from '../../types/ciclovia';
import { encontrarMaisProxima } from '../../utils/geo';

interface ResultadoBusca {
  latitude: number;
  longitude: number;
  ciclovia: Ciclovia;
  distanciaMetros: number;
}

function formatarDistancia(metros: number): string {
  if (metros < 1000) return `${metros.toFixed(0)} m`;
  return `${(metros / 1000).toFixed(2)} km`;
}

export default function LocalizacaoScreen() {
  const { ciclovias, carregando: carregandoCiclovias } = useCiclovias();

  const [buscandoLocalizacao, setBuscandoLocalizacao] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoBusca | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function obterLocalizacaoAtual() {
    setErro(null);
    setBuscandoLocalizacao(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErro('Precisamos da sua permissão de localização para encontrar a ciclovia mais próxima.');
        return;
      }

      const posicao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = posicao.coords;

      if (ciclovias.length === 0) {
        setErro('Os dados de ciclovias ainda não foram carregados. Volte para a aba "Ciclovias" e tente novamente.');
        return;
      }

      const maisProxima = encontrarMaisProxima(ciclovias, latitude, longitude);
      if (!maisProxima) {
        setErro('Não conseguimos calcular a ciclovia mais próxima.');
        return;
      }

      setResultado({
        latitude,
        longitude,
        ciclovia: maisProxima.item,
        distanciaMetros: maisProxima.distanciaMetros,
      });
    } catch {
      setErro('Não foi possível obter sua localização. Verifique se o GPS está ativado.');
    } finally {
      setBuscandoLocalizacao(false);
    }
  }

  async function salvarNoHistorico() {
    if (!resultado) return;

    setSalvando(true);
    try {
      await salvarLocalizacao({
        latitude: resultado.latitude,
        longitude: resultado.longitude,
        ciclovia_nome: resultado.ciclovia.nome,
        ciclovia_tipo: resultado.ciclovia.tipo,
        distancia_metros: resultado.distanciaMetros,
      });
      Alert.alert('Salvo! ✅', 'Sua localização foi salva no histórico.');
    } catch (excecao) {
      Alert.alert(
        'Não foi possível salvar',
        excecao instanceof Error
          ? excecao.message
          : 'Confira se o backend está rodando e se o IP em constants/config.ts está correto.'
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.descricao}>
        Toque no botão abaixo para usar o GPS do celular e descobrir qual
        trecho da malha cicloviária do Recife está mais perto de você agora.
      </Text>

      <Botao
        titulo="Usar minha localização atual"
        onPress={obterLocalizacaoAtual}
        carregando={buscandoLocalizacao}
        desabilitado={carregandoCiclovias}
      />

      {carregandoCiclovias && (
        <Text style={styles.aviso}>Aguardando os dados da API do Dados Recife carregarem…</Text>
      )}

      {erro && <Text style={styles.erro}>{erro}</Text>}

      {resultado && (
        <View style={styles.card}>
          <Text style={styles.cardLinha}>
            📍 Sua posição: {resultado.latitude.toFixed(5)}, {resultado.longitude.toFixed(5)}
          </Text>
          <Text style={styles.cardLinha}>🚲 Ciclovia mais próxima: {resultado.ciclovia.nome}</Text>
          {resultado.ciclovia.tipo && (
            <Text style={styles.cardLinha}>Tipo: {resultado.ciclovia.tipo}</Text>
          )}
          <Text style={styles.cardDistancia}>
            {formatarDistancia(resultado.distanciaMetros)} de distância
          </Text>

          <Botao
            titulo="Salvar no histórico"
            onPress={salvarNoHistorico}
            carregando={salvando}
            variante="secundario"
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F5F7F6', padding: 16 },
  descricao: { color: '#445049', fontSize: 14, marginBottom: 14, lineHeight: 20 },
  aviso: { color: '#8A958F', fontSize: 13, marginTop: 8 },
  erro: { color: '#B3261E', marginTop: 12, fontSize: 14 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#E4EAE7',
  },
  cardLinha: { fontSize: 15, color: '#1F2A24', marginBottom: 6 },
  cardDistancia: { fontSize: 20, fontWeight: '700', color: '#0B7A3B', marginVertical: 8 },
});