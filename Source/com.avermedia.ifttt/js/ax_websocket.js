/**
 * Copyright 2021-2022 AVerMedia Technologies Inc. and respective authors and developers.
 * This source code is licensed under the MIT-style license found in the LICENSE file.
 *
 * https://github.com/AVerMedia-Technologies-Inc/CreatorCentralSDK/blob/main/RegistrationFlow.md
 */

window.AVT_CREATOR_CENTRAL;

WebSocket.prototype.sendJSON = function(json) {
    this.send(JSON.stringify(json));
};

class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, listener) {
        if (typeof this.events[event] !== 'object') {
            this.events[event] = [];
        }
        this.events[event].push(listener);
        return () => this.removeListener(event, listener);
    }
    
    removeListener(event, listener) {
        if (typeof this.events[event] === 'object') {
            const idx = this.events[event].indexOf(listener);
            if (idx > -1) {
                this.events[event].splice(idx, 1);
            }
        }
    }
    
    emit(event, ...args) {
        if (typeof this.events[event] === 'object') {
            this.events[event].forEach(listener => listener.apply(this, args));
        }
    }
    
    once(event, listener) {
        const remove = this.on(event, (...args) => {
            remove();
            listener.apply(this, args);
        });
    }
};

const AVT_CREATOR_CENTRAL_API_V2 = {
    send: function (apiType, payload, widget, uuid) {
        let context = uuid != null ? uuid: AVT_CREATOR_CENTRAL.uuid;
        let pl = {
            event : apiType,
            context : context
        };
        if (payload) {
            pl.payload = payload;
        }
        if (widget) {
            pl.widget = widget;
        }

        AVT_CREATOR_CENTRAL.connection && AVT_CREATOR_CENTRAL.connection.sendJSON(pl);
    },

    setWidgetSettings: function(widget, uuid, payload) {
        AVT_CREATOR_CENTRAL_API_V2.send('setWidgetSettings', payload, widget, uuid);
    },
    getWidgetSettings: function(widget, uuid) {
        AVT_CREATOR_CENTRAL_API_V2.send('getWidgetSettings', null, widget, uuid);
    },
    setPackageSettings: function(pkg, payload) {
        let settings = {"settings":payload};
        AVT_CREATOR_CENTRAL_API_V2.send('setPackageSettings', settings, null, pkg);
    },
    getPackageSettings: function() {
        AVT_CREATOR_CENTRAL_API_V2.send('getPackageSettings');
    },
    changeWidgetTitle: function(widget, uuid, title) {
        let payload = {"title": title};
        AVT_CREATOR_CENTRAL_API_V2.send('changeTitle', payload, widget, uuid);
    },
    changeWidgetImage: function (widget, uuid, image) {
        let payload = {"image": image};
        AVT_CREATOR_CENTRAL_API_V2.send('changeImage', payload, widget, uuid);
    },
    changeWidgetState: (widget, uuid, state) => {
        let payload = {"state": state};
        AVT_CREATOR_CENTRAL_API_V2.send('changeState', payload, widget, uuid);
    },
    sendToPropertyView: (widget, uuid, payload) => {
        AVT_CREATOR_CENTRAL_API_V2.send('sendToPropertyView', payload, widget, uuid);
    },
    sendToPackage: (widget, payload) => {
        AVT_CREATOR_CENTRAL_API_V2.send('sendToPackage', payload, widget);
    },
    sendDebugLog: (message) => {
        let payload = {"message": message};
        AVT_CREATOR_CENTRAL_API_V2.send('sendLog', payload);
    },
    
    // below are callbacks waiting to be implemented
    onPackageSettings: (payload) => {
        console.log(`[package] settings: ${JSON.stringify(payload)}`);
    },
    onWidgetSettings: (widget, uuid, payload) => {
        console.log(`[widget] settings: ${widget}(${uuid}): ${JSON.stringify(payload)}`);
    },
    onWidgetStart: (widget, uuid, state) => {
        console.log(`[widget] start: ${widget}(${uuid}) (state=${state})`);
    },
    onWidgetStop: (widget, uuid, state) => {
        console.log(`[widget] stop: ${widget}(${uuid}) (state=${state})`);
    },
    onPropertyStart: (widget, uuid) => {
        console.log(`[property] start: ${widget}(${uuid})`);
    },
    onPropertyStop: (widget, uuid) => {
        console.log(`[property] stop: ${widget}(${uuid})`);
    },
    onWidgetActionDown: (widget, uuid, state) => {
        console.log(`DOWN ${widget}(${uuid})(state=${state})`);
    },
    onWidgetActionUp: (widget, uuid, state) => {
        console.log(`UP ${widget}(${uuid})(state=${state})`);
    },
    onWidgetTrigger: (widget, uuid, state) => {
        console.log(`CLICK ${widget}(${uuid})(state=${state})`);
    },
    onPackageMessage: (widget, uuid, payload) => {
        console.log(`onPackageMessage: ${widget}(${uuid}): ${JSON.stringify(payload)}`);
    },
    onPropertyMessage: (widget, uuid, payload) => {
        console.log(`onPropertyMessage: ${widget}(${uuid}): ${JSON.stringify(payload)}`);
    },
    
    // add this at the bottom, internal connection callback
    onAppConnected: (port, uuid, widgetInfo) => {
        console.log(`create a new WebSocket with port ${port} to ${uuid}`);
    }
};

