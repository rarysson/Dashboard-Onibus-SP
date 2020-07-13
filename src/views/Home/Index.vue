<template>
    <div class="btns-container">
        <b-button to="map/bus" class="map-btn" variant="primary">
            <b-icon-map />
            Ver mapa dos ônibus
        </b-button>

        <b-button to="map/busstop" class="map-btn" variant="primary">
            <b-icon-map />
            Ver mapa das paradas
        </b-button>
    </div>
</template>

<script>
export default {
    name: "IndexHomePage"
};
</script>

<style scoped>
.btns-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.map-btn {
    margin: 0 30px;
}
</style>
