<template>
    <b-list-group>
        <b-img
            src="../assets/logos/logo.png"
            alt="logo sp trans"
            class="logo"
        />

        <b-list-group-item to="/map/bus">
            <b-icon-map />
            Mapa dos ônibus
        </b-list-group-item>
        <b-list-group-item to="/map/busstop">
            <b-icon-map />
            Mapa das paradas
        </b-list-group-item>
        <b-list-group-item to="/infos/lines">
            <b-icon-info-circle />
            Ver informações das linhas
        </b-list-group-item>
        <b-list-group-item to="/infos/companies">
            <b-icon-info-circle />
            Ver informações das empresas
        </b-list-group-item>
        <b-list-group-item to="/infos/buslanes">
            <b-icon-info-circle />
            Ver informações dos corredores
        </b-list-group-item>
        <b-list-group-item to="/infos/lanes">
            <b-icon-info-circle />
            Ver informações das vias
        </b-list-group-item>
        <b-list-group-item to="/prediction">
            <b-icon-clock />
            Previsão de chegada numa parada
        </b-list-group-item>
    </b-list-group>
</template>

<script>
export default {
    name: "MenuItems"
};
</script>

<style scoped>
.logo {
    width: 50%;
    margin-left: 20px;
    margin-bottom: 30px;
}
</style>
