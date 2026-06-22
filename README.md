# Ciclovias Recife — App Mobile

App em **React Native (Expo + Expo Router)** desenvolvido para a atividade de
recuperação de React Native. Consome a API do
[Portal de Dados Abertos do Recife](https://dados.recife.pe.gov.br/) (dataset
**Malha Cicloviária do Recife**), usa a localização do usuário (GPS) para
calcular a ciclovia mais próxima, e salva esse resultado em um backend próprio.

## Por que esse dataset?

A Malha Cicloviária do Recife é um dado de **mobilidade urbana**, relevante
pra qualquer cidadão/ciclista, e já vem **georreferenciado** (coordenadas de
cada trecho de ciclovia/ciclofaixa/ciclorrota). Isso permite cruzar o dado da
API diretamente com a localização do usuário — calculando a distância até a
ciclovia mais próxima.

## Tecnologias

- **Expo + Expo Router** — app e navegação em abas
- **expo-location** — leitura do GPS do aparelho
- **TypeScript** — tipagem em todo o projeto
- **Context API** — compartilhamento dos dados da API entre as telas
- **fetch** — chamadas HTTP/S para a API do Dados Recife e para o backend

## Estrutura do projeto

ciclovias-recife-mobile/

├── app/

│   ├── _layout.tsx              # layout raiz (provider dos dados)

│   └── (tabs)/

│       ├── _layout.tsx          # navegação em abas

│       ├── index.tsx            # Tela 1: lista de ciclovias (API Dados Recife)

│       ├── localizacao.tsx      # Tela 2: GPS + ciclovia mais próxima + salvar

│       └── historico.tsx        # Tela 3: histórico salvo no backend (GET)

├── components/

│   └── Botao.tsx                # botão reutilizável

├── contexts/

│   └── CicloviasContext.tsx     # busca e compartilha os dados da API

├── services/

│   ├── dadosRecifeApi.ts        # integração com a API do Dados Recife

│   └── backendApi.ts            # integração com o backend (POST/GET)

├── types/

│   ├── ciclovia.ts

│   └── localizacao.ts

├── utils/

│   └── geo.ts                   # cálculo de distância (Haversine)

└── constants/

└── config.ts                # URL do backend (AJUSTAR antes de rodar!)

## Como rodar localmente

Pré-requisitos: **Node.js 22+** e o app **Expo Go** instalado no celular.

```bash
# 1. Instalar dependências
npm install

# 2. Editar constants/config.ts com o IP local da sua máquina
#    (rode ipconfig no cmd para descobrir)

# 3. Subir o backend (em outro terminal)
cd ../ciclovias-recife-backend && npm start

# 4. Subir o app
npx expo start
```

Escaneie o QR code com o **Expo Go** (Android) ou câmera do iPhone (iOS).
Celular e computador precisam estar na **mesma rede Wi-Fi**.

## Telas

1. **Ciclovias** — lista os trechos da Malha Cicloviária do Recife vindos da API do Dados Recife, com busca por nome.
2. **Localização** — usa o GPS do celular, calcula a ciclovia mais próxima (fórmula de Haversine) e permite salvar no backend.
3. **Histórico** — exibe todos os registros salvos no backend via GET, com pull-to-refresh.