// main
AVT_CREATOR_CENTRAL = (function() {
    function parseJson (jsonString) {
        if (typeof jsonString === 'object') return jsonString;
        try {
            const o = JSON.parse(jsonString);
            if (o && typeof o === 'object') {
                return o;
            }
        } catch (e) {}
        return false;
    }

    function init() {
        let inPort, inUUID, inMessageType, inWidgetInfo;
        let websocket = null;
        let events = new EventEmitter();

        function connect(port, uuid, inEvent, inInfo, widgetInfo) {
            inPort = port;
            inUUID = uuid;
            inMessageType = inEvent;
            inWidgetInfo = widgetInfo;
            
            websocket = new WebSocket(`ws://localhost:${inPort}`);

            websocket.onopen = function() {
                let json = {
                    event : inMessageType,
                    uuid: inUUID
                };
                websocket.sendJSON(json);
                
                AVT_CREATOR_CENTRAL.uuid = inUUID;
                AVT_CREATOR_CENTRAL.connection = websocket;
                
                events.emit('webSocketConnected', {
                    port: inPort,
                    uuid: inUUID,
                    widget: inWidgetInfo,
                    connection: websocket
                });
            };

            websocket.onerror = function(evt) {
                console.warn('WEBSOCKET ERROR', evt, evt.data);
            };

            websocket.onclose = function(evt) {
                console.warn('error', evt); // Websocket is closed
            };

            websocket.onmessage = function(evt) {
                if (evt.data) {
                    let jsonObj = parseJson(evt.data);
                    events.emit(jsonObj.event, jsonObj);
                }
            };
        }

        return {
            connect: connect,
            uuid: inUUID,
            widget: inWidgetInfo,
            on: (event, callback) => events.on(event, callback),
            emit: (event, callback) => events.emit(event, callback),
            connection: websocket
        };
    }

    return init();
})();

/**
 * WebSocket connected
 */
AVT_CREATOR_CENTRAL.on('webSocketConnected', data => {
    let port = data["port"];
    let uuid = data["uuid"];
    let info = data["widget"];
    AVT_CREATOR_CENTRAL_API_V2.onAppConnected(port, uuid, info);
});

/**
 * Event received after sending the getWidgetSettings event to retrieve 
 * the persistent data stored for the widget.
 */
AVT_CREATOR_CENTRAL.on('didReceiveWidgetSettings', data => {
    let widget = data["widget"];
    let uuid = data["context"];
    let payload = data["payload"];
    AVT_CREATOR_CENTRAL_API_V2.onWidgetSettings(widget, uuid, payload);
});

/**
 * Event received after sending the getPackageSettings event to retrieve 
 * the persistent data stored for the Package.
 */
AVT_CREATOR_CENTRAL.on('didReceivePackageSettings', data => {
    let payload = {};
    if (data["payload"] != null && data["payload"]["settings"] != null) {
        payload = data["payload"]["settings"];
    } 
    AVT_CREATOR_CENTRAL_API_V2.onPackageSettings(payload);
});
