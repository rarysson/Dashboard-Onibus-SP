<template>
    <b-row>
        <b-col cols="12">
            <b-form-checkbox v-model="filter_result" size="lg" class="mb-20">
                Filtrar o resultado por tempo
            </b-form-checkbox>
        </b-col>

        <b-col v-if="filter_result">
            <b-row align-v="end">
                <b-col cols="auto" class="mr-20">
                    <label for="time">
                        Selecione o tempo mínimo (mins)
                    </label>
                    <b-form-spinbutton
                        id="time"
                        min="1"
                        max="59"
                        v-model="time"
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
export default {
    name: "TimeFilter",

    props: {
        rawData: {
            type: Array,
            required: true
        },

        mapObject: Object
    },

    data() {
        return {
            filter_result: false,
            already_sent_event: false,
            time: 1,
            map: null
        };
    },

    watch: {
        filter_result() {
            if (!this.already_sent_event) {
                this.already_sent_event = true;
                this.$emit("get-map-object");
            }
        }
    },

    methods: {
        disabled() {
            return this.rawData.length === 0;
        },

        set_map_object(map) {
            this.map = map;
        },

        filter() {
            const now = new Date();

            const data_filtered = this.rawData.filter(data => {
                const [bus_hour, bus_minute] = data.time.split(":");
                const hours = bus_hour * 60 - now.getHours() * 60;
                const minutes = bus_minute - now.getMinutes();
                const forecast = hours + minutes;

                return forecast <= this.time;
            });

            this.$emit("data-filtered", data_filtered);
        }
    }
};
</script>
