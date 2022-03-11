import express from "express";
import homepageController from "../controllers/homepageController";
import chatBotController from "../controllers/chatBotController";

let router = express.Router();

let initWebRoutes = (app)=> {
    router.get("/", homepageController.getHomepage);
    router.get("/webhook", chatBotController.getWebhook);
    router.post("/webhook", chatBotController.postWebhook);
    router.post("/setup", chatBotController.persistentmenu);
    router.get("/close",homepageController.closebrowser)

    return app.use("/", router);
};

module.exports = initWebRoutes;