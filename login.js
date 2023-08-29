let LoggedUsername;

const loginPanel = document.getElementById('loginPanel');     

const headerElement = document.getElementById('header');

const spanfullName = document.getElementById('fullName');
const spanuserName = document.getElementById('userName');
const spanuserType = document.getElementById('UserType');

const profile = document.getElementById('profile');
profile.classList.add('hidden');

const container = document.getElementById('container');
const sidebar = document.getElementById('sidebar');
const mainSectionTable = document.getElementById('mainSectionTable');

headerElement.classList.add('connected');
container.classList.add('hidden');



document.getElementById('popupContainer').style.display = 'none';
document.getElementById('loadingOverlay').style.display = 'none';

async function loginUser() {
  showLoader();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch(seourl, {
      method: 'POST',
      body: JSON.stringify({ action: 'login', username, password }), // Include the action
    });
  
    if (response.ok) {
    const { success, username, userType, fullName, token, error } = await response.json();
  
    if (success) {
  
      // Set the cookie with a 30-second expiration // expires=${now.toUTCString()}; path=/
    
    LoggedUsername=username
    var cookieName = 'userToken';
    var maxAge = 60;
    console.log('Original Token: ' + token);
    console.log('Original Time: ' + maxAge);
  
    // Set the cookie
    document.cookie = `${cookieName}=${encodeURIComponent(token)}; Max-Age=${maxAge}; Secure;  SameSite=Lax`;
  
    // Get the value of the cookie and display it
    var cookieValue = getCookie('userToken');
    console.log("userToken: , Cookie Value:"+ cookieValue);
  
        spanfullName.innerHTML = fullName;
        spanuserType.innerHTML  = userType;
        spanuserName.innerHTML = username;

        profile.classList.remove('hidden');

        // Add the 'hidden' class to the elements
        sidebar.classList.remove('hidden');
        mainSectionTable.classList.remove('hidden');
        loginPanel.classList.add('hidden');
        mainSectionTable.classList.add('table');
        
        createToast('success', 'fa-solid fa-circle-check', 'Success', 'Logged In successfully.');
        hideLoader();
        showAdminPanel();
      // }, 30000); // 30 seconds
    } else {
        createToast('error', 'fa-solid fa-circle-exclamation', 'error', 'Username or Password is invalid. error: '+error);
        hideLoader();
    }
  } else {
    createToast('error', 'fa-solid fa-circle-exclamation', 'error', 'There is a network error.');
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
            profile.classList.add('hidden');
            mainSectionTable.classList.add('hidden');
            loginPanel.classList.remove('hidden');
            // mainSectionTable.classList.remove('table');
            document.getElementById('fullName').innerHTML = '';
            document.getElementById('userType').innerHTML = '';

    
  }