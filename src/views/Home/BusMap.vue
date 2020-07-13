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
                    @click="get_buses_position"
                >
                    <eye-icon-msg
                        :condition-var="show_buses"
                        visible-message="Mostrar todos ônibus"
                        hidden-message="Ocultar todos ônibus"
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

                        <template v-if="show_buses">
                            <l-marker
                                v-for="bus in buses"
                                :key="bus.id"
                                :lat-lng="bus.position"
                            >
                                <l-icon
                                    icon-url="../../assets/icons_map/bus.png"
                                    :icon-size="[30, 30]"
                                />
                                <l-popup>
                                    <p>
                                        <strong>Ônibus: </strong>
                                        {{ bus.id }}
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
    name: "BusMapPage",

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
            show_buses: false,
            buses: [],
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
        async get_buses_position() {
            this.show_buses = !this.show_buses;

            if (this.buses.length === 0) {
                try {
                    const response = await API.get("Posicao");
                    const data = response.data.l.splice(0, 3);

                    data.forEach(line => {
                        line.vs.forEach(bus => {
                            this.buses.push({
                                id: bus.p,
                                accessible: bus.a,
                                position: latLng(bus.py, bus.px)
                            });
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
