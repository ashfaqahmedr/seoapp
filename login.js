let LoggedUsername;

const loginPanel = document.getElementById('loginPanel');   

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const submitButton = document.getElementById('submit-button');

const spanfullName = document.getElementById('fullName');
const spanuserName = document.getElementById('userName');
const spanuserType = document.getElementById('UserType');

const userIconElement = document.getElementById('userIcon');


const DataHeaders = document.getElementById('currentshownData');


 // Get the userIcon span

const userHeaderprofile  = document.getElementById('userHeader');

const btngetUsers = document.getElementById('getUsers');
const btnAddNewUser = document.getElementById('AddNewUser');
const container = document.getElementById('container');

const txttopTitle = document.getElementById('topTitle');

const dialogpopupContainer = document.getElementById('popupContainer');
const dialogloadingOverlay = document.getElementById('loadingOverlay');

const dialogconfrimDialog = document.getElementById('confrimDialog');

const dialoguserDialog = document.getElementById('userDialog');
const dialogfileDialog = document.getElementById('fileDialog');
const dialogProjectsDialog = document.getElementById('myDialog');

const customMenu = document.getElementById('wrapper');



dialogpopupContainer.style.display = 'none'
dialogloadingOverlay.style.display = 'none'
dialogconfrimDialog.style.display = 'none'
dialoguserDialog.style.display = 'none'
dialogfileDialog.style.display = 'none'
dialogProjectsDialog.style.display = 'none'

userHeaderprofile.style.display = 'none';
btngetUsers.style.display = 'none';
btnAddNewUser.style.display = 'none';
container.style.display = 'none';

submitButton.style.display = 'none';

customMenu.style.display = 'none';

window.addEventListener('load', function () {
 

  // Function to check if both fields are filled
  function checkInputs() {
      if (usernameInput.value.trim() !== '' && passwordInput.value.trim() !== '') {
          submitButton.style.display = 'block';


      } else {
          submitButton.style.display = 'none';
      }
  }

// Add event listeners to both input fields to check on input changes
  // Initially, check the inputs when the page loads
checkInputs();
  usernameInput.addEventListener('input', checkInputs);
  passwordInput.addEventListener('input', checkInputs);

});
window.addEventListener('load', function () {

document.getElementById('username').focus();

});


function formatName(name) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before uppercase letters preceded by lowercase letters
    .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
    .trim();
}

async function loginUser() {
  showLoader();
  
    const username = usernameInput.value;
    const password = passwordInput.value;
  
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
   
      txttopTitle.textContent="SEO Content Machine Web App (Connected to Google Sheet)"

        spanfullName.innerHTML = fullName;
        spanuserType.innerHTML  = formatName(userType);
        spanuserName.innerHTML = formatName(username);
        
       // Update icon based on user type in the sidebar
       userIconElement.classList.remove('fas', 'fa-crown', 'fa-briefcase', 'fa-users', 'fa-user');

       switch (userType) {
         case 'SuperAdmin':
           userIconElement.classList.add('fas', 'fa-crown');
           btngetUsers.style.display = 'flex';
           btnAddNewUser.style.display = 'flex';

           break;
         case 'Admin':
           userIconElement.classList.add('fas', 'fa-briefcase');
           btngetUsers.style.display = 'flex';
           btnAddNewUser.style.display = 'flex';
           break;
          case 'User':
           userIconElement.classList.add('fas', 'fa-users');
           break;
         // Add more cases for other user types
         default:
           userIconElement.classList.add('fas', 'fa-user');
       }      

       userHeaderprofile.style.display = 'flex';
        container.style.display = 'flex';
        loginPanel.style.display = 'none';

        
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
            // // Add the 'hidden' class to the elements
            // sidebar.style.display = 'none';
            // profile.style.display = 'none';
            // mainSectionTable.style.display = 'none';
            // loginPanel.style.display = 'flex';
            // // mainSectionTable.classList.remove('table');
            // spanfullName.innerHTML = '';
            // spanuserType.innerHTML = '';
            // spanuserName.innerHTML = '';
            // headerElement.classList.remove('connected');
            // headerElement.classList.add('disconected');
            // txttopTitle.innerHTML="SEO Content Machine Web App"

            location.reload()


    
  }