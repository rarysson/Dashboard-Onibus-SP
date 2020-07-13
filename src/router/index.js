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
                component: () => import("../views/Home.vue"),
                children: [
                    {
                        path: "",
                        component: () => import("../views/Home/Index.vue")
                    },
                    {
                        path: "map/bus",
                        name: "BusMap",
                        component: () => import("../views/Home/BusMap.vue")
                    },
                    {
                        path: "map/busstop",
                        name: "BusStopMap",
                        component: () => import("../views/Home/BusStopMap.vue")
                    }
                ]
            },
            {
                path: "infos",
                name: "Infos",
                component: () => import("../views/Infos.vue")
            },
            {
                path: "prediction",
                name: "Prediction",
                component: () => import("../views/Prediction.vue")
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
