/**
 * MTK API Call Function - Synchronous style with callback
 * Make API calls and handle JSON response without await
 */

const wc = window.wc || {};

/////////////////////////////////////////////////////////////////////////////////
//// Make API call and return JSON response via callback
/////////////////////////////////////////////////////////////////////////////////
wc.apiCall = function(config, onSuccess, onError) {
  const {
    method = 'GET',
    url,
    body = null,
    headers = {},
    timeout = 30000
  } = config;

  const xhr = new XMLHttpRequest();
  
  // Set timeout
  xhr.timeout = timeout;
  
  // Open connection
  xhr.open(method, url, true);
  
  // Set default headers
  xhr.setRequestHeader('Content-Type', 'application/json');
  
  // Set custom headers
  for (let key in headers) {
    xhr.setRequestHeader(key, headers[key]);
  }
  
  // Handle successful response
  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const json = JSON.parse(xhr.responseText);
        if (onSuccess) {
          onSuccess(json, xhr);
        }
      } catch (error) {
        if (onError) {
          onError({
            error: 'JSON Parse Error',
            message: error.message,
            response: xhr.responseText
          }, xhr);
        }
      }
    } else {
      if (onError) {
        onError({
          error: 'HTTP Error',
          status: xhr.status,
          statusText: xhr.statusText,
          response: xhr.responseText
        }, xhr);
      }
    }
  };
  
  // Handle network errors
  xhr.onerror = function() {
    if (onError) {
      onError({
        error: 'Network Error',
        message: 'Failed to connect to server'
      }, xhr);
    }
  };
  
  // Handle timeout
  xhr.ontimeout = function() {
    if (onError) {
      onError({
        error: 'Timeout Error',
        message: 'Request timed out'
      }, xhr);
    }
  };
  
  // Send request
  if (body) {
    xhr.send(JSON.stringify(body));
  } else {
    xhr.send();
  }
  
  return xhr;
}

/////////////////////////////////////////////////////////////////////////////////
//// Make GET request
/////////////////////////////////////////////////////////////////////////////////
wc.get = function(url, onSuccess, onError) {
  return wc.apiCall({
    method: 'GET',
    url: url
  }, onSuccess, onError);
}

/////////////////////////////////////////////////////////////////////////////////
//// Make POST request
/////////////////////////////////////////////////////////////////////////////////
wc.post = function(url, body, onSuccess, onError) {
  return wc.apiCall({
    method: 'POST',
    url: url,
    body: body
  }, onSuccess, onError);
}

/////////////////////////////////////////////////////////////////////////////////
//// Make PUT request
/////////////////////////////////////////////////////////////////////////////////
wc.put = function(url, body, onSuccess, onError) {
  return wc.apiCall({
    method: 'PUT',
    url: url,
    body: body
  }, onSuccess, onError);
}

/////////////////////////////////////////////////////////////////////////////////
//// Make DELETE request
/////////////////////////////////////////////////////////////////////////////////
wc.delete = function(url, onSuccess, onError) {
  return wc.apiCall({
    method: 'DELETE',
    url: url
  }, onSuccess, onError);
}

/////////////////////////////////////////////////////////////////////////////////
//// Make PATCH request
/////////////////////////////////////////////////////////////////////////////////
wc.patch = function(url, body, onSuccess, onError) {
  return wc.apiCall({
    method: 'PATCH',
    url: url,
    body: body
  }, onSuccess, onError);
}

// Make wc globally available
window.wc = wc;

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = wc;
}
