<template>
    <div>
        <h1>Dashboard SP Trans</h1>
        <b-button variant="success">Bootstrap instalado</b-button>

        <ul v-if="corredores && corredores.length">
            <li v-for="(corredor, i) of corredores" :key="i">
                <p>
                    <strong>ID: {{ corredor.cc }}</strong>
                </p>
                <p>Nome: {{ corredor.nc }}</p>
            </li>
        </ul>

        <ul v-if="errors && errors.length">
            <li v-for="(error, i) of errors" :key="i">{{ error.message }}</li>
        </ul>

        <div style="height: 300px; overflow: auto;">
            <l-map
                v-if="showMap"
                :zoom="zoom"
                :center="center"
                :options="mapOptions"
                @update:center="centerUpdate"
                @update:zoom="zoomUpdate"
            >
                <l-tile-layer :url="url" :attribution="attribution" />
                <l-marker :lat-lng="withPopup">
                    <l-popup>
                        <div @click="innerClick">
                            I am a popup
                            <p v-show="showParagraph">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Quisque sed pretium nisl, ut
                                sagittis sapien. Sed vel sollicitudin nisi.
                                Donec finibus semper metus id malesuada.
                            </p>
                        </div>
                    </l-popup>
                </l-marker>
                <l-marker :lat-lng="withTooltip">
                    <l-tooltip
                        :options="{ permanent: true, interactive: true }"
                    >
                        <div @click="innerClick">
                            I am a tooltip
                            <p v-show="showParagraph">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Quisque sed pretium nisl, ut
                                sagittis sapien. Sed vel sollicitudin nisi.
                                Donec finibus semper metus id malesuada.
                            </p>
                        </div>
                    </l-tooltip>
                </l-marker>
            </l-map>
        </div>
    </div>
</template>

<script>
import API from "../util/api";
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "vue2-leaflet";

export default {
    name: "Home",

    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
        LTooltip
    },

    data() {
        return {
            corredores: [],
            errors: [],
            zoom: 13,
            center: latLng(47.41322, -1.219482),
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution:
                '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            withPopup: latLng(47.41322, -1.219482),
            withTooltip: latLng(47.41422, -1.250482),
            currentZoom: 11.5,
            currentCenter: latLng(47.41322, -1.219482),
            showParagraph: false,
            mapOptions: {
                zoomSnap: 0.5
            },
            showMap: true
        };
    },

    async created() {
        try {
            const response = await API.get("Corredor");
            this.corredores = response.data;
        } catch (e) {
            this.errors.push(e);
        }
    },

    methods: {
        zoomUpdate(zoom) {
            this.currentZoom = zoom;
        },
        centerUpdate(center) {
            this.currentCenter = center;
        },
        showLongText() {
            this.showParagraph = !this.showParagraph;
        },
        innerClick() {
            alert("Click!");
        }
    }
};
</script>
