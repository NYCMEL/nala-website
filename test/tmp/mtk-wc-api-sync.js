/**
 * MTK API Call Function - Synchronous (blocking) style
 * Make API calls and return JSON response directly (NO callbacks, NO await)
 * WARNING: This uses synchronous XMLHttpRequest which blocks the browser
 * NOTE: Timeouts are not supported in synchronous mode
 */

const wc = window.wc || {};

/////////////////////////////////////////////////////////////////////////////////
//// Make synchronous API call and return JSON response directly
/////////////////////////////////////////////////////////////////////////////////
wc.apiCall = function(config) {
  const {
    method = 'GET',
    url,
    body = null,
    headers = {}
  } = config;

  const xhr = new XMLHttpRequest();
  
  // Open connection as SYNCHRONOUS (false = sync)
  xhr.open(method, url, false);
  
  // Set default headers
  xhr.setRequestHeader('Content-Type', 'application/json');
  
  // Set custom headers
  for (let key in headers) {
    xhr.setRequestHeader(key, headers[key]);
  }
  
  try {
    // Send request (this blocks until response comes back)
    if (body) {
      xhr.send(JSON.stringify(body));
    } else {
      xhr.send();
    }
    
    // Check if successful
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        return JSON.parse(xhr.responseText);
      } catch (error) {
        return {
          error: 'JSON Parse Error',
          message: error.message,
          response: xhr.responseText
        };
      }
    } else {
      return {
        error: 'HTTP Error',
        status: xhr.status,
        statusText: xhr.statusText,
        response: xhr.responseText
      };
    }
  } catch (error) {
    return {
      error: 'Request Failed',
      message: error.message
    };
  }
}

/////////////////////////////////////////////////////////////////////////////////
//// Make synchronous GET request
/////////////////////////////////////////////////////////////////////////////////
wc.get = function(url) {
  return wc.apiCall({
    method: 'GET',
    url: url
  });
}

/////////////////////////////////////////////////////////////////////////////////
//// Make synchronous POST request
/////////////////////////////////////////////////////////////////////////////////
wc.post = function(url, body) {
  return wc.apiCall({
    method: 'POST',
    url: url,
    body: body
  });
}

/////////////////////////////////////////////////////////////////////////////////
//// Make synchronous PUT request
/////////////////////////////////////////////////////////////////////////////////
wc.put = function(url, body) {
  return wc.apiCall({
    method: 'PUT',
    url: url,
    body: body
  });
}

/////////////////////////////////////////////////////////////////////////////////
//// Make synchronous DELETE request
/////////////////////////////////////////////////////////////////////////////////
wc.delete = function(url) {
  return wc.apiCall({
    method: 'DELETE',
    url: url
  });
}

/////////////////////////////////////////////////////////////////////////////////
//// Make synchronous PATCH request
/////////////////////////////////////////////////////////////////////////////////
wc.patch = function(url, body) {
  return wc.apiCall({
    method: 'PATCH',
    url: url,
    body: body
  });
}

// Make wc globally available
window.wc = wc;

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = wc;
}
