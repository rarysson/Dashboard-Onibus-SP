<template>
    <b-list-group ref="group">
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
            Previsão de chegada dos ônibus
        </b-list-group-item>
    </b-list-group>
</template>

<script>
export default {
    name: "MenuItems",

    mounted() {
        for (let child of this.$refs.group.children) {
            if (child.pathname === this.$route.path) {
                child.classList.add("clicked");
                break;
            }
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
    position: relative;
}

.item:hover {
    color: var(--light);
}

.item::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: calc(100% + 1px);
    z-index: -1;
    margin-left: -4px;
    transition: all 0.3s;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.item:hover::before {
    width: calc(100% + 5px);
    background-color: var(--primary);
}

.item.router-link-active,
.clicked {
    color: var(--light);
    background-color: var(--primary);
}
</style>
