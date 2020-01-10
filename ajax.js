function isValidOptions(options) {  // TODO GET & DELETE only!!!
  let hasValidUrl = (options) => !options.url.includes("?");
  let hasValidMethod = (options) => ["GET", "DELETE"].includes(options.method.toUpperCase());
  let hasValidCallbacks = (options) => typeof options.onSuccess === "function" && typeof options.onFail === "function";
  return hasValidUrl(options) && hasValidMethod(options) && hasValidCallbacks(options);
}

function isSuccess(request, method) {  // TODO GET & DELETE only!!!
  switch (method.toUpperCase()) {
    case "GET":
    case "DELETE":
      return request.status === 200;
  }
}

export const ajax = (options) => {
  if (!isValidOptions(options)) {
    console.log('Invalid AJAX options\n' + JSON.stringify(options));
  }
  let request = new XMLHttpRequest();
  request.onerror = () => {
    console.log('Request Error!');
  };
  request.open(options.method.toUpperCase(), options.url);
  request.onload = function () {
    if (isSuccess(request, options.method)) {
      options.onSuccess(options.onSuccessParam || JSON.parse(request.responseText));
    } else {
      options.onFail(request.responseText);
    }
  };
  request.send();
};