try {
    var express = require('express');
    var methods = require('methods');
} catch (e) {
    console.error("Express is not found");
    process.exit(e.code);
}

methods = new Set(methods);

function exprestful() {
    express.Router.api = api;
    return express.Router();
}

/**
 * 
 * @param {String} method 
 * @param {String|Object|Promise|Function} handle 
 * @param {Function=} middleware 
 */
function api(route, handle, middleware) {
    runner(this, route, "all", handle, middleware);
}

function runner(router, route, method, handle, middleware) {
    parameterValidations(route, handle, middleware);
    if (!middleware) {
        middleware = (req, res, next) => {
            next();
        };
    }
    switch (typeof handle) {
        case 'boolean':
            responseString(router, route, method, handle.toString(), middleware);
            break;
        case 'string':
            responseString(router, route, method, handle, middleware);
            break;
        case 'number':
            responseString(router, route, method, handle.toString(), middleware);
            break;
        case 'bigint':
            responseString(router, route, method, handle.toString(), middleware);
            break;
        case 'symbol':
            responseString(router, route, method, handle.toString(), middleware);
            break;
        case 'undefined':
            responseString(router, route, method, 'undefined', middleware);
            break;
        case 'object':
            if (isPromise(handle)) {
                responsePromise(router, route, method, handle, middleware);
            } else {
                responseObject(router, route, method, handle, middleware);
            }
            break;
        case 'function':
            responseFunction(router, route, method, handle, middleware);
            break;
        default:
            responseString(router, route, method, "", middleware);
            break;
    }
}

function responseString(router, route, method, handle, middleware) {
    router[method](route, middleware, (req, res) => {
        res.send(handle);
    });
}

function responseObject(router, route, method, handle, middleware) {
    if (handle instanceof RegExp) {
        handle = handle.toString();
        router[method](route, middleware, (req, res) => {
            res.json(handle);
        });
    } else {
        var hasMethod = false;
        var invalidKey = false;
        var keys = Object.keys(handle);
        for (let i = 0; i < keys.length; i++) {
            if (methodValidation(keys[i])) {
                hasMethod = true;
                break;
            }
        }
        if (hasMethod) {
            for (let i = 0; i < keys.length; i++) {
                if (!methodValidation(keys[i])) {
                    invalidKey = true;
                    break;
                }
            }
        }

        if (!invalidKey) {
            if (hasMethod) {
                keys.forEach((key) => {
                    runner(router, route, key, handle[key], middleware);
                });
            } else {
                router[method](route, middleware, (req, res) => {
                    res.json(handle);
                });
            }
        } else {
            throw new TypeError('Invalid key');
        }
    }
}

function responsePromise(router, route, method, handle, middleware) {
    handle.then((result) => {
        router[method](route, middleware, (req, res) => {
            switch (typeof result) {
                case 'string':
                    res.send(result);
                    break;
                case 'object':
                    res.json(result);
                    break;
                case 'bigint':
                    res.send(result.toString());
                    break;
                case 'boolean':
                    res.send(result.toString());
                    break;
                case 'number':
                    res.send(result.toString());
                    break;
                case 'symbol':
                    res.send(result.toString());
                    break;
                case 'undefined':
                    res.send("undefined");
                    break;
                case 'function':
                    res.send(result());
                    break;
                default:
                    res.send("");
                    break;
            }
        });
    }).catch((err) => {
        res.send(err.toString());
    });
}

function responseFunction(router, route, method, handle, middleware) {
    router[method](route, middleware, handle);
}

function parameterValidations(route, handle, middleware) {
    if (!routeValidation(route)) {
        throw new TypeError('Invalid route');
    }
    if (!handleValidation(handle)) {
        throw new TypeError('Invalid handle');
    }
    if (middleware !== undefined && typeof middleware !== 'function') {
        throw new TypeError('Invalid middleware');
    }
}

function routeValidation(route) {
    return (route) &&
        (typeof route === 'string') &&
        (route.length > 0);
}

function methodValidation(method) {
    return (method) &&
        (typeof method === 'string') &&
        (method.length > 0) &&
        (methods.has(method));
}

function handleValidation(handle) {
    return (handle !== undefined) &&
        (
            typeof handle === 'bigint' ||
            typeof handle === 'boolean' ||
            typeof handle === 'string' ||
            typeof handle === 'number' ||
            typeof handle === 'object' ||
            typeof handle === 'function'
        );
}

function isPromise(promise) {
    return typeof promise.then == 'function';
}

module.exports = exprestful;