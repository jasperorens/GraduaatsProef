const Pusher = require("pusher");

const pusher = new Pusher({
    appId: "1806141",
    key: "cdffdac27fe6636df8ef",
    secret: "554b8f41dbb0e41b3147",
    cluster: "eu",
    useTLS: true
});

module.exports = pusher;
