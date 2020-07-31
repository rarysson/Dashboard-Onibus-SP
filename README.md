# Dashboard Ônibus SP

Dashboard sobre os ônibus de São Paulo, onde é mostrado a localização e informações dos ônibus e as paradas de ônibus. Também é mostrado as informações sobre as linhas, corredores, empresas e a previsão de chegada de ônibus num local escolhido.

Projeto desenvolvido durante a seleção de estágio da Aiko.

Para saber mais do projeto acesse a pasta: [doc](doc).

## Tecnologias usadas

-   [Vue](https://vuejs.org/)
-   [BootstrapVue](https://bootstrap-vue.org/)
-   [Axios](https://github.com/axios/axios)
-   [OpenStreetMap](https://www.openstreetmap.org/copyright)
-   [Leaflet](https://leafletjs.com/) com [MarkerCluster](https://github.com/Leaflet/Leaflet.markercluster)

## Rodando a aplicação

Para usar online acesse o link: https://dashboard-sp-trans.herokuapp.com/

Para usar localmente, clone o repositório, vá na pasta criada e crie um arquivo chamado `.env.local`, dentro desse arquivo coloque o seguinte valor (sem os parênteses):

```
VUE_APP_TOKEN=(SUA CHAVE DE ACESSO DA API OLHO VIVO)
```

e após isso, execute os comandos:

```
npm install
npm run serve
```

_Para conseguir uma chave de acesso da API olhe o arquivo [api.md](doc/api.md)_
