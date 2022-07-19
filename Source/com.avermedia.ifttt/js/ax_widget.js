/**
 * Copyright 2021-2022 AVerMedia Technologies Inc. and respective authors and developers.
 * This source code is licensed under the MIT-style license found in the LICENSE file.
 *
 * https://github.com/AVerMedia-Technologies-Inc/CreatorCentralSDK/blob/main/RegistrationFlow.md
 *
 * Include this script AFTER ax_websocket.js
 */

/**
 * The package and Property View can send following events to Creator Central application
 */
const setWidgetSettings = AVT_CREATOR_CENTRAL_API_V2.setWidgetSettings;
const getWidgetSettings = AVT_CREATOR_CENTRAL_API_V2.getWidgetSettings;
const setPackageSettings = AVT_CREATOR_CENTRAL_API_V2.setPackageSettings;
const getPackageSettings = AVT_CREATOR_CENTRAL_API_V2.getPackageSettings;
const sendDebugLog = AVT_CREATOR_CENTRAL_API_V2.sendDebugLog;
/**
 * The following events is additional to package
 */
const changeWidgetTitle = AVT_CREATOR_CENTRAL_API_V2.changeWidgetTitle;
const changeWidgetImage = AVT_CREATOR_CENTRAL_API_V2.changeWidgetImage;
const changeWidgetState = AVT_CREATOR_CENTRAL_API_V2.changeWidgetState;
const sendToPropertyView = AVT_CREATOR_CENTRAL_API_V2.sendToPropertyView;
//const openUrl = AVT_CREATOR_CENTRAL_API_V2.openUrl;

/**
 * Creator Central entry point
 */
function connectCreatorCentral(port, uuid, inEvent, inInfo) {
    AVT_CREATOR_CENTRAL.connect(port, uuid, inEvent, inInfo, null);
}

/**
 * When an instance of a widget is displayed on Creator Central, for example, 
 * when the profile loaded, the package will receive a willAppear event.
 */
AVT_CREATOR_CENTRAL.on('widgetWillAppear', data => {
    let widget = data["widget"];
    let uuid = data["context"];
    let state = data["payload"]["state"] != null ? data["payload"]["state"] : -1;
    AVT_CREATOR_CENTRAL_API_V2.onWidgetStart(widget, uuid, state);
});

/**
 * When switching profile, an instance of a widget will be invisible, 
 * the package will receive a willDisappear event.
 */
AVT_CREATOR_CENTRAL.on('widgetWillDisappear', data => {
    let widget = data["widget"];
    let uuid = data["context"];
    //let state = data["payload"]["state"] != null ? data["payload"]["state"] : -1;
    AVT_CREATOR_CENTRAL_API_V2.onWidgetStop(widget, uuid, -2);
});

/**
 * When user selected a widget on the panel, the package will receive this event.
 */
AVT_CREATOR_CENTRAL.on('propertyViewDidAppear', data => {
    let widget = data["widget"];
    let uuid = data["context"];
    AVT_CREATOR_CENTRAL_API_V2.onPropertyStart(widget, uuid);
});

/**
 * When user selected a different widget on the panel, the package will receive this event.
 */
AVT_CREATOR_CENTRAL.on('propertyViewDidDisappear', data => {
    let widget = data["widget"];
    let uuid = data["context"];
    AVT_CREATOR_CENTRAL_API_V2.onPropertyStop(widget, uuid);
});

/**
 * When the user presses a display view on the panel or a function key of AX devices, 
 * the package will receive the keyDown event.
 */
AVT_CREATOR_CENTRAL.on('actionDown', data => {
    let widget = data["widget"];
    let uuid = data["context"];
    let state = data["payload"]["state"] != null ? data["payload"]["state"] : -1;
    AVT_CREATOR_CENTRAL_API_V2.onWidgetActionDown(widget, uuid, state);
});

/**
 * When the user releases a display view on the panel or a function key of AX devices, 
 * the package will receive the keyUp event.
 */
AVT_CREATOR_CENTRAL.on('actionUp', data => {
    let widget = data["widget"];
    let uuid = data["context"];
    let state = data["payload"]["state"] != null ? data["payload"]["state"] : -1;
    AVT_CREATOR_CENTRAL_API_V2.onWidgetActionUp(widget, uuid, state);
});

/**
 * When the user presses a display view and then releases within it, the package 
 * will receive the widgetTriggered event.
 */
AVT_CREATOR_CENTRAL.on('actionTriggered', data => {
    let widget = data["widget"];
    let uuid = data["context"];
    let state = data["payload"]["state"] != null ? data["payload"]["state"] : -1;
    AVT_CREATOR_CENTRAL_API_V2.onWidgetTrigger(widget, uuid, state);
});

/**
 * When user selected a different widget on the panel, the package will receive this event.
 */
AVT_CREATOR_CENTRAL.on('sendToPackage', data => {
    let widget = data["widget"];
    let uuid = data["context"];
    let payload = data["payload"];
    AVT_CREATOR_CENTRAL_API_V2.onPackageMessage(widget, uuid, payload);
});
