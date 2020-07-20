# Páginas da aplicação

Páginas são as rotas visíveis ao usuário, onde elas estão na pasta [views](../src/views).

Abaixo segue uma breve explicação do que faz e os seus componentes.

## Index

Página central, onde as outras vão ser montadas a partir dela.

-   Componentes:
    -   MenuItems

## Home

Página de entrada

## Error404

Página para caso o usuário digite alguma URL inválida

## Forecast

Página para mostrar a previsão de chegada dos ônibus para uma parada ou linha

-   Rota
    -   /forecast
-   Componentes:
    -   DropdownSelectMenu
    -   LMap
    -   LMarkerCluster
    -   LMarker
    -   BusStopMapSearch
    -   LineSearch
    -   AlertBox
    -   TimeFilter

## BusMap

Página para mostrar a posição dos ônibus no mapa

-   Rota
    -   /map/bus
-   Componentes:
    -   EyeIconMsg
    -   LMap
    -   LMarkerCluster
    -   BusMapSearch
    -   DistanceFilter
    -   AlertBox

## BusStopMap

Página para mostrar a posição das paradas de ônibus no mapa

-   Rota
    -   /map/busstop
-   Componentes:
    -   EyeIconMsg
    -   LMap
    -   LMarkerCluster
    -   BusStopMapSearch
    -   DistanceFilter
    -   AlertBox

## BusLanes

Página para mostrar as informações dos corredores

-   Rota
    -   /infos/buslanes
-   Componentes:
    -   PaginatedList
    -   AlertBox

## Companies

Página para mostrar as informações das empresas

-   Rota
    -   /infos/companies
-   Componentes:
    -   PaginatedList
    -   AlertBox

## Lines

Página para mostrar as informações das linhas

-   Rota
    -   /infos/lines
-   Componentes:
    -   DropdownSelectMenu
    -   SearchInput
    -   PaginatedList
    -   AlertBox
