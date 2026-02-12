/**
 * MTK API Call Functions - Usage Examples
 */

// ============================================
// EXAMPLE 1: Basic POST Request (Your Example)
// ============================================

wc.apiCall({
  method: "POST",
  url: "/login_api.php",
  body: {
    email: "mel@google.com"
  }
}, 
function(response) {
  // Success callback - handle JSON response
  wc.log('Login successful:', response);
  
  if (response.token) {
    wc.setCookie('authToken', response.token, 7);
  }
  
  if (response.user) {
    wc.setCookieJSON('user', response.user, 7);
  }
}, 
function(error) {
  // Error callback
  wc.log('Login failed:', error);
  alert('Login failed: ' + error.message);
});


// ============================================
// EXAMPLE 2: Using Shorthand POST Method
// ============================================

wc.post('/login_api.php', 
  {
    email: "mel@google.com"
  },
  function(response) {
    wc.log('Success:', response);
  },
  function(error) {
    wc.log('Error:', error);
  }
);


// ============================================
// EXAMPLE 3: GET Request
// ============================================

wc.get('/api/users/123',
  function(response) {
    wc.log('User data:', response);
    document.getElementById('userName').textContent = response.name;
  },
  function(error) {
    wc.log('Failed to load user:', error);
  }
);


// ============================================
// EXAMPLE 4: POST with More Options
// ============================================

wc.apiCall({
  method: "POST",
  url: "/api/register",
  body: {
    username: "john_doe",
    email: "john@example.com",
    password: "secret123"
  },
  headers: {
    'X-API-Key': 'your-api-key-here',
    'X-Client-Version': '1.0.0'
  },
  timeout: 10000
},
function(response) {
  wc.log('Registration successful:', response);
  
  // Save user data to cookies
  wc.setCookieJSON('user', response.user, 30);
  
  // Redirect to dashboard
  window.location.href = '/dashboard';
},
function(error) {
  wc.log('Registration failed:', error);
  
  // Show error message
  document.getElementById('errorMsg').textContent = error.message;
});


// ============================================
// EXAMPLE 5: PUT Request
// ============================================

wc.put('/api/users/123',
  {
    name: "John Updated",
    email: "new@email.com"
  },
  function(response) {
    wc.log('User updated:', response);
    alert('Profile updated successfully!');
  },
  function(error) {
    wc.log('Update failed:', error);
  }
);


// ============================================
// EXAMPLE 6: DELETE Request
// ============================================

wc.delete('/api/users/123',
  function(response) {
    wc.log('User deleted:', response);
    alert('Account deleted successfully!');
  },
  function(error) {
    wc.log('Delete failed:', error);
  }
);


// ============================================
// EXAMPLE 7: PATCH Request
// ============================================

wc.patch('/api/users/123',
  {
    status: "active"
  },
  function(response) {
    wc.log('User status updated:', response);
  },
  function(error) {
    wc.log('Patch failed:', error);
  }
);


// ============================================
// EXAMPLE 8: Login Form Handler
// ============================================

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  wc.post('/login_api.php',
    {
      email: email,
      password: password
    },
    function(response) {
      // Login successful
      wc.log('Login response:', response);
      
      // Save auth token
      if (response.token) {
        wc.setSecureCookie('authToken', response.token, 7);
      }
      
      // Save user data
      if (response.user) {
        wc.setCookieJSON('currentUser', response.user, 7);
      }
      
      // Redirect
      window.location.href = response.redirectUrl || '/dashboard';
    },
    function(error) {
      // Login failed
      wc.log('Login error:', error);
      
      const errorDiv = document.getElementById('loginError');
      errorDiv.textContent = error.message || 'Login failed. Please try again.';
      errorDiv.style.display = 'block';
    }
  );
});


// ============================================
// EXAMPLE 9: Load User Profile
// ============================================

function loadUserProfile(userId) {
  // Show loading state
  document.getElementById('profileLoader').style.display = 'block';
  
  wc.get('/api/users/' + userId,
    function(response) {
      // Hide loader
      document.getElementById('profileLoader').style.display = 'none';
      
      // Populate profile
      document.getElementById('userName').textContent = response.name;
      document.getElementById('userEmail').textContent = response.email;
      document.getElementById('userBio').textContent = response.bio;
      
      // Cache profile data
      wc.setCookieJSON('profile_' + userId, response, 1);
    },
    function(error) {
      // Hide loader
      document.getElementById('profileLoader').style.display = 'none';
      
      // Show error
      alert('Failed to load profile: ' + error.message);
    }
  );
}

// Usage
loadUserProfile('123');


// ============================================
// EXAMPLE 10: Search with Query Parameters
// ============================================

