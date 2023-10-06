const cronjob = require('node-cron');


// Variable for Update Info if Shown
let isUpdateDomainInfo=true;

let isLoggedIn=false;

// SyncCalled from Auto AddData
// convert Web app to Local App =false
let isWebApp=true;
// Allow GOOGLE SERVER API CALL WHEN ADDING UPDATING /DELETING DATA

let GAPIRequired;
// Use BlogData not SEO Data

let UseLocalDataForTable;
  // To show Local Data and dont load Tables

  let testing;
  // For Showing Test Buttons

  let showtestButtons;
// Write Logges in console or in Log File

  let iswriteLogs;
  
let valprojectStatusInMilliseconds;

//count Total Records
let totalRecords = 0
// Store the selected row ID

let GAPISheetID = null;

// Store Ids
let selectedRowIndex =null;
let selectedRowId = null;
let jobid =null;
let blogsetID=null;


let folderpath=null;

let apiCalltoMake = 'ProjectsData';

let defaultLoaderId = 'loadingOverlay';

let titleID = null;
let confirmDialogUse = false;

let LoggedUsername ;
let LoggedFullName;

const seourl ='http://localhost:8008'
const seoProjectsUrl = `${seourl}/project`

const appurl ='http://localhost:3000'

// Google App Script URL for Web App and Make Local Request.
// const googleurl ='https://script.google.com/macros/s/AKfycbxgyT3rHw0zc7xeF_HWP3fxiy9VjaBcwzE18b6eA7HzFejEvCQEJewrJSzDFkeaUa4m/exec'
// New App script for Code Only
const googleurl ='https://script.google.com/macros/s/AKfycbzVVl1wZsaOLNg69TIMqbS3AShrs-jBWs9BzgiFj4oK4C_lRNS4wGGwY__fjQLlT3QQ/exec'


// Login Panel Headers -loginPanel
const loginPanel = document.getElementById('loginPanel');   
const loginHeader = document.getElementById('loginHeader');

loginPanel.style.display = 'none';

// User Input Fields for -loginPanel
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const submitButton = document.getElementById('submit-button');

// Hider Submit Buttom
submitButton.style.display = 'none';

// User Information  -loginPanel
const spanfullName = document.getElementById('fullName');
const spanuserName = document.getElementById('userName');
const spanuserType = document.getElementById('UserType');
const userIconElement = document.getElementById('userIcon');

const userIcon_Name  = document.getElementById('userIcon_Name');

    // User Header 
userIcon_Name.style.display = 'none';


// Main Dashboard Container 
const siderbar_Table = document.getElementById('container');
const txttopTitle = document.getElementById('topTitle');

const DataHeaders = document.getElementById('currentshownData');
// const recordCountElement = document.getElementById('recordCount');

  // SiderBar elements 

  const sidebar = document.getElementById ("sidebar");
  const closeBtn = document.querySelector("#btn");

  let dashboardLink = document.getElementById('dashboard-link');

  //function and variables to show filter by status on main table.
  // const searchInput = document.getElementById('searchinput');

  const customSelect = document.getElementById('table-filter');
  const selectedOption = customSelect.querySelector('.selected-option');
  const optionsContainer = customSelect.querySelector('.options');
  const options = customSelect.querySelectorAll('.option');



// Dashboard Link button to Get All Users
const btngetUsers = document.getElementById('getUsers');

// Add Users button on Dashoard
const btnAddNewUser = document.getElementById('AddNewUser');

const btnuploadedImages = document.getElementById('uploadedImages');

const btChecktest = document.getElementById('Checktest');

  // Hide Side Dashboard and Elements

  btngetUsers.style.display = 'none';
  btnAddNewUser.style.display = 'none';
  siderbar_Table.style.display = 'none';


// Application and Project Settings 

const AppSettingDialog = document.getElementById('AppSettingDialog');

const btnShowAppSetting = document.getElementById('projectSettings');

btnShowAppSetting.style.display = 'none';

AppSettingDialog.style.display = 'none';

