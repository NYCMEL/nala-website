/**
 * MTK Cookie Functions - Namespaced with wc
 * Individual functions with wc namespace
 */

const wc = window.wc || {};

/////////////////////////////////////////////////////////////////////////////////
//// Set a cookie
/////////////////////////////////////////////////////////////////////////////////
wc.setCookie = function(name, value, days = null, path = '/', domain = null, secure = false, sameSite = 'Lax') {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    cookie += `; expires=${date.toUTCString()}`;
  }
  
  cookie += `; path=${path}`;
  
  if (domain) {
    cookie += `; domain=${domain}`;
  }
  
  if (secure) {
    cookie += '; secure';
  }
  
  if (sameSite) {
    cookie += `; SameSite=${sameSite}`;
  }
  
  document.cookie = cookie;
}

/////////////////////////////////////////////////////////////////////////////////
//// Get a cookie value by name
/////////////////////////////////////////////////////////////////////////////////
wc.getCookie = function(name) {
  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  
  return null;
}

/////////////////////////////////////////////////////////////////////////////////
//// Delete a cookie
/////////////////////////////////////////////////////////////////////////////////
wc.deleteCookie = function(name, path = '/', domain = null) {
  wc.setCookie(name, '', -1, path, domain);
}

/////////////////////////////////////////////////////////////////////////////////
//// Check if a cookie exists
/////////////////////////////////////////////////////////////////////////////////
wc.cookieExists = function(name) {
  return wc.getCookie(name) !== null;
}

/////////////////////////////////////////////////////////////////////////////////
//// Get all cookies as an object
/////////////////////////////////////////////////////////////////////////////////
wc.getAllCookies = function() {
  const cookies = {};
  const cookieArray = document.cookie.split(';');
  
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim();
    const [name, value] = cookie.split('=');
    if (name) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value || '');
    }
  }
  
  return cookies;
}

/////////////////////////////////////////////////////////////////////////////////
//// Delete all cookies
/////////////////////////////////////////////////////////////////////////////////
wc.deleteAllCookies = function(path = '/', domain = null) {
  const cookies = wc.getAllCookies();
  for (let name in cookies) {
    wc.deleteCookie(name, path, domain);
  }
}

/////////////////////////////////////////////////////////////////////////////////
//// Set a cookie with JSON value
/////////////////////////////////////////////////////////////////////////////////
wc.setCookieJSON = function(name, value, days = null, path = '/') {
  try {
    const jsonValue = JSON.stringify(value);
    wc.setCookie(name, jsonValue, days, path);
  } catch (error) {
    console.error('Error stringifying JSON for cookie:', error);
  }
}

/////////////////////////////////////////////////////////////////////////////////
//// Get a cookie and parse it as JSON
/////////////////////////////////////////////////////////////////////////////////
wc.getCookieJSON = function(name) {
  const value = wc.getCookie(name);
  if (!value) return null;
  
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('Error parsing JSON from cookie:', error);
    return null;
  }
}

/////////////////////////////////////////////////////////////////////////////////
//// Update a cookie value (merge with existing if JSON)
/////////////////////////////////////////////////////////////////////////////////
wc.updateCookie = function(name, updates, days = null, isJSON = null) {
  const existing = wc.getCookie(name);
  
  if (existing && (isJSON === true || (isJSON === null && existing.startsWith('{')))) {
    const current = wc.getCookieJSON(name) || {};
    const merged = { ...current, ...updates };
    wc.setCookieJSON(name, merged, days);
  } else {
    wc.setCookie(name, updates, days);
  }
}

/////////////////////////////////////////////////////////////////////////////////
//// Set a session cookie (expires when browser closes)
/////////////////////////////////////////////////////////////////////////////////
wc.setSessionCookie = function(name, value, path = '/') {
  wc.setCookie(name, value, null, path);
}

/////////////////////////////////////////////////////////////////////////////////
//// Set a secure cookie (HTTPS only)
/////////////////////////////////////////////////////////////////////////////////
wc.setSecureCookie = function(name, value, days = 7, sameSite = 'Strict') {
  wc.setCookie(name, value, days, '/', null, true, sameSite);
}

/////////////////////////////////////////////////////////////////////////////////
//// Check if cookies are enabled in the browser
/////////////////////////////////////////////////////////////////////////////////
wc.areCookiesEnabled = function() {
  const testCookie = '__test_cookie__';
  wc.setCookie(testCookie, 'test', 1);
  const enabled = wc.cookieExists(testCookie);
  if (enabled) {
    wc.deleteCookie(testCookie);
  }
  return enabled;
}

