<template>
    <div class="app-container">
        <div class="sidebar-container border-right">
            <menu-items />
        </div>

        <div class="div-menu border-bottom">
            <b-img src="../assets/logos/logo_min.png" width="50%" />
            <b-button v-b-toggle.sidebar variant="primary" squared>
                <b-icon-list />
                Menu
            </b-button>
        </div>

        <b-sidebar id="sidebar" backdrop>
            <menu-items />
        </b-sidebar>

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
    min-height: 100vh;
    display: flex;
}

.sidebar-container {
    min-height: 100%;
    padding-top: 1vw;
    flex-basis: 320px;
}

.views-container {
    flex: 1;
    padding: 2.5vw 1.5vw 3vw;
    min-height: 100%;
}

.div-menu {
    display: none;
    background-color: var(--light);
}

@media (max-width: 1150px) {
    .app-container {
        flex-direction: column;
    }

    .sidebar-container {
        display: none;
    }

    .div-menu {
        display: flex;
        justify-content: space-between;
    }
}
</style>
