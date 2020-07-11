import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/Index.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        component: Index,
        children: [
            {
                path: "",
                name: "Home",
                component: () => import("../views/Home.vue")
            }
        ]
    }
];

if (process.env.MODE !== "ssr") {
    routes.push({
        path: "*",
        component: () => import("../views/Error404.vue")
    });
}

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;
