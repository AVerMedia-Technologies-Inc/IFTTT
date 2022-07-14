/**
 * Copyright 2021-2022 AVerMedia Technologies Inc. and respective authors and developers.
 * This source code is licensed under the MIT-style license found in the LICENSE file.
 *
 * https://github.com/AVerMedia-Technologies-Inc/CreatorCentralSDK/blob/main/RegistrationFlow.md
 *
 * Include this script AFTER ax_property.js
 */
let widgetUuid = "";
let widgetName = "";

AVT_CREATOR_CENTRAL_API_V2.onAppConnected = function(port, uuid, widgetInfo) {
    widgetUuid = widgetInfo["context"];
    widgetName = widgetInfo["widget"];
}

AVT_CREATOR_CENTRAL_API_V2.onPropertyMessage = function(widget, uuid, payload) {
    // we may cached maker key from previous widgets, use it as quick setup
    if (payload["maker_key"] != null) {
        $("#makerKey").val(payload["maker_key"]);
    }
}

AVT_CREATOR_CENTRAL_API_V2.onWidgetSettings = function(widget, uuid, payload) {
    if (payload["maker_key"] != null) {
        $("#makerKey").val(payload["maker_key"]);
    }
    if (payload["event_name"] != null) {
        $("#eventName").val(payload["event_name"]);
    }
}

function saveWidgetSettings() {
    // refresh value from GUI
    const makerKey = $("#makerKey").val();
    const eventName = $("#eventName").val();

    let packageJson = { "maker_key": makerKey };
    setPackageSettings("com.avermedia.ifttt", packageJson);

    let widgetJson = { "maker_key":  makerKey, "event_name": eventName };
    setWidgetSettings(widgetName, widgetUuid, widgetJson);
}

$(document).ready(function(){
    $("#iftttApplet").click(function() {
        window.alert("Create new Applet"); // FIXME: open browser
    });

    $("#userGuide").click(function() {
        window.alert("Open user guide"); // FIXME: open browser
    });

    $('#makerKey').on('input',function(e){
        saveWidgetSettings();
    });

    $('#eventName').on('input',function(e){
        saveWidgetSettings();
    });
});
