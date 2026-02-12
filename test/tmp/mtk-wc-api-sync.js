/**
 * MTK API Call Function - Synchronous (blocking) style
 * Make API calls and return JSON response directly (NO callbacks, NO await)
 * WARNING: This uses synchronous XMLHttpRequest which blocks the browser
 * NOTE: Timeouts are not supported in synchronous mode
 **/

// EXAMPLE
//////////////////////
// var response = wc.apiCall({
//     method: "POST",
//     url: wc.apiURL + "/api/login_api.php",
//     body: {
//         email: "mel@google.com",
// 	password: "test"
//     }
// });
// 
// wc.user = wc.user || response.user;

wc.log("user:", wc.user);

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
