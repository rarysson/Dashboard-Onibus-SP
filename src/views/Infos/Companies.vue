<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <h1>Empresas</h1>
            </b-col>
        </b-row>

        <paginated-list
            v-if="companies.length !== 0"
            ref="list"
            :raw-data="companies"
            :empty-option="empty_option"
            :properties="properties"
        />
    </b-container>
</template>

<script>
import PaginatedList from "@/components/PaginatedList";
import API from "@/util/api";

export default {
    name: "CompaniesPage",

    components: {
        PaginatedList
    },

    data() {
        return {
            companies: [],
            empty_option: {
                title: "Ocorreu um erro de comunicação com o servidor",
                subtitle: "Tente recarregar página para resolver o problema"
            },
            properties: [
                { title: "Nome da empresa", key: "name" },
                { title: "Código da empresa", key: "id" }
            ]
        };
    },

    async mounted() {
        if (this.companies.length === 0) {
            try {
                const response = await API.get("Empresa");
                const data = response.data.e;

                data.forEach(area => {
                    area.e.forEach(company => {
                        this.companies.push({
                            id: company.c,
                            name: company.n
                        });
                    });
                });

                // Método para tornar um array de objetos com dados únicos
                this.companies = this.companies.filter(
                    (elem, index, self) =>
                        self.findIndex(t => {
                            return t.id === elem.id && t.name === elem.name;
                        }) === index
                );
            } catch (error) {
                console.log(error);
            }
        }
    }
};
</script>
