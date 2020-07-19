<template>
    <b-row>
        <b-col>
            <b-row class="data-row">
                <b-col cols="12">
                    <b-list-group
                        v-if="rawData === undefined || all_data.length === 0"
                    >
                        <b-list-group-item>
                            <b style="font-size: 1.5rem">
                                {{ emptyOption.title }}
                            </b>
                            <br />
                            <i style="font-size: 0.8rem">
                                {{ emptyOption.subtitle }}
                            </i>
                        </b-list-group-item>
                    </b-list-group>

                    <b-list-group v-else>
                        <b-list-group-item
                            v-for="(data, index) in paginated_data"
                            :key="index"
                            class="data-list-item"
                        >
                            <div
                                v-for="(property, i) in properties"
                                :key="i"
                                class="data-div"
                            >
                                <span class="data-title">
                                    <b>{{ property.title }}</b>
                                </span>

                                <span class="data-info">
                                    {{ data[property.key] }}
                                </span>
                            </div>
                        </b-list-group-item>
                    </b-list-group>
                </b-col>
            </b-row>

            <b-row v-if="all_data.length !== 0">
                <b-col>
                    <b-pagination
                        align="right"
                        v-model="current_page"
                        :total-rows="total_rows"
                        :per-page="per_page"
                        @change="page_changed"
                    />
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
export default {
    name: "PaginatedList",

    props: ["rawData", "emptyOption", "properties"],

    data() {
        return {
            all_data: this.rawData || [],
            paginated_data: [],
            current_page: 1,
            per_page: 5
        };
    },

    mounted() {
        this.reset_pages();
    },

    computed: {
        total_rows() {
            return this.all_data.length;
        }
    },

    methods: {
        reset_data(data) {
            this.all_data = data;
            this.reset_pages();
        },

        reset_pages() {
            this.current_page = 1;
            this.paginate(this.per_page, 0);
        },

        paginate(page_size, page_number) {
            this.paginated_data = this.all_data.slice(
                page_number * page_size,
                (page_number + 1) * page_size
            );
        },

        page_changed(page) {
            this.paginate(this.per_page, page - 1);
        }
    }
};
</script>

<style scoped>
.data-row {
    height: 70vh;
    margin-top: 50px;
}

.data-list-item {
    display: flex;
    padding: 0;
    margin-bottom: 20px;
    border: 1px solid var(--gray-dark);
    border-radius: 5px;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.3);
}

.data-div {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.data-div:not(:last-child) {
    border-right: 3px solid var(--gray-dark);
}

.data-list-item span {
    width: 100%;
    text-align: center;
    padding: 5px 0;
}

.data-title {
    font-size: 1.1rem;
    color: var(--white);
    background-color: var(--dark);
}

.data-info {
    font-size: 0.9rem;
}
</style>
