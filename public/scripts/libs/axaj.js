function ajax(opt) {
    var json = opt || {};
    var url = json.url;
    if (!url) {
        return;
    }
    var type = json.type || 'get';
    var data = json.data || {};
    var async = json.async === false ? json.async : true;
    var dataType = json.dataType || 'text';

    // 创建对象
    var xml = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xml.open(type, url + '?', async)
    var arr = [];
    for (var i in data) {
        arr.push(i + '=' + data[i]);
    }
    data = arr.join('&');
    url = data ? url + '?' + data : url;
    xml.onload = function(res) {
        if (res.target.status === 200) {
            if (dataType === 'json') {
                typeof json.success === 'function' && json.success(JSON.parse(res.target.response));
            } else {
                typeof json.success === 'function' && json.success(res.target.response);
            }

        } else {
            typeof json.error === 'function' && json.error(new Error('error'));
        }
    }
    switch (type.toLowerCase()) {
        case 'get':
            xml.open(type, url, async);
            xml.send();
            break;
        case 'post':
            xml.open(type, url, async);
            xml.setRequestHeader('content-type', 'Application/x-www-form-urlencoded');
            xml.send(data)
    }
}