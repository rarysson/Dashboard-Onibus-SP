<template>
    <b-container fluid>
        <b-button
            variant="info"
            size="sm"
            style="margin-bottom: 30px;"
            @click="go_back"
        >
            <b-icon-arrow-left />
            Voltar
        </b-button>

        <b-row>
            <b-col cols="auto">
                <b-button
                    variant="primary"
                    size="sm"
                    @click="get_bus_stop_position"
                >
                    <eye-icon-msg
                        :condition-var="show_bus_stop"
                        visible-message="Mostrar todas paradas"
                        hidden-message="Ocultar todas paradas"
                    />
                </b-button>
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <div class="map-container">
                    <l-map :zoom="map.zoom" :center="map.center">
                        <l-tile-layer
                            :url="map.url"
                            :attribution="map.attribution"
                        />

                        <template v-if="show_bus_stop">
                            <l-marker
                                v-for="(stop, index) in bus_stop"
                                :key="index"
                                :lat-lng="stop.position"
                            >
                                <l-icon
                                    icon-url="../../assets/icons_map/bus_stop.png"
                                    :icon-size="[30, 30]"
                                />
                                <l-popup>
                                    <p>
                                        <strong>Nome da parada: </strong
                                        >{{ stop.bus_stop_name }}
                                    </p>
                                    <p>
                                        <strong>Endereço: </strong
                                        >{{ stop.address_name }}
                                    </p>
                                </l-popup>
                            </l-marker>
                        </template>
                    </l-map>
                </div>
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <h1>Linha para filtros</h1>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import API from "../../util/api";
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from "vue2-leaflet";
import EyeIconMsg from "../../components/EyeIconMsg";

export default {
    name: "BusStopMapPage",

    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
        EyeIconMsg,
        LIcon
    },

    data() {
        return {
            show_bus_stop: false,
            bus_stop: [],
            map: {
                zoom: 11,
                center: latLng(-23.5489, -46.6388), //Centro de São Paulo
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                attribution:
                    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }
        };
    },

    methods: {
        async get_bus_stop_position() {
            this.show_bus_stop = !this.show_bus_stop;

            if (this.bus_stop.length === 0) {
                try {
                    const response = await API.get("Parada/Buscar", {
                        params: { termosBusca: "" }
                    });
                    const data = response.data.splice(0, 75);

                    data.forEach(stop => {
                        this.bus_stop.push({
                            bus_stop_name: stop.np,
                            address_name: stop.ed,
                            position: latLng(stop.py, stop.px)
                        });
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        },

        go_back() {
            this.$router.back();
        }
    }
};
</script>

<style scoped>
.map-container {
    height: 75vh;
    margin: 10px 0;
    border: 2px solid rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    overflow: auto;
}
</style>
