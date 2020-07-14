<template>
    <div class="app-container">
        <b-button
            v-b-toggle.sidebar
            variant="primary"
            size="lg"
            style="margin-top: 10px;"
        >
            <b-icon-list />
            Menu
        </b-button>

        <b-sidebar id="sidebar" backdrop no-header-close>
            <b-img
                src="../assets/logos/logo.png"
                alt="logo sp trans"
                class="logo"
            />

            <b-list-group>
                <b-list-group-item to="/">
                    <b-icon-map />
                    Mapas
                </b-list-group-item>
                <b-list-group-item to="infos">
                    <b-icon-info-circle />
                    Ver informações de transporte
                </b-list-group-item>
                <b-list-group-item to="prediction">
                    <b-icon-clock />
                    Previsão de chegada numa parada
                </b-list-group-item>
            </b-list-group>

            <template v-slot:footer="{ hide }">
                <b-button @click="hide" variant="info" block squared size="lg">
                    Fechar menu
                </b-button>
            </template>
        </b-sidebar>

        <router-view class="views-container" />
    </div>
</template>

<script>
export default {
    name: "Index"
};
</script>

<style scoped>
.app-container {
    padding: 1vw 1vw 0.5vw;
    display: flex;
    align-items: flex-start;
}

.logo {
    width: 50%;
    margin-left: 20px;
    margin-bottom: 30px;
}

.views-container {
    flex: 1;
    margin-left: 30px;
}
</style>