/////////////////////////////////////////////////////////////////////////////////
//// Count total number of cookies
/////////////////////////////////////////////////////////////////////////////////
wc.countCookies = function() {
  if (!document.cookie) return 0;
  return document.cookie.split(';').filter(c => c.trim()).length;
}

/////////////////////////////////////////////////////////////////////////////////
//// Get cookie size in bytes
/////////////////////////////////////////////////////////////////////////////////
wc.getCookieSize = function(name) {
  const value = wc.getCookie(name);
  if (!value) return 0;
  return new Blob([`${name}=${value}`]).size;
}

/////////////////////////////////////////////////////////////////////////////////
//// Get total size of all cookies in bytes
/////////////////////////////////////////////////////////////////////////////////
wc.getTotalCookieSize = function() {
  return new Blob([document.cookie]).size;
}

/////////////////////////////////////////////////////////////////////////////////
//// List all cookie names
/////////////////////////////////////////////////////////////////////////////////
wc.listCookieNames = function() {
  const cookies = wc.getAllCookies();
  return Object.keys(cookies);
}

/////////////////////////////////////////////////////////////////////////////////
//// Check if a cookie value matches
/////////////////////////////////////////////////////////////////////////////////
wc.cookieValueMatches = function(name, value) {
  return wc.getCookie(name) === value;
}

/////////////////////////////////////////////////////////////////////////////////
//// Rename a cookie (copy to new name and delete old)
/////////////////////////////////////////////////////////////////////////////////
wc.renameCookie = function(oldName, newName, days = null) {
  const value = wc.getCookie(oldName);
  if (value !== null) {
    wc.setCookie(newName, value, days);
    wc.deleteCookie(oldName);
    return true;
  }
  return false;
}

/////////////////////////////////////////////////////////////////////////////////
//// Copy a cookie to a new name
/////////////////////////////////////////////////////////////////////////////////
wc.copyCookie = function(sourceName, targetName, days = null) {
  const value = wc.getCookie(sourceName);
  if (value !== null) {
    wc.setCookie(targetName, value, days);
    return true;
  }
  return false;
}

/////////////////////////////////////////////////////////////////////////////////
//// Set multiple cookies at once
/////////////////////////////////////////////////////////////////////////////////
wc.setMultipleCookies = function(cookiesObj, days = null) {
  for (let name in cookiesObj) {
    const config = cookiesObj[name];
    if (typeof config === 'object' && config.value !== undefined) {
      wc.setCookie(name, config.value, config.days || days, config.path, config.domain, config.secure, config.sameSite);
    } else {
      wc.setCookie(name, config, days);
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////
//// Get multiple cookies at once
/////////////////////////////////////////////////////////////////////////////////
wc.getMultipleCookies = function(names) {
  const result = {};
  names.forEach(name => {
    result[name] = wc.getCookie(name);
  });
  return result;
}

/////////////////////////////////////////////////////////////////////////////////
//// Delete multiple cookies at once
/////////////////////////////////////////////////////////////////////////////////
wc.deleteMultipleCookies = function(names, path = '/') {
  names.forEach(name => {
    wc.deleteCookie(name, path);
  });
}

/////////////////////////////////////////////////////////////////////////////////
//// Search for cookies by name pattern
/////////////////////////////////////////////////////////////////////////////////
wc.findCookies = function(pattern) {
  const allCookies = wc.getAllCookies();
  const matches = {};
  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);
  
  for (let name in allCookies) {
    if (regex.test(name)) {
      matches[name] = allCookies[name];
    }
  }
  
  return matches;
}

/////////////////////////////////////////////////////////////////////////////////
//// Delete cookies matching a pattern
/////////////////////////////////////////////////////////////////////////////////
wc.deleteCookiesByPattern = function(pattern, path = '/') {
  const matches = wc.findCookies(pattern);
  for (let name in matches) {
    wc.deleteCookie(name, path);
  }
}

/////////////////////////////////////////////////////////////////////////////////
//// Check if cookie storage is available and under limit
/////////////////////////////////////////////////////////////////////////////////
wc.isCookieStorageAvailable = function() {
  const maxSize = 4096; // Typical cookie limit per domain
  return wc.getTotalCookieSize() < maxSize;
}

/////////////////////////////////////////////////////////////////////////////////
//// Console log utility
/////////////////////////////////////////////////////////////////////////////////
wc.log = function(...data) {
  return console.log(...data);
}

// Make wc globally available
window.wc = wc;

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = wc;
}
