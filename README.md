# Programa de estágio - 2020-1

![Aiko](doc/imagens/aiko.png)

Projeto desenvolvido para a seleção de estágio da Aiko.

O teste escolhido foi o desafio para desenvolvedor front-end.

Para saber mais do projeto acesse a pasta: [doc](doc).

## Vídeo de demonstração da aplicação

Uma demonstração da aplicação pode ser vista neste link do YouTube: https://youtu.be/-NuTyKNUtkY

Onde é mostrado como funciona a aplicação e algumas decisões tomadas no desenvolvimento.

## Tecnologias usadas

-   Vue
-   BootstrapVue
-   Axios
-   OpenStreetMap
-   Leaflet com MarkerCluster

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

*Para conseguir uma chave de acesso da API olhe o arquivo [api.md](doc/api.md)*
