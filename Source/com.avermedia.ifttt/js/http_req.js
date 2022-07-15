/**
 * Copyright 2021-2022 AVerMedia Technologies Inc. and respective authors and developers.
 * This source code is licensed under the MIT-style license found in the LICENSE file.
 */
 
function HttpReq(timeout = 3000) {
    let xmlHttp = new XMLHttpRequest();
    let _callback = json => {};
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status >= 200 && xmlHttp.status <= 204) {
                _callback(xmlHttp.responseText);
            } else {
                console.log(`error: ${xmlHttp.status} ${xmlHttp.statusText}`);
                _callback(`{"status": ${xmlHttp.status}}`);
            }
        } else {
            //console.log(`readyState: ${xmlHttp.readyState}`);
            //console.log(`    status: ${xmlHttp.status} ${xmlHttp.statusText}`);
        }
    }
    xmlHttp.timeout = timeout;
    
    this.get = (url, callback) => {
        _callback = callback;
        xmlHttp.open("GET", url, true);
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        xmlHttp.send();
    }
    
    this.post = (url, body, callback) => {
        _callback = callback;
        xmlHttp.open("POST", url, true);
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        xmlHttp.send(JSON.stringify(body));
    }
    
    this.put = (url, body, callback) => {
        _callback = callback;
        xmlHttp.open("PUT", url, true);
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        xmlHttp.send(JSON.stringify(body));
    }
}
