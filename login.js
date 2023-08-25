const loginPanel = document.getElementById('loginPanel');      
const sidebar = document.getElementById('sidebar');
const mainSectionTable = document.getElementById('mainSectionTable');
const fullName = document.getElementById('fullName');
const userType = document.getElementById('userType');


const headerElement = document.getElementById('header');
headerElement.classList.add('connected');
sidebar.classList.add('hidden');
mainSectionTable.classList.add('hidden');

document.getElementById('popupContainer').style.display = 'none';
document.getElementById('loadingOverlay').style.display = 'none';


async function loginUser() {
  showLoader();
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
  
        // Add the 'hidden' class to the elements
        sidebar.classList.remove('hidden');
        mainSectionTable.classList.remove('hidden');
        loginPanel.classList.add('hidden');
        mainSectionTable.classList.add('table');
        document.getElementById('fullName').textContent = fullName;
        // document.getElementById('userType').textContent = userType;

        showAdminPanel();
      // }, 30000); // 30 seconds
    } else {
        createToast('error', 'fa-solid fa-circle-exclamation', 'error', 'Username or Password is invalid. error: '+error);
        hideLoader();
    }
  } else {
    createToast('error', 'fa-solid fa-circle-exclamation', 'error', 'There is a network error:'+error);
    hideLoader();
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
            mainSectionTable.classList.remove('table');
            document.getElementById('fullName').textContent = '';
            // document.getElementById('userType').textContent = '';
    
  }