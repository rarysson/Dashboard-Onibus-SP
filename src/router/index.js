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
            },
            {
                path: "map/busstop",
                name: "BusStopMap",
                component: () => import("../views/Map/BusStopMap.vue")
            },
            {
                path: "map/bus",
                name: "BusMap",
                component: () => import("../views/Map/BusMap.vue")
            },
            {
                path: "infos/lines",
                name: "Lines",
                component: () => import("../views/Infos/Lines.vue")
            },
            {
                path: "infos/lanes",
                name: "Lanes",
                component: () => import("../views/Infos/Lanes.vue")
            },
            {
                path: "infos/buslanes",
                name: "BusLanes",
                component: () => import("../views/Infos/BusLanes.vue")
            },
            {
                path: "infos/companies",
                name: "Companies",
                component: () => import("../views/Infos/Companies.vue")
            },
            {
                path: "forecast",
                name: "Forecast",
                component: () => import("../views/Forecast.vue")
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
