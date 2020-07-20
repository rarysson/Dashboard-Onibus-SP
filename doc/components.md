# Componentes da aplicação

Componentes são pequenas partes que contém funcionalidades que podem ser reaproveitadas nas páginas. Onde eles estão na pasta [components](../src/components).

Abaixo segue uma explicação do que faz e seus props e eventos (props são as possíveis propriedades que o componente pode receber).

## AlertBox

Apresenta um texto informativo no parte superior direita da tela do usuário

-   props:
    -   message
        -   A mensagem a ser apresentada
        -   Tipo: String
    -   variant
        -   A cor da mensagem, a cor deve ser um dos possíveis temas do Bootstrap
        -   Tipo: String

## BusMapSearch

Consiste em gerenciar os possíveis tipos de busca de ônibus

-   eventos:
    -   searching-data
        -   Informa que está procurando os dados
    -   bus-searched
        -   Informa que achou o ônibus que estava procurando, e retorna os ônibus da procura
        -   Tipo retornado: Array
    -   data-searched
        -   Informa que terminou de procurar os dados

## BusStopMapSearch

Consiste em gerenciar os possíveis tipos de busca de paradas de ônibus

-   eventos:
    -   searching-data
        -   Informa que está procurando os dados
    -   bus-stop-searched
        -   Informa que achou as paradas de ônibus que estava procurando, e retorna as paradas de ônibus da procura
        -   Tipo retornado: Array
    -   data-searched
        -   Informa que terminou de procurar os dados

## DistanceFilter

Consiste em permitir ao usuário determinar uma delimitação no mapa para mostrar resultados de pesquisas somente naquela área

-   props:
    -   raw-data
        -   O dadado a ser filtrado
        -   Tipo: Array
        -   **Obrigatório**
    -   map-object
        -   O objeto do mapa criado pelo Leaflet
        -   Tipo: Object
-   eventos:
    -   get-map-object
        -   Informa que o componente está pronto para receber o map-object,
            é necessário caso não seja possível passar o map-object na criação do componente
    -   data-filtered
        -   Informa que terminou de filtrar os dados, e retorna os dados filtrados
            -   Tipo retornado: Array

## DropdownSelectMenu

Apresenta um menu de opções no estilo dropdown para o usuário selecionar uma

-   props:
    -   title
        -   A mensagem que é apresentada caso nenhuma opção esteja selecionada
        -   Tipo: String
        -   **Obrigatório**
    -   options
        -   A opções que o usário escolhe
        -   Tipo: Object
            -   O objeto deve possuir os campos:
                -   value
                -   text
        -   **Obrigatório**
    -   selected
        -   O valor da opção selecionada, últil caso queira deixar alguma opção selecionada por padrão
        -   Tipo: String ou Number
    -   empty-option
        -   Texto caso não exista opções
        -   Tipo: String
-   eventos:
    -   change
        -   Informa qual opção foi selecionada, e retorna o valor selecionada
        -   Tipo retornado: String ou Number (depende do tipo que você passou em 'options')

## EyeIconMsg

Um wrapper para caso queira informar mensagens diferentes dependendo do valor verdadeiro de uma condição

-   props:
    -   condition-var
        -   A condição que controla qual das mensagens deve aparecer
        -   Tipo: Boolean
        -   **Obrigatório**
    -   visible-message
        -   A mensagem que aparece caso a condição seja verdadeira
        -   Tipo: String
        -   **Obrigatório**
    -   hidden-message
        -   A mensagem que aparece caso a condição seja falsa
        -   Tipo: String
        -   **Obrigatório**

## LineSearch

Consiste em gerenciar a busca por uma linha

-   eventos:
    -   line-searched
        -   Informa que achou a linha buscada, e retorna a linha achada
        -   Tipo retornado: Object

## LMap

Um wrapper para poder usar o mapa do Leaflet

## LMarker

Um wrapper para poder criar um marker do Leaflet

-   props:
    -   marker-icon
        -   O ícone do objeto
        -   Tipo: Object
        -   **Obrigatório**
    -   marker-data
        -   Os dados do marker
        -   Tipo: Object
            -   O objecto deve possuir os campos:
                -   py (latitude)
                -   px (longitude)
                -   text (o texto da marker)
    -   map-object
        -   O objeto do mapa criado pelo Leaflet
        -   Tipo: Object

## LMarkerCluster

Um wrapper para poder criar cluster de markers. Uma maneira mais eficiente para criar marker em grandes quantidades

-   props:
    -   marker-icon
        -   O ícone do objeto
        -   Tipo: Object
        -   **Obrigatório**
    -   options
        -   Opções de criação do MarkerCluster
        -   Tipo: Object
        -   **Obrigatório**
-   eventos:
    -   cluster-created:
        -   Indica que o cluster foi criado e as marcações foram colocadas

## MenuItems

Uma lista contendo as possíveis opções de rotas. Utilizado no menu da barra lateral

## PaginatedList

Consite em permitir a paginação de dados e mostrar esses dados paginados em tabelas

-   props:
    -   raw-data
        -   Os dados a serem paginado
        -   Tipo: Array
    -   empty-option
        -   Mensagem que aparece caso não teja dados para paginar
        -   Tipo: Object
            -   O objeto deve possuir os campos:
                -   title
                -   subtitle
    -   properties
        -   As propriedades dos dados
        -   Tipo: Array
            -   O array deve ser de object, onde devem possuir os campos:
                -   title
                -   key

## SearchInput

Um wrapper do componente input onde por padrão possui o ícone de busca

-   slots
    -   prepend
        -   Adiciona um componente no início
    -   append
        -   Adiciona um componente no fim antes do botão de pesquisar
-   props:
    -   placeholder
        -   A mensagem que aparece caso o usuário não tenha digitado anda
        -   Tipo: String
        -   **Obrigatório**
-   eventos:
    -   submit
        -   Indica que o usuário pesquisou o termo com sucesso, e retorna a palavra buscada
        -   Tipo retornado: String

## TimeFilter

Consiste em permitir ao usuário determinar uma delimitação de tempo mínimo de chegada para a página de previsão

-   props:
    -   raw-data
        -   O dadado a ser filtrado
        -   Tipo: Array
        -   **Obrigatório**
    -   map-object
        -   O objeto do mapa criado pelo Leaflet
        -   Tipo: Object
-   eventos:
    -   get-map-object
        -   Informa que o componente está pronto para receber o map-object,
            é necessário caso não seja possível passar o map-object na criação do componente
    -   data-filtered
        -   Informa que terminou de filtrar os dados, e retorna os dados filtrados
            -   Tipo retornado: Array
