/**
 * MTK Synchronous API Call Functions - Usage Examples
 * Direct return, NO callbacks, NO await needed
 */

// ============================================
// EXAMPLE 1: Your Original Example - Direct Return
// ============================================

const response = wc.apiCall({
  method: "POST",
  url: wc.apiURL + "/api/login_api.php",
  body: {
      email: "mel@google.com",
      password: "test"
  }
});

wc.log(response);
// response is the parsed JSON object

if (response.token) {
  wc.setCookie('authToken', response.token, 7);
}


// ============================================
// EXAMPLE 2: Using POST Shorthand
// ============================================

const loginResult = wc.post('/login_api.php', {
  email: "mel@google.com",
  password: "secret123"
});

wc.log('Login result:', loginResult);

if (loginResult.success) {
  wc.log('Login successful!');
  wc.setCookieJSON('user', loginResult.user, 7);
} else {
  wc.log('Login failed:', loginResult.error);
}


// ============================================
// EXAMPLE 3: GET Request
// ============================================

const user = wc.get('/api/users/123');

wc.log('User name:', user.name);
wc.log('User email:', user.email);

document.getElementById('userName').textContent = user.name;


// ============================================
// EXAMPLE 4: Check Response Status
// ============================================

const result = wc.post('/api/register', {
  username: "john_doe",
  email: "john@example.com"
});

// Check for errors
if (result.error) {
  wc.log('Error:', result.error);
  alert('Registration failed: ' + result.message);
} else {
  wc.log('Registration successful:', result);
  window.location.href = '/dashboard';
}


// ============================================
// EXAMPLE 5: Sequential Requests (No nesting needed!)
// ============================================

// Login
const login = wc.post('/login_api.php', {
  email: "mel@google.com",
  password: "pass123"
});

if (login.token) {
  // Save token
  wc.setCookie('authToken', login.token, 7);
  
  // Get user profile (using the token)
  const profile = wc.apiCall({
    method: 'GET',
    url: '/api/profile',
    headers: {
      'Authorization': 'Bearer ' + login.token
    }
  });
  
  wc.log('Profile loaded:', profile);
  wc.setCookieJSON('userProfile', profile, 7);
  
  // Get user preferences
  const prefs = wc.get('/api/preferences');
  wc.log('Preferences:', prefs);
  
  // All done - redirect
  window.location.href = '/dashboard';
}


// ============================================
// EXAMPLE 6: Form Submit Handler
// ============================================

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  const result = wc.post('/login_api.php', {
    email: email,
    password: password
  });
  
  if (result.error) {
    document.getElementById('errorMsg').textContent = result.message;
    document.getElementById('errorMsg').style.display = 'block';
  } else {
    wc.setCookie('authToken', result.token, 7);
    window.location.href = '/dashboard';
  }
});


// ============================================
// EXAMPLE 7: Load and Display Data
// ============================================

function loadUserProfile(userId) {
  const user = wc.get('/api/users/' + userId);
  
  if (!user.error) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userBio').textContent = user.bio;
  } else {
    alert('Failed to load user profile');
  }
}

loadUserProfile('123');


// ============================================
// EXAMPLE 8: Shopping Cart
// ============================================

function addToCart(productId, quantity) {
  const result = wc.post('/api/cart/add', {
    product_id: productId,
    quantity: quantity
  });
  
  if (result.success) {
    // Update cart count
    document.getElementById('cartCount').textContent = result.totalItems;
    
    // Update local cart
    wc.setCookieJSON('cart', result.cart, 7);
    
    // Show notification
    alert('Item added to cart!');
  } else {
    alert('Failed to add item: ' + result.message);
  }
}


// ============================================
// EXAMPLE 9: Search Function
// ============================================

function search(query) {
  const results = wc.get('/api/search?q=' + encodeURIComponent(query));
  
  if (!results.error) {
    const container = document.getElementById('searchResults');
    container.innerHTML = '';
    
    results.forEach(function(item) {
      const div = document.createElement('div');
      div.textContent = item.name;
      container.appendChild(div);
    });
  }
}


// ============================================
// EXAMPLE 10: Update User Profile
// ============================================

function updateProfile() {
  const result = wc.put('/api/users/123', {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    bio: document.getElementById('bio').value
  });
  
  if (result.success) {
    alert('Profile updated successfully!');
    wc.setCookieJSON('userProfile', result.user, 7);
  } else {
    alert('Update failed: ' + result.message);
  }
}


// ============================================
// EXAMPLE 11: Delete Account
// ============================================

function deleteAccount(userId) {
  if (confirm('Are you sure you want to delete your account?')) {
    const result = wc.delete('/api/users/' + userId);
    
    if (result.success) {
      wc.deleteAllCookies();
      window.location.href = '/goodbye';
    } else {
      alert('Failed to delete account: ' + result.message);
    }
  }
}


