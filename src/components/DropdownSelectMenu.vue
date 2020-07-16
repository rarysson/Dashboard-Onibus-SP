<template>
    <b-dropdown :text="title" :offset="offset" @shown="show" @hidden="hide">
        <b-dropdown-item-button
            v-for="(option, index) in options"
            :key="index"
            class="dropdown-select-item"
        >
            <b-form-radio v-model="selected_item" :value="index">
                {{ option }}
            </b-form-radio>
        </b-dropdown-item-button>
    </b-dropdown>
</template>

<script>
export default {
    name: "DropdownSelectMenu",

    props: ["title", "options", "offset"],

    data() {
        return {
            selected_item: null
        };
    },

    watch: {
        selected_item(val) {
            this.$emit("change", val);
        }
    },

    methods: {
        show() {
            this.$emit("shown");
        },

        hide() {
            this.$emit("hidden");
        }
    }
};
</script>

<style scoped>
.dropdown-select-item {
    padding: 0.35rem 0;
}

.dropdown-select-item:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
