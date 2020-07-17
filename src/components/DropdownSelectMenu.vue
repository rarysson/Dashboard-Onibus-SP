<template>
    <b-dropdown
        :text="title"
        :offset="offset"
        :block="block"
        menu-class="dropdown-menu-class"
        @shown="show"
        @hidden="hide"
    >
        <b-dropdown-item-button
            v-for="(option, index) in options"
            :key="index"
            class="dropdown-select-item"
        >
            <b-form-radio v-model="selected_item" :value="index">
                {{ option }}
            </b-form-radio>
        </b-dropdown-item-button>
        <b-dropdown-item-button v-if="options.length === 0">
            {{ emptyOption }}
        </b-dropdown-item-button>
    </b-dropdown>
</template>

<script>
export default {
    name: "DropdownSelectMenu",

    props: ["title", "options", "offset", "selected", "block", "emptyOption"],

    data() {
        return {
            selected_item: this.selected,
            value_menu_class: null
        };
    },

    watch: {
        selected_item(val) {
            this.$emit("change", val);
        },

        selected(val) {
            this.selected_item = val;
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

<style>
.dropdown-select-item {
    padding: 0.35rem 0;
}

.dropdown-select-item:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.dropdown-menu-class {
    min-width: 100%;
    max-height: 200px;
    overflow: auto;
}
</style>
