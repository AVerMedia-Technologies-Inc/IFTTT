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
 * The following events is additional to property view
 */
const sendToPackage = AVT_CREATOR_CENTRAL_API_V2.sendToPackage;

/**
 * Creator Central entry point
 */
function connectCreatorCentral(port, uuid, inEvent, inInfo, inWidgetInfo) {
    AVT_CREATOR_CENTRAL.connect(port, uuid, inEvent, inInfo, inWidgetInfo);
}

/**
 * When Package calls setToPropertyView
 */
AVT_CREATOR_CENTRAL.on('sendToPropertyView', data => {
    let widget = data["widget"];
    let uuid = data["context"];
    let payload = data["payload"];
    AVT_CREATOR_CENTRAL_API_V2.onPropertyMessage(widget, uuid, payload);
});

