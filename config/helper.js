function respond(res, next, status, data, http_code) {
    var response = {
        'status' : status,
        'data' : data
    };
    res.setHeader('content-type', 'application/json');
    res.writeHead(http_code);
    res.end(JSON.stringify(response));
    return next();
}

module.exports.success = function success(res, next, data) {
    respond(res, next, 'success', data, 200);
}

module.exports.failure = function failure(res, next, data, http_code) {
    respond(res, next, 'failure', data, http_code);
}
