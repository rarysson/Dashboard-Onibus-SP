<template>
    <div class="app-container">
        <div class="sidebar-container border-right">
            <menu-items />
        </div>

        <!-- TODO: Implementar quando deixar o design responsivo
        <b-button v-b-toggle.sidebar variant="primary" size="lg">
            <b-icon-list />
            Menu
        </b-button>

        <b-sidebar id="sidebar" backdrop no-header-close>
            <menu-items />

            <template v-slot:footer="{ hide }">
                <b-button @click="hide" variant="info" block squared size="lg">
                    Fechar menu
                </b-button>
            </template>
        </b-sidebar> -->

        <router-view class="views-container" />
    </div>
</template>

<script>
import MenuItems from "@/components/MenuItems";

export default {
    name: "Index",

    components: {
        MenuItems
    }
};
</script>

<style scoped>
.app-container {
    /* padding: 1vw 1vw 0.5vw; */
    height: 100vh;
    display: flex;
    align-items: flex-start;
}

.sidebar-container {
    height: 100%;
    padding-top: 1vw;
    flex-basis: 320px;
}

.views-container {
    flex: 1;
    padding: 2.5vw 1vw 0.5vw;
}
</style>
