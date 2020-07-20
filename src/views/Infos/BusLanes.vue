<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <h1>Corredores</h1>
            </b-col>
        </b-row>

        <paginated-list
            v-if="bus_lanes.length !== 0"
            ref="list"
            :raw-data="bus_lanes"
            :empty-option="empty_option"
            :properties="properties"
        />

        <b-row v-else align-h="center">
            <b-col cols="auto">
                <b-spinner variant="primary" />
            </b-col>
        </b-row>

        <alert-box ref="alert" />
    </b-container>
</template>

<script>
import PaginatedList from "@/components/PaginatedList";
import AlertBox from "@/components/AlertBox";
import API from "@/util/api";

export default {
    // BusLanes são os corredores de ônibus
    name: "BusLanesPage",

    components: {
        PaginatedList,
        AlertBox
    },

    data() {
        return {
            bus_lanes: [],
            empty_option: {
                title: "Ocorreu um erro de comunicação com o servidor",
                subtitle: "Tente recarregar página para resolver o problema"
            },
            properties: [
                { title: "Nome do corredor", key: "name" },
                { title: "Código do corredor", key: "id" }
            ]
        };
    },

    async mounted() {
        if (this.bus_lanes.length === 0) {
            try {
                const response = await API.get("Corredor");
                const data = response.data;

                data.forEach(bus_lane => {
                    this.bus_lanes.push({
                        id: bus_lane.cc,
                        name: bus_lane.nc
                    });
                });
            } catch (error) {
                this.$refs.alert.fire_message(
                    `Erro com o servidor
                        erro: ${error}`,
                    "danger"
                );
            }
        }
    }
};
</script>
