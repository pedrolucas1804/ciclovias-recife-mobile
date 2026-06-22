import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

interface BotaoProps {
  titulo: string;
  onPress: () => void;
  carregando?: boolean;
  desabilitado?: boolean;
  variante?: 'primario' | 'secundario';
}

export function Botao({
  titulo,
  onPress,
  carregando = false,
  desabilitado = false,
  variante = 'primario',
}: BotaoProps) {
  const estaDesabilitado = desabilitado || carregando;

  return (
    <Pressable
      onPress={onPress}
      disabled={estaDesabilitado}
      style={({ pressed }) => [
        styles.base,
        variante === 'secundario' ? styles.secundario : styles.primario,
        estaDesabilitado && styles.desabilitado,
        pressed && !estaDesabilitado && styles.pressionado,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={variante === 'secundario' ? '#0B7A3B' : '#FFFFFF'} />
      ) : (
        <Text style={[styles.texto, variante === 'secundario' && styles.textoSecundario]}>
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  primario: {
    backgroundColor: '#0B7A3B',
  },
  secundario: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0B7A3B',
  },
  desabilitado: {
    opacity: 0.5,
  },
  pressionado: {
    opacity: 0.85,
  },
  texto: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  textoSecundario: {
    color: '#0B7A3B',
  },
});