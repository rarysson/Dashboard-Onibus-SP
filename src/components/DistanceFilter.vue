<template>
    <b-row>
        <b-col cols="12">
            <b-row align-h="between">
                <b-col class="col-filter">
                    <b-form-checkbox
                        v-model="filter_result"
                        size="lg"
                        class="mb-20"
                    >
                        Filtrar o resultado por distância
                    </b-form-checkbox>
                </b-col>

                <b-col v-if="filter_result" cols="auto" class="mb-20">
                    <b-button
                        size="sm"
                        class="mr-20 mb-20"
                        :variant="user_point === null ? 'secondary' : 'info'"
                        :disabled="user_point === null"
                        @click="toggle_user_marker"
                    >
                        <eye-icon-msg
                            :condition-var="showing_user"
                            visible-message="Mostrar ponto"
                            hidden-message="Ocultar ponto"
                        />
                    </b-button>

                    <b-button
                        variant="primary"
                        size="sm"
                        class="mr-20 mb-20"
                        @click="find_me"
                    >
                        <b-icon-geo-alt />
                        Me encontrar
                    </b-button>

                    <b-button
                        size="sm"
                        class="mb-20"
                        :variant="choosing_point ? 'info' : 'primary'"
                        :pressed.sync="choosing_point"
                    >
                        <b-icon-hand-index-thumb />
                        <span v-if="!choosing_point">
                            Selecionar ponto no mapa
                        </span>
                        <span v-else> Parar de selecionar</span>
                    </b-button>
                </b-col>
            </b-row>
        </b-col>

        <b-col v-if="filter_result">
            <b-row align-v="end">
                <b-col cols="auto" class="mr-20">
                    <label for="distance">
                        Selecione a distância (kms)
                    </label>
                    <b-form-spinbutton
                        id="distance"
                        v-model="distance"
                        min="1"
                        max="35"
                    />
                </b-col>

                <b-col>
                    <b-button
                        :variant="disabled() ? 'secondary' : 'primary'"
                        :disabled="disabled()"
                        @click="filter"
                    >
                        Filtrar
                    </b-button>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
import L from "leaflet";
import EyeIconMsg from "@/components/EyeIconMsg";
import contains_point_on_circle from "@/util/contains";

export default {
    name: "DistanceFilter",

    props: {
        rawData: {
            type: Array,
            required: true
        },

        mapObject: Object
    },

    components: {
        EyeIconMsg
    },

    data() {
        return {
            showing_user: true,
            filter_result: false,
            choosing_point: false,
            distance: 1,
            user_point: null,
            filter_circle: null,
            map: null,
            already_sent_event: false
        };
    },

    watch: {
        filter_result() {
            if (this.user_point !== null) {
                if (this.filter_result) {
                    this.show_user_mark_on_map();
                } else {
                    this.hide_user_mark_on_map();
                }
            }

            if (!this.already_sent_event) {
                this.already_sent_event = true;
                this.$emit("get-map-object");
            }
        },

        distance() {
            if (this.user_point !== null) {
                this.filter_circle.setRadius(this.distance * 1000);
            }
        },

        choosing_point() {
            if (this.choosing_point) {
                this.map.on("click", this.set_user_marker);
            } else {
                this.map.off("click", this.set_user_marker);
            }
        }
    },

    methods: {
        disabled() {
            return this.rawData.length === 0 || this.user_point === null;
        },

        set_map_object(map) {
            this.map = map;

            this.map.on("locationfound", this.set_user_marker);

            this.map.on("locationerror", e => {
                console.log(e);
            });
        },

        toggle_user_marker() {
            if (this.showing_user) {
                this.hide_user_mark_on_map();
            } else {
                this.show_user_mark_on_map();
            }

            this.showing_user = !this.showing_user;
        },

        show_user_mark_on_map() {
            this.map.addLayer(this.filter_circle);
            this.map.addLayer(this.user_point);
        },

        hide_user_mark_on_map() {
            this.map.removeLayer(this.filter_circle);
            this.map.removeLayer(this.user_point);
        },

        find_me() {
            this.map.locate({ setView: true });
        },

        set_user_marker(event) {
            if (this.user_point === null) {
                this.user_point = L.marker(event.latlng)
                    .addTo(this.map)
                    .bindPopup("Você está aqui!");
            } else {
                this.user_point.setLatLng(event.latlng);
            }

            if (this.filter_circle === null) {
                this.filter_circle = L.circle(
                    event.latlng,
                    this.distance * 1000
                ).addTo(this.map);
            } else {
                this.filter_circle.setLatLng(event.latlng);
                this.filter_circle.setRadius(this.distance * 1000);
            }
        },

        filter() {
            const circle = this.filter_circle.getLatLng();
            const radius = this.filter_circle.getRadius();

            const data_filtered = this.rawData.filter(data =>
                contains_point_on_circle(circle, radius, {
                    x: data.px,
                    y: data.py
                })
            );

            this.$emit("data-filtered", data_filtered);
        }
    }
};
</script>

<style scoped>
@media (max-width: 850px) {
    .col-filter {
        flex-basis: 100%;
    }
}
</style>