const checkWebApp = document.getElementById('checkWebApp');
const checkTesting = document.getElementById('checkTesting');
const checkUseGAPI = document.getElementById('checkUseGAPI');
const checkSyncGoogle = document.getElementById('checkSyncGoogle');
const checkUseLocalData = document.getElementById('checkUseLocalData');
const checkShowTestButtons = document.getElementById('checkShowTestButtons');
const checkWriteLogs = document.getElementById('checkWriteLogs');

const GAPISyncTime = document.getElementById('GAPISyncTime');
const montiroingInterval = document.getElementById('montiroingInterval');
const projectStatusInterval = document.getElementById('projectStatusInterval');


const logClearTimer = document.getElementById('logClearTimer');


  const btntoggleNotificationbtn = document.getElementById('btntoggleNotification');
  const btnTogglenotiTexttext = document.getElementById('btnTogglenotiText');


  // // Main Table of Dashboard
  // const table = document.getElementById('main');
  // const rows = table.getElementsByTagName('tr');



// User Dialog Elememts
const dialoguserDialog = document.getElementById('userDialog');

// Hide Elements
dialoguserDialog.style.display = 'none'

const userDialogTitle = document.getElementById('userDialogTitle');
const userDialogSubTitle = document.getElementById('userDialogSubTitle');
const UserDialogsheetID = document.getElementById('userDialogsheetIDTitle');
const UserDialogSeoStatus = document.getElementById('userDialogSeoStatus');


  //Variables for User Dialog Input elements
  const usersheetIDInput = document.getElementById('usersheetID');
  const userFullInputInput = document.getElementById('userFullInput');
  const usernameInputInput = document.getElementById('usernameInput');
  const userpasswordInput = document.getElementById('passwordInput');
  const usertimeCountInput = document.getElementById('timeCount');
  const userTypeInput = document.getElementById('userType');
  const userseoStatusinput = document.getElementById('seoStatusinput');


  //Variables for User Dialog button elements
  const btnudateUserInfo = document.getElementById('udateUserInfo');
  const btnaddUserInfo = document.getElementById('addUserInfo');
  const btnUsercloseDialog = document.getElementById('UsercloseDialog');

  

// Loader Elements
const dialogpopupContainer = document.getElementById('popupContainer');
const dialogloadingOverlay = document.getElementById('loadingOverlay');


    // Hide Loader initally
    dialogpopupContainer.style.display = 'none'
    dialogloadingOverlay.style.display = 'none'


// Confrim Dialog 
const dialogconfrimDialog = document.getElementById('confrimDialog');

  // Hide confirm Dialog   Initially
dialogconfrimDialog.style.display = 'none'

// Confirm Dialog Elements
const dialogTitleelement = document.getElementById('dialogHeader');
const confirmMessageelement = document.getElementById('confirmMessage'); 

const btnConfirmConfirmDialog = document.getElementById('confirmButton')
const btncancelConfirmDialog =document.getElementById('cancelButton')