function searchUsers(query) {
  const url = '/api/search?q=' + encodeURIComponent(query) + '&type=users';
  
  wc.get(url,
    function(response) {
      wc.log('Search results:', response);
      
      // Display results
      const resultsContainer = document.getElementById('searchResults');
      resultsContainer.innerHTML = '';
      
      response.results.forEach(function(user) {
        const div = document.createElement('div');
        div.textContent = user.name;
        resultsContainer.appendChild(div);
      });
    },
    function(error) {
      wc.log('Search failed:', error);
    }
  );
}


// ============================================
// EXAMPLE 11: File Upload (JSON data)
// ============================================

function submitContactForm() {
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value
  };
  
  wc.post('/api/contact',
    formData,
    function(response) {
      wc.log('Form submitted:', response);
      
      // Show success message
      document.getElementById('successMsg').textContent = 'Message sent successfully!';
      document.getElementById('successMsg').style.display = 'block';
      
      // Clear form
      document.getElementById('contactForm').reset();
    },
    function(error) {
      wc.log('Form submission failed:', error);
      
      // Show error message
      document.getElementById('errorMsg').textContent = 'Failed to send message. Please try again.';
      document.getElementById('errorMsg').style.display = 'block';
    }
  );
}


// ============================================
// EXAMPLE 12: Shopping Cart API
// ============================================

function addItemToCart(productId, quantity) {
  wc.post('/api/cart/add',
    {
      product_id: productId,
      quantity: quantity
    },
    function(response) {
      wc.log('Item added to cart:', response);
      
      // Update cart count in UI
      document.getElementById('cartCount').textContent = response.totalItems;
      
      // Update local cart cookie
      wc.setCookieJSON('cart', response.cart, 7);
      
      // Show success notification
      showNotification('Item added to cart!');
    },
    function(error) {
      wc.log('Failed to add item:', error);
      alert('Failed to add item to cart');
    }
  );
}


// ============================================
// EXAMPLE 13: Chaining Multiple Requests
// ============================================

function loginAndLoadProfile(email, password) {
  // First, login
  wc.post('/login_api.php',
    {
      email: email,
      password: password
    },
    function(loginResponse) {
      wc.log('Login successful:', loginResponse);
      
      // Save token
      wc.setCookie('authToken', loginResponse.token, 7);
      
      // Then, load user profile
      wc.get('/api/users/' + loginResponse.userId,
        function(profileResponse) {
          wc.log('Profile loaded:', profileResponse);
          
          // Save profile
          wc.setCookieJSON('userProfile', profileResponse, 7);
          
          // Redirect to dashboard
          window.location.href = '/dashboard';
        },
        function(profileError) {
          wc.log('Failed to load profile:', profileError);
        }
      );
    },
    function(loginError) {
      wc.log('Login failed:', loginError);
      alert('Login failed: ' + loginError.message);
    }
  );
}


// ============================================
// EXAMPLE 14: Request with Auth Token
// ============================================

function getProtectedData() {
  const token = wc.getCookie('authToken');
  
  wc.apiCall({
    method: 'GET',
    url: '/api/protected/data',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  },
  function(response) {
    wc.log('Protected data:', response);
  },
  function(error) {
    wc.log('Access denied:', error);
    
    if (error.status === 401) {
      // Token expired, redirect to login
      window.location.href = '/login';
    }
  });
}


// ============================================
// EXAMPLE 15: Abort Request
// ============================================

let currentRequest = null;

function searchWithCancel(query) {
  // Cancel previous request if exists
  if (currentRequest) {
    currentRequest.abort();
  }
  
  // Make new request
  currentRequest = wc.get('/api/search?q=' + encodeURIComponent(query),
    function(response) {
      wc.log('Search results:', response);
      displaySearchResults(response.results);
      currentRequest = null;
    },
    function(error) {
      if (error.error !== 'Network Error') {
        wc.log('Search error:', error);
      }
      currentRequest = null;
    }
  );
}


// ============================================
// EXAMPLE 16: Retry Logic
// ============================================

function apiCallWithRetry(config, maxRetries, onSuccess, onError) {
  let attempts = 0;
  
  function attempt() {
    attempts++;
    
    wc.apiCall(config,
      function(response) {
        // Success
        onSuccess(response);
      },
      function(error) {
        // Error - retry if possible
        if (attempts < maxRetries) {
          wc.log('Retry attempt', attempts + 1, 'of', maxRetries);
          setTimeout(attempt, 1000 * attempts); // Exponential backoff
        } else {
          onError(error);
        }
      }
    );
  }
  
  attempt();
}

// Usage
apiCallWithRetry({
  method: 'POST',
  url: '/api/important',
  body: { data: 'important' }
}, 3,
function(response) {
  wc.log('Success after retries:', response);
},
function(error) {
  wc.log('Failed after all retries:', error);
});
