const loginPanel = document.getElementById('loginPanel');      
const sidebar = document.getElementById('sidebar');
const mainSectionTable = document.getElementById('mainSectionTable');

sidebar.classList.add('hidden');
mainSectionTable.classList.add('hidden');



async function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('https://script.google.com/macros/s/AKfycbxgyT3rHw0zc7xeF_HWP3fxiy9VjaBcwzE18b6eA7HzFejEvCQEJewrJSzDFkeaUa4m/exec?sheetName=Users', {
      method: 'POST',
      body: JSON.stringify({ action: 'login', username, password }), // Include the action
    });
  
    if (response.ok) {
    const { success, fullName, userType, token, error } = await response.json();
  
    if (success) {
  
      // Set the cookie with a 30-second expiration // expires=${now.toUTCString()}; path=/
  
    var cookieName = 'userToken';
    var maxAge = 60;
    console.log('Original Token: ' + token);
    console.log('Original Time: ' + maxAge);
  
    // Set the cookie
    document.cookie = `${cookieName}=${encodeURIComponent(token)}; Max-Age=${maxAge}; Secure;  SameSite=Lax`;
  
    // Get the value of the cookie and display it
    var cookieValue = getCookie('userToken');
    console.log("userToken: , Cookie Value:"+ cookieValue);
  
      // // Redirect after 30 seconds
      // setTimeout(() => {


        // Add the 'hidden' class to the elements
        sidebar.classList.remove('hidden');
        mainSectionTable.classList.remove('hidden');
        loginPanel.classList.add('hidden');

        showAdminPanel();

      // }, 30000); // 30 seconds
    } else {
        createToast('error', 'fa-solid fa-circle-exclamation', 'error', 'Username or Password is invalid: ');
    }
  } else {
    createToast('error', 'fa-solid fa-circle-exclamation', 'error', 'There is a network error ');
  }
  
  // Function to get the value of a cookie
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  }
}
  function logout() {
            // Add the 'hidden' class to the elements
            sidebar.classList.add('hidden');
            mainSectionTable.classList.add('hidden');
            loginPanel.classList.remove('hidden');
  }