// Project Dialog Elementes 
const dialogProjectsDialog = document.getElementById('ProjectsDialog');

  // Hide Project Dialog  Initially
  dialogProjectsDialog.style.display = 'none'

    //  Project Sections and Elements
    const DialogTitle =  document.getElementById('dialogTitle')

    const cnsarticleCreatorTitle = document.getElementById("articlecreator");

    const cnsarticleCreatorSection = document.getElementById("articleCreatorSection")
  
    const DivProjectCreatoID =  document.getElementById('DivProjectCreatoID')
      const ProjectIDInput = document.getElementById('ProjectID');

      const articleProjectNameInput = document.getElementById('articleProjectName');

      const projectNamesDatalist = document.getElementById('projectNames');

      const articleKeywordsFileInput = document.getElementById('articleKeywordsFile');
      const articleCategoriesInput = document.getElementById('articleCategories');

      const projectCronString  = document.getElementById('projectCronString')

      const projectImageTypeSelect  = document.getElementById('projectImageType')

      const DivImageStatus  = document.getElementById('DivImageStatus')

      const ImageStatusInput  = document.getElementById('ImageStatus')

      const DivProjectCreatorStatus  = document.getElementById('DivProjectCreatorStatus')

      const ProjectStatusinput = document.getElementById('ProjectStatus');

      const DivcreatedOn  = document.getElementById('DivcreatedOn')

      const createdOn = document.getElementById('createdOn');

      const cnspostUploaderTitle = document.getElementById("postuploader");


      const showeditPostName = document.getElementById("showeditPostName");

         // Hide Project Show edit Post Name
         showeditPostName.style.display = 'none'

      const toggleditPostNameCheckbox = document.getElementById('toggleditPostName');

      const cnspostUploaderSection = document.getElementById("postUploaderSection");

    
      const addNewPosterID = document.getElementById("addNewPosterID");


      const DivProjectPosterrID = document.getElementById('DivProjectPosterrID')
      const PostUploaderIdInput = document.getElementById('PostUploaderId');
      const postJobNameInput = document.getElementById('postJobName');

      const postJobNameDataList = document.getElementById('postJobNameDataList');

      const postDateInput = document.getElementById('postDate');

      const DivProjectPosterStatus = document.getElementById('DivProjectPosterStatus')
      const PostUploaderStatusInput = document.getElementById('PostUploaderStatus');

  
      const cnsblogSettingSection = document.getElementById("blogSettingSection");

      
      const showcheckshowBlogInfo = document.getElementById('checkshowBlogInfo');
      const toggleBlogInfoCheckbox = document.getElementById('toggleBlogInfo');

          // Hide Project Show Blog Toggle
          showcheckshowBlogInfo.style.display = 'none'
        

      const showcheckAddBlogInfo = document.getElementById('checkAddBlogInfo');
      const addNewBlogInfoCheckbox = document.getElementById('addNewBlogInfo');

           // Hide Project Add Blog Toggle
           showcheckAddBlogInfo.style.display = 'none'

      const cnsblogSettingTitle = document.getElementById('blogIdNo');

      const DivProjectBlogID = document.getElementById('DivProjectBlogID')
      
      const BlogIdInput = document.getElementById('BlogId');

    
      const secBlogUsername = document.getElementById('secBlogUsername');
      const blogUserNameInput = document.getElementById('blogUserName');


      const secBlogPassword = document.getElementById('secBlogPassword');
      const blogPasswordInput = document.getElementById('blogPassword');
      
      const blogUrlInput = document.getElementById('blogUrl');

      const BlogurlDataList = document.getElementById('BlogurlDataList');


      const secBloggroup = document.getElementById('secBloggroup');

      const blogGroupInput = document.getElementById('blogGroup');

      
      const btnAddNewdomainInfo = document.getElementById('AddNewdomainInfo');
      
      const DivProjectSEOStatus = document.getElementById('DivProjectSEOStatus')

    const SEOStatusInput = document.getElementById('SEOStatus');


    const DialogdomainInfoAdd = document.getElementById('DialogdomainInfo');


       // Hide Project Add Blog Toggle
       DialogdomainInfoAdd.style.display = 'none'

       // Get the current date
const currentDate = new Date();

        // Date format for Date Unputs 
  const formatedDateMMDDYY = currentDate.toISOString().split('T')[0]; // Get the current date in "yyyy-mm-dd" format
  
  console.log(formatedDateMMDDYY)

  const formatedDateMMDDYY2 = currentDate.toISOString().split('T')[0]; // Get the current date in "yyyy-mm-dd" format
console.log(formatedDateMMDDYY2)


    // Project Dialog buttons
    // Create Button & Text 
    const addButton = document.getElementById("createProjectData");
    const addButtonText = document.getElementById('createProjectText');

    // Update Button & Text 
    const updateButton = document.getElementById('updateProjectData');
    const updateButtonText = document.getElementById('updateProjectText');

   // Run Button &  Text
    const runButton = document.getElementById('runActiveProject');
    
    const runButtonText = document.getElementById('RunProjectText');

     // Duplicate Button &  Text
    const duplicateButton = document.getElementById('DuplcateActiveProject');
    const duplicateButtonText = document.getElementById('DuplcateProjectText');

      //Close Button
    const closeButton = document.getElementById('closeDialogButton');

