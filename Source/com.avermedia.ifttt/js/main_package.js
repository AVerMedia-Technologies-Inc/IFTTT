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

function refreshWidgetUi(uuid, config) {
    let widget = config["widget"];

    if (!isWidgetClickable(config)) {
        setWidgetEnabled(widget, uuid, false);
        return; // no need to check more
    }

    setWidgetPressed(widget, uuid, config["pressed"]);
}

AVT_CREATOR_CENTRAL_API_V2.onAppConnected = function(port, uuid, widgetInfo) {
    console.log(`onAppConnected: ${port}`);
    getPackageSettings(); // request old settings
}

AVT_CREATOR_CENTRAL_API_V2.onPackageSettings = function(payload) {
    if (payload["maker_key"] != null) {
        g_makerKey = payload["maker_key"]; // get global maker key for multiple widgets
    }
}

AVT_CREATOR_CENTRAL_API_V2.onWidgetSettings = function(widget, uuid, payload) {
    console.log(`onWidgetSettingsReceived: ${uuid}`);//${JSON.stringify(payload)}
    // use previous maker key as default value
    if (payload["maker_key"] == null && g_makerKey != "") {
        payload["maker_key"] = g_makerKey;
    }
    
    configData[uuid] = payload; // cache the settings for future use
    configData[uuid].widget = widget; // pass widget name in json
    configData[uuid]["pressed"] = false; // set default not pressed
	setTimeout(()=> {
        refreshWidgetUi(uuid, configData[uuid]); // refresh widget if necessary
	}, 200);
}

AVT_CREATOR_CENTRAL_API_V2.onPackageMessage = function(widget, uuid, payload) {
    console.log(`onPackageReceived: ${uuid}`);
    if (payload["debug"] != null) {
        let makerKey = configData[uuid]["maker_key"];
        let eventName = configData[uuid]["event_name"];
        let request = new HttpReq();
        request.get(`https://maker.ifttt.com/trigger/${eventName}/with/key/${makerKey}`, data => {
            // blocked by CORS policy from IFTTT server.
        });
    }
}

AVT_CREATOR_CENTRAL_API_V2.onPropertyStart = function(widget, uuid) {
    console.log(`[PROPERTY][START] ${uuid}`);
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
            console.log("Bello!"); // blocked by CORS policy from IFTTT server.
        });
    }
}

AVT_CREATOR_CENTRAL_API_V2.onWidgetActionDown = function(widget, uuid, state) {
    if (configData[uuid] != null) {
        configData[uuid]["pressed"] = true;
        refreshWidgetUi(uuid, configData[uuid]); // refresh widget if necessary
    }
}

AVT_CREATOR_CENTRAL_API_V2.onWidgetActionUp = function(widget, uuid, state) {
    if (configData[uuid] != null) {
        configData[uuid]["pressed"] = false;
        refreshWidgetUi(uuid, configData[uuid]); // refresh widget if necessary
    }
}
