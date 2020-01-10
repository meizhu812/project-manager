function isValidOptions(options) {  // GET & DELETE only!!!
  let hasValidUrl = (options) => !options.url.includes("?");
  let hasValidMethod = (options) => ['get', 'delete'].includes(options.method);
  let hasValidCallbacks = (options) => typeof options.success === "function" && typeof options.fail === "function";
  return hasValidUrl(options) && hasValidMethod(options) && hasValidCallbacks(options);
}

export const ajax = (options) => {
  if (!isValidOptions(options)) {
    console.log('Invalid AJAX options\n' + JSON.stringify(options));
  }
  let request = new XMLHttpRequest();
  request.open(options.method.toUpperCase(), options.url);
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
  request.onerror = () => {
    console.log('Request Error!');
  };
  request.send();
};