//Custom Project Settings Dailog  
const customSettingDialog = document.getElementById('customSettingDialog');

  // Hide Dialog Initially
  customSettingDialog.style.display = 'none'


  const btnsettingCancleButton = document.getElementById('settingCancleButton');
  
      //custom settings 
  const sheetIDInput = document.getElementById('CustomDialogsheetID');
  const listofContentFilterInput = document.getElementById('listofContentFilter');
  const urlsDownloadResultLimitsInput = document.getElementById('urlsDownloadResultLimits');
  const articleCountInput = document.getElementById('articleCount');
  const insertNoofImagesFROMInput = document.getElementById('insertNoofImagesFROM');
  const insertNoofImagesTOInput = document.getElementById('insertNoofImagesTO');
  const jobcronStringinput = document.getElementById('jobcronString');
  const articleUseCategoryInsertInput = document.getElementById('articleUseCategoryInsert');
  const useImagesInput = document.getElementById('useImages');
  const imageInserTypeInput = document.getElementById('imageInserType');
  const InsertAtStartOfBodyInput = document.getElementById('InsertAtStartOfBody');
  const useBingImagesInput = document.getElementById('useBingImages');
  const useYoutubeThumbnailsInput = document.getElementById('useYoutubeThumbnails');
  const useCreativeCommonsImagesInput = document.getElementById('useCreativeCommonsImages');
  const useBingCCImagesInput = document.getElementById('useBingCCImages');

  const posttodayDateInput = document.getElementById('todayDateInput');
  const postUseTodayInput = document.getElementById('postUseToday');
  const postsperDayInput = document.getElementById('postsperDay');
  const postIntervaldaysFROMInput = document.getElementById('postIntervaldaysFROM');
  const postIntervaldaysTOInput = document.getElementById('postIntervaldaysTO');
  const postarticleTitleInput = document.getElementById('postarticleTitle');
  const seoStatusInput = document.getElementById('seoStatus');

  const btnupdateSettingbtn = document.getElementById('btnupdateSetting');
  
  const btnsettingdialogClosebtn = document.getElementById('btnsettingdialogClose');

// Custom Menu Items 
const customContextMenu = document.getElementById('wrapper');

  // Hide Custom Menu Items
  customContextMenu.style.display = 'none';


// Common Dialog to Show Data /Actions.
const dialogPopupCommonDialog = document.getElementById('popupCommonDialog');
const popupCommonDialogHeader = document.getElementById('popupCommonDialogHeader');

const selectPopupActions = document.getElementById('popupActions');

const  selectActionToPerform  =document.getElementById('selectedActionToPerform');

const btngetPopData = document.getElementById('getPopData');
const getDataText = document.getElementById('getDataText');

const btnSEOOperations = document.getElementById('btnSEOOperations');
const btnActionText = document.getElementById('btnActionText');

const sectionDomainInfo = document.getElementById('sectionDomainInfo');

sectionDomainInfo.style.display = 'none';

const domainurl = document.getElementById('domainurl');
const urlDataList = document.getElementById('urlDataList');
const domaiusername = document.getElementById('domaiusername');
const domaipassword = document.getElementById('domaipassword');
const domaiBlogId = document.getElementById('domaiBlogId');

const DivApplicationtoWebAppCheck = document.getElementById('toggleApplicationtoWebApp');

DivApplicationtoWebAppCheck.style.display = 'none';

const togglewebAppCheckBox = document.getElementById('webAppCheckBox');
const lablecheckLableWeb = document.getElementById('checkLableWeb');




// const tablepopupCommonData = document.getElementById('popupCommonTable');

dialogPopupCommonDialog.style.display = 'none';