// ============================================
// EXAMPLE 12: Load Multiple Resources
// ============================================

function loadDashboard() {
  // Load user data
  const user = wc.get('/api/user');
  wc.log('User:', user);
  
  // Load notifications
  const notifications = wc.get('/api/notifications');
  wc.log('Notifications:', notifications);
  
  // Load recent activity
  const activity = wc.get('/api/activity');
  wc.log('Activity:', activity);
  
  // Update UI with all data
  document.getElementById('userName').textContent = user.name;
  document.getElementById('notificationCount').textContent = notifications.length;
  displayActivity(activity);
}


// ============================================
// EXAMPLE 13: Conditional Requests
// ============================================

function getOrCreateUser(email) {
  // Try to get existing user
  const user = wc.get('/api/users?email=' + encodeURIComponent(email));
  
  if (user.error || !user.id) {
    // User doesn't exist, create new one
    const newUser = wc.post('/api/users', {
      email: email,
      name: 'New User'
    });
    
    wc.log('Created new user:', newUser);
    return newUser;
  } else {
    wc.log('Found existing user:', user);
    return user;
  }
}


// ============================================
// EXAMPLE 14: With Custom Headers
// ============================================

function getProtectedData() {
  const token = wc.getCookie('authToken');
  
  const data = wc.apiCall({
    method: 'GET',
    url: '/api/protected',
    headers: {
      'Authorization': 'Bearer ' + token,
      'X-API-Version': '2.0'
    }
  });
  
  if (data.error && data.status === 401) {
    // Token expired
    wc.deleteCookie('authToken');
    window.location.href = '/login';
  } else {
    return data;
  }
}


// ============================================
// EXAMPLE 15: Inline Usage
// ============================================

// Use directly in expressions
const userName = wc.get('/api/user').name;
const cartTotal = wc.get('/api/cart').total;
const isAdmin = wc.get('/api/user').role === 'admin';

wc.log('User:', userName);
wc.log('Cart total:', cartTotal);
wc.log('Is admin:', isAdmin);

// Use in conditions
if (wc.get('/api/user').isPremium) {
  showPremiumFeatures();
}

// Use in loops
const products = wc.get('/api/products');
products.forEach(function(product) {
  wc.log('Product:', product.name);
});


// ============================================
// EXAMPLE 16: Error Handling Pattern
// ============================================

function safeApiCall(config, defaultValue = null) {
  const result = wc.apiCall(config);
  
  if (result.error) {
    wc.log('API Error:', result.error, result.message);
    return defaultValue;
  }
  
  return result;
}

// Usage
const user = safeApiCall({
  method: 'GET',
  url: '/api/user'
}, { name: 'Guest' });

wc.log('User name:', user.name); // Will be 'Guest' if API fails


// ============================================
// EXAMPLE 17: Retry Pattern
// ============================================

function apiCallWithRetry(config, maxRetries = 3) {
  let lastError = null;
  
  for (let i = 0; i < maxRetries; i++) {
    const result = wc.apiCall(config);
    
    if (!result.error) {
      return result;
    }
    
    lastError = result;
    wc.log('Attempt', i + 1, 'failed:', result.error);
  }
  
  return lastError;
}

// Usage
const data = apiCallWithRetry({
  method: 'GET',
  url: '/api/important-data'
}, 5);


// ============================================
// EXAMPLE 18: Complete Login Flow
// ============================================

function handleLogin(email, password) {
  // Attempt login
  const loginResponse = wc.post('/login_api.php', {
    email: email,
    password: password
  });
  
  // Check for errors
  if (loginResponse.error) {
    wc.log('Login failed:', loginResponse);
    return {
      success: false,
      message: loginResponse.message || 'Login failed'
    };
  }
  
  // Save auth token
  wc.setSecureCookie('authToken', loginResponse.token, 7);
  
  // Get user profile
  const profile = wc.apiCall({
    method: 'GET',
    url: '/api/profile',
    headers: {
      'Authorization': 'Bearer ' + loginResponse.token
    }
  });
  
  // Save profile
  wc.setCookieJSON('userProfile', profile, 7);
  
  // Get user preferences
  const prefs = wc.get('/api/preferences');
  wc.setCookieJSON('userPrefs', prefs, 365);
  
  return {
    success: true,
    user: profile,
    preferences: prefs
  };
}

// Usage
const result = handleLogin('mel@google.com', 'pass123');

if (result.success) {
  wc.log('Login successful! User:', result.user.name);
  window.location.href = '/dashboard';
} else {
  alert('Login failed: ' + result.message);
}


// ============================================
// NOTE: Browser Warnings
// ============================================

// Modern browsers will show deprecation warnings for synchronous XHR
// This approach is NOT recommended for production use
// It will block the browser UI while waiting for responses
// Use callback version (mtk-wc-api.js) for better user experience
