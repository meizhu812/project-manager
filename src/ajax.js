function isValidOptions(options) {
  function hasValidUrl(options) {
    return true;
  }

  function hasValidMethod(options) {
    return ['get', 'post', 'put', 'delete'].includes(options.method);
  }

  function hasValidCallbacks(options) {
    return typeof options.success === "function" && typeof options.fail === "function"
  }

  return hasValidUrl(options) && hasValidMethod(options) && hasValidCallbacks(options);

}

function toURLParams(paramsJson) {
  if (paramsJson) {
    return Object.keys(paramsJson).map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(paramsJson[key]);
    }).join("&");
  }
  return ""
}

function setHeaders(headersJson) {
  if (headersJson) {
    Object.keys(headersJson).map(function (key) {
      this.setRequestHeader(key, headersJson[key])
    })
  }
}

export default (options) => {
  if (!isValidOptions(options)) {
    console.log('Invalid AJAX options\n' + JSON.stringify(options));
    return -1;
  }
  let request = new XMLHttpRequest();

  request.open(options.method.toUpperCase(), options.url + toURLParams(request.params));
  // if (options.data) {
  //   request.setRequestHeader('Content-Type', "application/json");
  // }
  setHeaders.call(request, request.headers);
  request.onload = function () {
    if (request.status >= 200 && request.status < 300) {
      if (options.successParams) {
        options.success(...options.successParams);
      } else {
        options.success(JSON.parse(request.responseText));
      }
    } else {
      options.fail(request.responseText);
    }
  };
  request.onerror = function () {
    console.log('Request Error!');
  };


  if (options.data) {
    request.send(JSON.stringify(options.data));
  } else {
    request.send();
  }
}