// async function getAppSettings() {
// let success =false;
//   try {
//     // Retrieve the file content from the API
//   const response = await fetch(`${appurl}/AppSettings`, {
//    method: 'GET',
//    headers: {
//      'Content-Type': 'application/json'
//    }
//   });
  
//   if (response.ok) {
  
//    const data = await response.json();
  
//   console.log("Application Data")
//   console.table(data)
  
//   // Populate the input elements with the retrieved values
//   // convert Web app to Local App =false
//  isWebApp = data.checkWebApp;

//  // To show Local Data and dont load Tables
//   testing = data.checkTesting;
 
//   // Allow GOOGLE SERVER API CALL WHEN ADDING UPDATING /DELETING DATA
//  GAPIRequired = data.checkUseGAPI;
 
//  SyncGoogle = data.checkSyncGoogle;
 
//  // Use Temp BlogData not SEO Data
//  UseLocalDataForTable = data.checkUseLocalData;
 
//    // For Showing Test Buttons
//  showtestButtons = data.checkShowTestButtons;
 
//  // Write Logges in console or in Log File
//  iswriteLogs = data.checkWriteLogs;


//   valprojectStatusInMilliseconds = parseInt(data.projectStatusInterval) * 60000;
  

//   console.log("valprojectStatusInterval:", valprojectStatusInMilliseconds, "milliseconds");

  
//   return success=true;
  
//   }
  
//    } catch (error) {
//      console.error('Error retrieving Application settings:', error);
//     //  createToast('SettingsToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Error retrieving App settings from Local Server: ' + error);
//      hideLoader();
//      return success=false;
//    }
  
//   }


  let checkAppSetting;

  let RunningLocalServer =false
//Load things on Page Loads when Showing Login Panel
  window.onload = async () => {

   // checkAppSetting = getAppSettings()
  hideLoader();
    // try {

      // Call the LocalServerSEO function
      // RunningLocalServer = await LocalServerSEO();

    // } catch (error) {

    //   console.error('Error calling LocalServerSEO:', error);
    // }

  // Auto Web App 


   // if (RunningLocalServer) {

//     txttopTitle.textContent="SEO Content Machine Desktop App"

//    if (checkAppSetting) {

//     DivApplicationtoWebAppCheck.style.display = 'flex';

//     togglewebAppCheckBox.removeEventListener('change', LoadAsWebApp);

//     togglewebAppCheckBox.addEventListener('change', LoadAsWebApp);

//     btnShowAppSetting.style.display = 'flex';

//   }

// // Load Local App
//     if (!isWebApp) {
//       togglewebAppCheckBox.checked = false
//       lablecheckLableWeb.textContent="Destkop App"
//       userIcon_Name.style.display = 'none';
//       siderbar_Table.style.display = 'flex';
//       loginPanel.style.display = 'none';
//       showAdminPanel();
//       isLoggedIn=true

//       callCronJob(isLoggedIn, RunningLocalServer)

//     } else {
      togglewebAppCheckBox.checked = true
      lablecheckLableWeb.textContent="Web App"
      txttopTitle.textContent="SEO Content Machine Web App"
      loginPanel.style.display = 'flex';
      siderbar_Table.style.display = 'none';
      isLoggedIn=false
     
    // }

     // Show Panel without use of SEO
     if (testing || UseLocalDataForTable) {

      LoggedUsername = "ASHFAQ" ;
      LoggedFullName ="ASHFAQ AHMED";
      userIcon_Name.style.display = 'none';
      siderbar_Table.style.display = 'flex';
      loginPanel.style.display = 'none';
      isLoggedIn=true
      showAdminPanel();
     } 
    
    } else {
      btnShowAppSetting.style.display = 'none';
      DivApplicationtoWebAppCheck.style.display = 'none';
    }  
  }



//   //Check the Server
// async function LocalServerSEO() {
 
//    // Show Login     
// let success=false;

//   showLoader();

//   try {
//     const response = await fetch(`${seourl}/test`, {
//       method: 'GET'
//     });

//     const data = await response.json();

//     console.log(data)

//     if (data.success)  {


//   hideLoader();
  
