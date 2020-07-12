<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <h1>Linha para pesquisas</h1>
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <div class="map-container">
                    <l-map
                        :zoom="map.zoom"
                        :center="map.center"
                        :options="map.mapOptions"
                        @update:center="centerUpdate"
                        @update:zoom="zoomUpdate"
                    >
                        <l-tile-layer
                            :url="map.url"
                            :attribution="map.attribution"
                        />
                        <l-marker :lat-lng="map.withPopup">
                            <l-popup>
                                <div @click="innerClick">
                                    I am a popup
                                    <p v-show="map.showParagraph">
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit. Quisque sed pretium
                                        nisl, ut sagittis sapien. Sed vel
                                        sollicitudin nisi. Donec finibus semper
                                        metus id malesuada.
                                    </p>
                                </div>
                            </l-popup>
                        </l-marker>
                        <l-marker :lat-lng="map.withTooltip">
                            <l-tooltip
                                :options="{
                                    permanent: true,
                                    interactive: true
                                }"
                            >
                                <div @click="innerClick">
                                    I am a tooltip
                                    <p v-show="map.showParagraph">
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit. Quisque sed pretium
                                        nisl, ut sagittis sapien. Sed vel
                                        sollicitudin nisi. Donec finibus semper
                                        metus id malesuada.
                                    </p>
                                </div>
                            </l-tooltip>
                        </l-marker>
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
// import API from "../util/api";
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "vue2-leaflet";

export default {
    name: "HomePage",

    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
        LTooltip
    },

    data() {
        return {
            map: {
                zoom: 13,
                center: latLng(-23.5489, -46.6388),
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                attribution:
                    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                withPopup: latLng(-23.5489, -46.5388),
                withTooltip: latLng(-23.5489, -46.5888),
                currentZoom: 11.5,
                currentCenter: latLng(47.41322, -1.219482),
                showParagraph: false,
                mapOptions: {
                    zoomSnap: 0.5
                }
            }
        };
    },

    methods: {
        zoomUpdate(zoom) {
            this.map.currentZoom = zoom;
        },
        centerUpdate(center) {
            this.map.currentCenter = center;
        },
        showLongText() {
            this.map.showParagraph = !this.map.showParagraph;
        },
        innerClick() {
            alert("Click!");
        }
    }
};
</script>

<style scoped>
.map-container {
    height: 75vh;
    margin: 25px 0;
    border: 2px solid black;
    border-radius: 5px;
    overflow: auto;
}
</style>
