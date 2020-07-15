<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-button
                    size="lg"
                    variant="info"
                    class="button"
                    to="/infos/lines"
                >
                    Ver linhas
                </b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-button
                    size="lg"
                    variant="info"
                    class="button"
                    to="/infos/companies"
                >
                    Ver empresas
                </b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-button
                    size="lg"
                    variant="info"
                    class="button"
                    to="/infos/buslanes"
                >
                    Ver corredores
                </b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-button
                    size="lg"
                    variant="info"
                    class="button"
                    to="/infos/lanes"
                >
                    Ver vias
                </b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    name: "InfosPage"
};
</script>

<style scoped>
.button {
    width: 200px;
    margin-bottom: 30px;
}
</style>