//   createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', 'SEO Server is Running.');
//   txttopTitle.textContent="SEO Content Machine Desktop App (Connected)"
     
//   return success=true;
//   }

//   } catch (error) {
//     loginPanel.style.display = 'none';
//       console.error(error)
//       createToast('bodyToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'error', 'SEO Content Machine is not Running on this Machine. '+error);
//       txttopTitle.textContent="SEO Content Machine Desktop App (Disconnected)"
//       hideLoader();
   
//   }

//   return 
// }

// Event Listeners for Input Fields and Submit Buttons 

// will be reinforced

window.addEventListener('load', function () {
 
//Set Focus on the username
  document.getElementById('username').focus();

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

  usernameInput.addEventListener('input', checkInputs);
  passwordInput.addEventListener('input', checkInputs);
  checkInputs();


});


// Function to Handle API Calls for Local and WebApp
// async function handleApiCall(url, requestData, timeoutMilliseconds, successMessage, errorMessage, showSuccessMessage = true, showDataUpdateRepsonse = false) {
//   showLoader(); // Show loader before making the API call

//   try {
//     const response = await Promise.race([
//       fetch(url, {
//         method: 'POST',
//         body: JSON.stringify(requestData),
//       }),
//       new Promise((resolve) => setTimeout(resolve, timeoutMilliseconds)),
//     ]);

//     if (response.status === 200) {
//       const data = await response.json();

//       console.log("API Response from Handle APi Call ");
//       console.table(data);
//       hideLoader(); // Hide loader after the API call, whether it succeeds or fails
//       if (showDataUpdateRepsonse && Array.isArray(data) && data.length > 0) {
//         const firstItem = data[0];
//         const success = firstItem.success;
//         GAPISheetID = firstItem.SheetID || '';
//         const message = firstItem.message || '';

//         if (success) {
//           createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', `Success: ${success}<br>ID: ${ GAPISheetID}<br>Message: ${message}`);
//           return success;
//         } else {
//           createToast('bodyToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', message);
//         }
//       } else if (!showDataUpdateRepsonse) {
//         if (data.success) {
//           if (showSuccessMessage) {
//             createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', successMessage);
//           }
//           return data;
//         } else {
//           const errorText = data.message || errorMessage;
//           throw new Error(errorText);
//         }
//       }
//     } else {
//       throw new Error('API call failed with status: ' + response.status);
//     }
//   } catch (error) {
//     hideLoader(); // Hide loader in case of an error
//     createToast('bodyToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', errorMessage + ' ' + error.message);
//     throw new Error(error.message);
//   }
// }

// // Refactored handleApiCall function
async function handleApiCall(url, requestData, timeoutMilliseconds, successMessage, errorMessage, showSuccessMessage = true, showDataUpdateResponse = false) {
  showLoader(); // Show loader before making the API call

  try {
    const response = await Promise.race([
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(requestData),
      }),
      new Promise((resolve) => setTimeout(resolve, timeoutMilliseconds)),
    ]);

    hideLoader(); // Hide loader after the API call, whether it succeeds or fails

    if (response.status === 200) {
      const data = await response.json();

      console.log("API Response from Handle APi Call ");
      console.table(data);

      if (showDataUpdateResponse && Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        const success = firstItem.success;
       GAPISheetID = firstItem.SheetID || '';
        const message = firstItem.message || '';

        if (success) {
          if (showSuccessMessage) {
            createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', `Success: ${success}<br>ID: ${GAPISheetID}<br>Message: ${message}`);
          }
          return data; // Return the entire data object
        } else {
          createToast('bodyToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', message);
          throw new Error(message); // Throw an error with the message
        }
      } else if (!showDataUpdateResponse) {
        if (data.success) {
          if (showSuccessMessage) {
            createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', successMessage);
          }
          return data; // Return the entire data object
        } else if (!data.success && data.status ==="info") {

          createToast('UserToastDiv',  'info', 'fa-solid fa-info-circle', 'Info', message);
        }
      
        else {
          const errorText = data.message || errorMessage;

          createToast('bodyToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', errorText);
          // throw new Error(errorText); // Throw an error with the errorText
        }
      }
    } else {
      throw new Error('API call failed with status: ' + response.status);
    }
  } catch (error) {
    createToast('bodyToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', errorMessage + ' ' + error.message);
    throw error; // Rethrow the error
  }
}


