<template>
    <b-list-group @click="item_selected">
        <b-img
            src="../assets/logos/logo.png"
            alt="logo sp trans"
            class="logo"
        />

        <b-list-group-item class="item" to="/map/bus">
            <b-icon-map />
            Mapa dos ônibus
        </b-list-group-item>

        <b-list-group-item class="item" to="/map/busstop">
            <b-icon-map />
            Mapa das paradas
        </b-list-group-item>

        <b-list-group-item class="item" to="/infos/lines">
            <b-icon-info-circle />
            Ver informações das linhas
        </b-list-group-item>

        <b-list-group-item class="item" to="/infos/buslanes">
            <b-icon-info-circle />
            Ver informações dos corredores
        </b-list-group-item>

        <b-list-group-item class="item" to="/infos/companies">
            <b-icon-info-circle />
            Ver informações das empresas
        </b-list-group-item>

        <b-list-group-item class="item" to="/forecast">
            <b-icon-clock />
            Previsão de chegada numa parada
        </b-list-group-item>
    </b-list-group>
</template>

<script>
export default {
    name: "MenuItems",

    methods: {
        item_selected(event) {
            event.target.classList.add("clicked");
        }
    }
};
</script>

<style scoped>
.logo {
    width: 50%;
    margin-left: 20px;
    margin-bottom: 30px;
}

.item {
    transition: 0.4s;
}

.item:hover,
.item:focus,
.clicked {
    color: var(--light);
    background-color: var(--primary);
}
</style>
