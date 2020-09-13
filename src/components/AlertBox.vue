<template>
    <transition>
        <b-alert
            dismissible
            class="alert"
            :show="count_down"
            :variant="color"
            @dismissed="count_down = 0"
            @dismiss-count-down="count_down_changed"
        >
            <b>{{ text }}</b>

            <b-progress
                :variant="color"
                :max="timer"
                :value="count_down"
                height="2px"
            />
        </b-alert>
    </transition>
</template>

<script>
export default {
    name: "AlertBox",

    props: {
        message: String,

        variant: String
    },

    data() {
        return {
            timer: 3,
            count_down: 0,
            text: this.message,
            color: this.variant
        };
    },

    methods: {
        fire_message(text, variant) {
            this.text = text;
            this.color = variant;
            this.count_down = this.timer;
        },

        count_down_changed(val) {
            this.count_down = val;
        }
    }
};
</script>

<style scoped>
.alert {
    position: fixed;
    top: 50px;
    right: 20px;
    z-index: 1000;
    animation: shake-x 1s;
}

@keyframes shake-x {
    25% {
        transform: translateX(5px);
    }

    50% {
        transform: translateX(-10px);
    }

    75% {
        transform: translateX(10px);
    }

    100% {
        transform: translateX(-5px);
    }
}

.alert.v-enter-active {
    transform: translateX(100%);
}
</style>