// Function to Login User
async function loginUser() {

  const username = usernameInput.value;
  const password = passwordInput.value;

  const { success, username: loggedUsername, userType, fullName, token } = await handleApiCall(
    googleurl,
    { action: 'login', username, password },
    30000,
    'Logged In successfully.',
    'Username or Password is invalid.',
     false, false
  );

  if (success) {
    // Set the cookie with a 30-second expiration
   
    LoggedUsername = loggedUsername;
    LoggedFullName = fullName;
    // var cookieName = 'userToken';
    // var maxAge = 60;
    // console.log('Original Token: ' + token);
    // console.log('Original Time: ' + maxAge);

    // Set the cookie
    // document.cookie = `${cookieName}=${encodeURIComponent(token)}; Max-Age=${maxAge}; Secure;  SameSite=Lax`;

    // Get the value of the cookie and display it
    // var cookieValue = getCookie('userToken');
    // console.log("userToken: , Cookie Value:" + cookieValue);

    txttopTitle.textContent = "SEO Content Machine Web App (Connected to Google Sheet)";

    spanfullName.innerHTML = fullName;
    spanuserType.innerHTML = formatName(userType);
    spanuserName.innerHTML = formatName(username);

    // Update icon based on user type in the sidebar
    userIconElement.classList.remove('fas', 'fa-crown', 'fa-briefcase', 'fa-users', 'fa-user');

    switch (userType) {
      case 'SuperAdmin':
        userIconElement.classList.add('fas', 'fa-crown');
        btngetUsers.style.display = 'flex';
        btnAddNewUser.style.display = 'flex';
        btnShowAppSetting.style.display = 'flex';

        break;
      case 'Admin':
        userIconElement.classList.add('fas', 'fa-briefcase');
        btngetUsers.style.display = 'flex';
        btnAddNewUser.style.display = 'flex';
        btnShowAppSetting.style.display = 'none';
        break;
      case 'User':
        userIconElement.classList.add('fas', 'fa-users');
        btnShowAppSetting.style.display = 'none';
        break;
      // Add more cases for other user types
      default:
        userIconElement.classList.add('fas', 'fa-user');
        btnShowAppSetting.style.display = 'none';
    }

    userIcon_Name.style.display = 'flex';
    siderbar_Table.style.display = 'flex';
    loginPanel.style.display = 'none';
    isLoggedIn=true
    showAdminPanel();
    callCronJob(isLoggedIn, RunningLocalServer)

  }

  
}

// // Function to get the value of a cookie
// function getCookie(name) {
//   var nameEQ = name + "=";
//   var ca = document.cookie.split(';');
//   for (var i = 0; i < ca.length; i++) {
//     var c = ca[i];
//     while (c.charAt(0) == ' ') c = c.substring(1, c.length);
//     if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
//   }
//   return null;
// }


// Format Name In Upper and Lower cases // Capitalize the first letter // Add space before uppercase letters // Add space before uppercase letters preceded by lowercase letters
function formatName(name) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2') 
    .replace(/([A-Z])/g, ' $1') 
    .replace(/^./, (str) => str.toUpperCase()) 
    .trim();
}


// Function to Logout Means Reload the App
  function logout() {
   location.reload()
  }

// Loggs

