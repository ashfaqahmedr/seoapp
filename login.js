let LoggedUsername;

const loginPanel = document.getElementById('loginPanel');     

const headerElement = document.getElementById('header');

const spanfullName = document.getElementById('fullName');
const spanuserName = document.getElementById('userName');
const spanuserType = document.getElementById('UserType');
const userIconElement = document.getElementById('userIcon'); // Get the userIcon span

const profile = document.getElementById('profile');

profile.style.display = 'none';

const container = document.getElementById('container');
const sidebar = document.getElementById('sidebar');
const mainSectionTable = document.getElementById('mainSectionTable');

headerElement.classList.add('connected');
container.classList.add('hidden');

document.getElementById('popupContainer').style.display = 'none';
document.getElementById('loadingOverlay').style.display = 'none';

function formatName(name) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before uppercase letters preceded by lowercase letters
    .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
    .trim();
}

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
  
      // Update full name in the header with spaces between uppercase letters
        spanfullName.innerHTML = fullName;
        spanuserType.innerHTML  = formatName(userType);
        spanuserName.innerHTML = formatName(username);

       // Update icon based on user type in the sidebar
       userIconElement.classList.remove('fas', 'fa-crown', 'fa-briefcase', 'fa-users', 'fa-user');

       switch (userType) {
         case 'SuperAdmin':
           userIconElement.classList.add('fas', 'fa-crown');
           break;
         case 'Admin':
           userIconElement.classList.add('fas', 'fa-briefcase');
           break;
         case 'User':
           userIconElement.classList.add('fas', 'fa-users');
           break;
         // Add more cases for other user types
         default:
           userIconElement.classList.add('fas', 'fa-user');
       }
 
        // profile.classList.remove('hidden');
        
        profile.style.display = 'flex';

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
            profile.style.display = 'none';
            mainSectionTable.classList.add('hidden');
            loginPanel.classList.remove('hidden');
            // mainSectionTable.classList.remove('table');
            document.getElementById('fullName').innerHTML = '';
            document.getElementById('userType').innerHTML = '';

    
  }