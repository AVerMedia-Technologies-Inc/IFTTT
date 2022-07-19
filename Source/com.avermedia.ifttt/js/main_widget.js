/**
 * Copyright 2021-2022 AVerMedia Technologies Inc. and respective authors and developers.
 * This source code is licensed under the MIT-style license found in the LICENSE file.
 */
let configData = {}; // configs that need to stored in Creator Central
let g_makerKey = "";

function isWidgetClickable(config) {
    let makerKey = "";
    if (config["maker_key"] != null) {
        makerKey = config["maker_key"];
    }

    let eventName = "";
    if (config["event_name"] != null) {
        eventName = config["event_name"];
    }

    return makerKey != "" && eventName != "";
}

function drawWidgetImage(ready, callback) {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
    //context.fillStyle = "#000000";
    //context.fillRect(0, 0, canvas.width, canvas.height);

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "28px sans-serif"
    context.fillStyle = "#fefefe";
    
    let img = new Image();
    img.onload = function() {
        if (!ready) { // draw invalid icon over image
            var invalid = new Image();
            invalid.onload = function() {
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                context.fillText("IFTTT", canvas.width / 2, canvas.height - 24);
                context.drawImage(invalid, 0, 0, canvas.width, canvas.height);
                callback(canvas.toDataURL('image/png', 1));
            }
            invalid.src = "images/disabled.png";
        } else {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            context.fillText("IFTTT", canvas.width / 2, canvas.height - 24);
            callback(canvas.toDataURL('image/png', 1));
        }
    }
    img.src = "images/mainpage_btn_plugin_ifttt.svg";
}

function refreshWidgetUi(uuid, config) {
    let widget = config["widget"];

    drawWidgetImage(isWidgetClickable(config), (image) => {
        changeWidgetImage(widget, uuid, image);
    });
}

AVT_CREATOR_CENTRAL_API_V2.onAppConnected = function(port, uuid, widgetInfo) {
    getPackageSettings(); // request old settings
}

AVT_CREATOR_CENTRAL_API_V2.onPackageSettings = function(payload) {
    if (payload["maker_key"] != null) {
        g_makerKey = payload["maker_key"]; // get global maker key for multiple widgets
    }
}

AVT_CREATOR_CENTRAL_API_V2.onWidgetSettings = function(widget, uuid, payload) {
    // use previous maker key as default value
    if (payload["maker_key"] == null && g_makerKey != "") {
        payload["maker_key"] = g_makerKey;
    }
    
    configData[uuid] = payload; // cache the settings for future use
    configData[uuid].widget = widget; // pass widget name in json
    refreshWidgetUi(uuid, configData[uuid]); // refresh widget if necessary
}

AVT_CREATOR_CENTRAL_API_V2.onPropertyStart = function(widget, uuid) {
    let payload = configData[uuid]; // post default configs to property
    sendToPropertyView(widget, uuid, payload);
}

AVT_CREATOR_CENTRAL_API_V2.onWidgetTrigger = function(widget, uuid, state) {
    // make sure the widget is clickable
    if (configData[uuid] != null && isWidgetClickable(configData[uuid])) {
        let makerKey = configData[uuid]["maker_key"];
        let eventName = configData[uuid]["event_name"];
        let request = new HttpReq();
        request.get(`https://maker.ifttt.com/trigger/${eventName}/with/key/${makerKey}`, data => {
            // blocked by CORS policy from IFTTT server.
        });
    }
}
