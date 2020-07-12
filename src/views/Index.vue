<template>
    <div>
        <b-button v-b-toggle.sidebar>
            <b-icon-list />
            Menu
        </b-button>
        <b-sidebar id="sidebar" backdrop no-header-close>
            <b-img src="../assets/logo.png" alt="logo sp trans" class="logo" />

            <b-list-group>
                <b-list-group-item to="/">
                    <b-icon-map />
                    Mapa
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
                <b-button
                    @click="hide"
                    variant="info"
                    style="width:100%;"
                    squared
                >
                    Fechar menu
                </b-button>
            </template>
        </b-sidebar>

        <router-view />
    </div>
</template>

<script>
export default {
    name: "Index"
};
</script>

<style>
.logo {
    width: 50%;
    margin-left: 20px;
    margin-bottom: 30px;
}
</style>