async function callCronJob(isLoggedIn, RunningLocalServer) {

 let appSettingData; 
  try {
if (isLoggedIn &&  RunningLocalServer) {
console.log("Called from Cron Job  is Logged: " + isLoggedIn)
  // Retrieve the file content from the API
const response = await fetch(`${appurl}/AppSettings`, {
 method: 'GET',
 headers: {
   'Content-Type': 'application/json'
 }
});

if (response.ok) {

  appSettingData = await response.json();

console.log("Application Data")
console.table(appSettingData)
}
// Populate the input elements with the retrieved values
   
function myScheduledTask() {
  console.log(`This Test is Running every ${appSettingData.montiroingInterval} using Schedular`);
}


// Ensure valmontiroingIntervalMinutes is defined and a valid number
if (!appSettingData.checkWebApp) {
  // Schedule a task to run every valmontiroingIntervalMinutes minutes
  
  cronjob.schedule(`*/${appSettingData.montiroingInterval} * * * *`, () => {

    try {
    myScheduledTask();

    if (!appSettingData.checkWebApp) {

      console.log(`This Monitoring of  Running and Waiting Projects check after every ${appSettingData.montiroingInterval} using Schedular`);
      startMonitoringProjects();
  
    }

  } catch (error) {
    console.error('An Error occured in sechuling the cron:', error);
  }

  });
} 

if (appSettingData.checkSyncGoogle) {
// Make Google Syn Call Every Set Timer
cronjob.schedule(`*/${appSettingData.GAPISyncTime} * * * *`, () => {
  try {
      console.log(`This Google Sync API Call run after every ${appSettingData.GAPISyncTime} using Schedular`);
   
      getProjectsfromGAPI();

  } catch (error) {
    console.error('An Error occured in sechuling the cron:', error);
  }
});
}

if (appSettingData.checkWriteLogs) {
// Clear Logs
cronjob.schedule(`*/${appSettingData.logClearTimer} * * * *`, () => {
  try {

       //  Write Logs in the File.
    //  Call the function to clear the log file when the application starts
    console.log(`This Clear old Loggs  after every ${appSettingData.logClearTimer} using Schedular`);
   
    clearLogFile();


  } catch (error) {
    console.error('An Error occured in sechuling the cron for Clear Log:', error);
  }
});
}
}
  } catch(error) {
    
    console.error('An Error occured in sechuling the cron Jobs:', error);
  }
}

function ensureLogDirectoryExists(logDirectory) {
  const fs = require('fs');
    const path = require('path');
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating log directory:', err);
      }
    });
  }
}


  // Clear the log file when the application starts
function clearLogFile() {
  const fs = require('fs');
    const path = require('path');

  const logDirectory = 'logs';
  const logPath = path.join(logDirectory, 'app.log');

  ensureLogDirectoryExists(logDirectory);

  fs.writeFileSync(logPath, ''); // This will clear the log file
}


  function getCurrentTimestamp() {
    return new Date().toLocaleString(); // Use locale-specific date and time format
  }
  
  function writeToLog(message) {
     const fs = require('fs');
    const path = require('path');
    const { app } = require('electron'); // Import the app object from Electron
       const logDirectory = 'logs';
       const maxLogEntries = 10000; // Set the maximum number of log entries

    const logPath = path.join(logDirectory, 'app.log');
  
    ensureLogDirectoryExists(logDirectory);

    const timestamp = getCurrentTimestamp();
    const formattedMessage = `[${timestamp}] ${message}\n`;
  
    fs.appendFile(logPath, formattedMessage, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });
  
    // Check if the log file exists and its size
    fs.stat(logPath, (err, stats) => {
      if (!err && stats.size > maxLogEntries * 1024) {
        // If the log file exceeds the maximum size (in kilobytes), truncate it
        fs.truncate(logPath, 0, (err) => {
          if (err) {
            console.error('Error truncating log file:', err);
          }
        });
      }
    });


  }
  

    
  function customLogger(...args) {
    args.forEach((logArg) => {
      writeToLog(JSON.stringify(logArg, null, 2).replace(/\n/g, '\n\t'));
    });
  }



  if (showtestButtons) {
    btChecktest.style.display = 'flex';
    btnuploadedImages.style.display = 'flex';
   
  } else {
    btChecktest.style.display = 'none';
    btnuploadedImages.style.display = 'none';
  
  }

  if (iswriteLogs) {
    console.log = customLogger;
    console.table = customLogger; 
 
  }
