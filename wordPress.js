let cellValuesArray = []; // Array to store cell values

let blogData;

const tableID ='popupCommonTable'

// // Call the function initially to set the initial button text
// updateButtonText();

function TestingFunctions () {
// Call createToast to show a toast
createToast('WordpressToastDiv', 'success', 'fa-solid fa-check', 'Success', 'This is a success message.');
createToast('WordpressToastDiv', 'info', 'fa-solid fa-info-circle', 'Info', 'Local API for Users currently not Available.');   

}

// Update Get Button and Delete Button Text
// Update Get Button and Delete Button Text
function updateWordButtonText() {

  //  Fecth Action Values
  let fetchSelectedActionData = selectPopupActions.value
  
    console.log("Selected Actions:" + fetchSelectedActionData)
    
// Get the selected option element
const selectedOption = selectPopupActions.selectedOptions[0];

// Get the text content of the selected option
const fetchSelectedActionContent = selectedOption.textContent;
console.log("Selected Action to Get Data Text Content: " + fetchSelectedActionContent);

     // Update the delete button text or disable it
     if (fetchSelectedActionData === "getPostData" || fetchSelectedActionData === "getMediaData" || fetchSelectedActionData === "getcatagoriesData" || fetchSelectedActionData === "getPagesData") {
      
      getDataText.textContent = "Fetch Wordpress Data";
      btngetPopData.setAttribute("data-tooltip", "Fetch Wordpress Data");
  
      btnActionText.textContent = "delete Wordpress Data";
      btnSEOOperations.setAttribute("data-tooltip", "delete Wordpress Data");
  
      selectActionToPerform.value="deleteWordpressData"
  
      sectionDomainInfo.style.display = 'flex';
  
      btngetPopData.disabled = false;
  
      // btnSEOOperations.disabled = true; // Disable Action button till url has value
  
      domainurl.focus();
  
    } else {
  
      // Projects Action not Defined yet
      btngetPopData.setAttribute("data-tooltip", "Fetch Project Data");
      getDataText.textContent = "Fetch Project Data";
      sectionDomainInfo.style.display = 'none';
      btngetPopData.disabled = false;
  
     
    }
  
     if (fetchSelectedActionData === "") {
  
      sectionDomainInfo.style.display = 'none';
  
      btngetPopData.setAttribute("data-tooltip", "Selet Options");
      getDataText.textContent = "Select Options";
  
      btngetPopData.disabled = true;
      selectPopupActions.focus();
  
    }  
  
  }


// Action to Perfrom
function updateActionToPerform() {
  
  //  Fecth Action Values
  let  fetchSelectedActionData = selectPopupActions.value


//  Perform Action Values
let actionsToPerform = selectActionToPerform.value
console.log("Selected Action to Perform: " + actionsToPerform)

// Get the selected option element
const selectedActionOption = selectActionToPerform.selectedOptions[0];
  
// Get the text content of the selected option
const fetchSelectedActionContent = selectedActionOption.textContent;
console.log("Selected Action to Perfrom Text Content: " + fetchSelectedActionContent);


  // Options for Perform Selected Action
  if (fetchSelectedActionData!== "")  {

  
  if  (actionsToPerform === "UpdaProjectsData") {
      btnActionText.textContent = "Update Project(s) Data";
      btnSEOOperations.setAttribute("data-tooltip", "Update Project(s) Data");

      btnupdateSettingbtn.style.display='none'

      getandUpdateProjectSetting("GETDATA");

   
   } else if  (actionsToPerform === "runCreatorPrjoct") {
    btnActionText.textContent = "Run Creator Project(s)";
    btnSEOOperations.setAttribute("data-tooltip", "Run Article Creator Project(s)");
   

    } else if  (actionsToPerform === "runPosterPrjoct") {
      btnActionText.textContent = "Run Poster Project(s)";
      btnSEOOperations.setAttribute("data-tooltip", "Run Post Uploader Project(s)");
  
    
  } else if  (actionsToPerform === "deleteProject") {
    btnActionText.textContent = "delete Selected Prjeect(s)";
    btnSEOOperations.setAttribute("data-tooltip", "delete Selected Prjeect(s)");
   

    } else if  (actionsToPerform === "deleteWordpressData") {
      btnActionText.textContent = "delete Wordpress Data";
      btnSEOOperations.setAttribute("data-tooltip", "delete Wordpress Data");
      

    } else if  (actionsToPerform === "updateUnmatchedData") {
      btnActionText.textContent = "Update blogId(s) & Url(s)";
      btnSEOOperations.setAttribute("data-tooltip", "Update UN-Matched blogId(s) & Url(s)");
      
      
    } else if  (actionsToPerform === "updateRunUnmatchedData") {
      btnActionText.textContent = "Update & RUN UN-Matched blogId(s) & Url(s)";
      btnSEOOperations.setAttribute("data-tooltip", "Update & RUN UN-Matched blogId(s) & Url(s)");
      

      } else if (actionsToPerform === "") {

    btnActionText.textContent = "Select Options";
    btnSEOOperations.setAttribute("data-tooltip", "Select Options");

    selectActionToPerform.focus();

    }  else {

      closeDialog('customSettingDialog')

    }
  }  

}

// get Local JSON file Api call
async function fetchLocalData() {
  try {
    const apiResponse = await fetch(`${appurl}/data`);
    return await apiResponse.json();
  } catch (error) {
    console.error('Error fetching local data:', error);
    return [];
  }
}

// get Google Api function to collect Data
async function fetchGoogleData() {

  const constJSON = 
  {
      "action": "getListofProjectsDomains",
      "username": "ASHFAQ",
      "dataItems": [
      {
  "getData": false,
  "uniqueData": true,
  "columnPairs": [["BlogId", "url", "username", "password"]]
      }
      ]
  }
  
  try {
    const googleApiResponse = await handleApiCall(
      googleurl,
      constJSON,
      30000,
      'Unique Project Name(s) and JobID(s) fetched successfully.',
      'An error occurred while fetching Unique Project Name(s) and JobID(s) Data ',
      true,
      false
    );

    if (!googleApiResponse || !googleApiResponse.uniqueData || !googleApiResponse.uniqueData.BlogIds) {
      return [];
    }

    const blogIds = googleApiResponse.uniqueData.BlogIds;
    const blogObjects = blogIds.map(blog => {
      return {
        id: blog[0],      // Assuming BlogId is at index 0 in the array
        url: blog[1],     // Assuming URL is at index 1 in the array
        username: blog[2], // Assuming username is at index 2 in the array
        password: blog[3], // Assuming password is at index 3 in the array
      };
    });

    return blogObjects;
  } catch (error) {
    console.error('Error fetching and processing Google API data:', error);
    return [];
  }
}

// Populate Options for 
async function populateWordpressDialog() {

  let data;

  try {
    if (!webAppGitHub || !isWebApp) {
      
        // If isWebApp is true, disable specific options
  
        selectActionToPerform.options[3].disabled = false; // Enable the "runPosterPrjoct" option
        selectActionToPerform.options[4].disabled = false; // Enable the "UpdaProjectsData" option
        selectActionToPerform.options[6].disabled = false; // Enable the "updateUnmatchedData" option
        selectActionToPerform.options[7].disabled = false; // Enable the "updateRunUnmatchedData" option
    

      data = await fetchLocalData();
    } 
    if (webAppGitHub || isWebApp) {

        // If isWebApp is true, disable specific options
  
        selectActionToPerform.options[3].disabled = true; // Disable the "runPosterPrjoct" option
        selectActionToPerform.options[4].disabled = true; // Disable the "UpdaProjectsData" option
        selectActionToPerform.options[6].disabled = true; // Disable the "updateUnmatchedData" option
        selectActionToPerform.options[7].disabled = true; // Disable the "updateRunUnmatchedData" option
      
      data = await fetchGoogleData();
    }

    // Populate the domain URL datalist
    const domainurl = document.getElementById('domainurl');
    const urlDataList = document.getElementById('urlDataList');
    clearDatalist(urlDataList);


      // Populate the domain URL datalist with all URLs from data
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.url;
        urlDataList.appendChild(option);
      });
  
      // Add event listener to update other input fields based on selected URL
      domainurl.addEventListener('input', updateInputFields);
  
      function updateInputFields() {
        const selectedUrl = domainurl.value;
        const selectedData = data.find(item => item.url === selectedUrl);
  
        if (selectedData) {
          domaiusername.value = selectedData.username;
          domaipassword.value = selectedData.password;
          domaiBlogId.value = selectedData.id;
  
         
        } else {
          // Clear the input fields if no match is found
          domaiusername.value = '';
          domaipassword.value = '';
          domaiBlogId.value = '';
        }
      }
      

    hideLoader(defaultLoaderId);
  } catch (error) {
    console.error('Error fetching data:', error);
    // Hide the dialog loader
    hideLoader(defaultLoaderId);
  }
}

// Show Wordpress Dialog
async function fetchDomainsAndShowCoDialog(calledFromDashBoard=false) {

  // Clone the loader element, assuming dialogLoaderId is the ID of the loader in the dialog

defaultLoaderId='dialogLoader';

createLoader(defaultLoaderId, popupCommonDialog)

// Show the dialog loader
 showLoader(defaultLoaderId);
 
    try {

      
      populateWordpressDialog()

    btngetPopData.setAttribute("data-tooltip", "Selet Options");
  
     popupCommonDialog.style.display = 'flex';
     popupCommonDialog.showModal();


    //  Add actions Event Listner
     updateWordButtonText()
// Action to perfrom
     updateActionToPerform()

     // Add a change event listener and call the updateButtonText function
selectPopupActions.removeEventListener("change", updateWordButtonText);

// Add a change event listener and call the updateButtonText function
selectPopupActions.addEventListener("change", updateWordButtonText);

// Add a change event listener and call the updateButtonText function
selectActionToPerform.removeEventListener("change", updateActionToPerform);

// Add a change event listener and call the updateButtonText function
selectActionToPerform.addEventListener("change", updateActionToPerform);
 
 if (!calledFromDashBoard) {
    // Clear Existing table Data
    const DataTableForHoldingData = document.getElementById(tableID);
    DataTableForHoldingData.innerHTML = '';
            
 }          
 
          // Hide the dialog loader
 hideLoader(defaultLoaderId);
 
 
    } catch (error) {
      console.error('Error fetching data:', error);
      // Hide the dialog loader
     hideLoader(defaultLoaderId);
    }


}

// Get Data by Selected Action parameter
async function getProjectData() {

   showLoader(defaultLoaderId);

 let fetchSelectedActionData = selectPopupActions.value;

  console.log("Selected Action to Get Data: " + fetchSelectedActionData);


  // Get the selected option element
const selectedOption = selectPopupActions.selectedOptions[0];

// Get the text content of the selected option
const fetchSelectedActionContent = selectedOption.textContent;

  // Check if fetchSelectedActionData is empty
  if (fetchSelectedActionData === "") {

    createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Please Select any Action: ' + fetchSelectedActionContent);
    console.error('Invalid action value :', fetchSelectedActionData, "Text Value: ", fetchSelectedActionContent);
    selectPopupActions.focus();
    return;
  }

  // Clear Existing table Data
  const DataTableForHoldingData = document.getElementById(tableID);
  DataTableForHoldingData.innerHTML = '';

  // Select Object for Data operations, tableData is Real Data, LocalData is a Object stored in blogDataa.js to test large operations on data
  if (UseLocalDataForTable) {
    blogData = LocalData;
  } else {
    blogData = tableData;
  }


  if (blogData.length ===0) {

    createToast('WordpressToastDiv', 'warning', 'fa-solid fa-exclamation-triangle', 'Warning', 'There is not Valid Data present in Local Database');
 
     hideLoader(defaultLoaderId);
    return

    }

let returnedTableData;

fetchSelectedActionData = selectPopupActions.value

console.log ("Fetch Data Passed Action:" + fetchSelectedActionData)

// Actions for Local Data
if (fetchSelectedActionData === 'getProjectsData') {

  popupCommonDialogHeader.textContent="Showing All Projects Data"
  returnedTableData = AllProjectData(blogData)

} else if (fetchSelectedActionData === 'getMatchedData') {
  popupCommonDialogHeader.textContent="Showing Projects with Matching Project & url"
  returnedTableData = getMatchedData(blogData);
 
} else if (fetchSelectedActionData === 'getUnmatchData') {

  popupCommonDialogHeader.textContent="Showing Projects not Matching Project Name & url"
  returnedTableData = getUnmatchedProjects(blogData);
 
} else if (fetchSelectedActionData === 'getUpdatedData') {
 
  popupCommonDialogHeader.textContent="Showing Projects Updated Matched Project Name, blogID & url, old blogID & Old Url"
  returnedTableData = getUpdatedProjectData(blogData);
  
}  // Actions for Wordpress Data
 else if (fetchSelectedActionData === "getPostData" || fetchSelectedActionData === "getMediaData" || fetchSelectedActionData === "getcatagoriesData" || fetchSelectedActionData === "getPagesData") { 
      // Call Wordpress Actions
      fetchWordPressData();
      return; // Stop further execution of the function
  }

  if (returnedTableData.length > 0) {

    createToast('WordpressToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', 'Local Data has been fetched from Database for Selected Action: ' + fetchSelectedActionContent);
    // Create a table or perform actions based on the fetchSelectedActionData

    createTableFromData(returnedTableData, true, tableID, false, 4);  // Add checkboxes and use dashboard elements
    hideLoader(defaultLoaderId);
  } else {
    // Handle cases where no data was fetched or an error occurred
    
    createToast('WordpressToastDiv', 'warning', 'fa-solid fa-exclamation-triangle', 'Warning', 'There is not Valid Data present in Local Database');
    console.error(`There is not Valid Data present in Local Database: ${fetchSelectedActionContent}`);
    hideLoader(defaultLoaderId);
  }

}

// WORKING BUT NOT ALL PAGES FETCHED
// Function to get Wordpress Data
async function fetchWordPressData() {

  const domain = domainurl.value;
  const username = domaiusername.value;
  const password = domaipassword.value;

  // Check if vald credentials are provided
if (!domain || !username || !password) {


  createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Please provide domain, username, and password.');
  console.error('Invalid credentials. Please provide domain, username, and password.');
  return; 
}

 showLoader(defaultLoaderId);
const fetchActions = selectPopupActions.value

console.log("Selected Action to perform: "+ fetchActions)


  try {

  
 const perPage = 100;

 // Modify the API endpoint for posts to include posts of all statuses
// const statusQueryParam = 'status=publish,draft,pending,future,private,inherit,trash,password_protected'; // Define your desired statuses
const statusQueryParam = `status=publish,draft,pending,future,private,inherit,trash&per_page=${perPage}`; // Define your desired statuses

// const statusQueryParam = 'status=any'; // Define your desired statuses

const mediaStatusQueryParam = `status=inherit,trash&per_page=${perPage}`; // Define your desired statuses

 let apiEndpoint;

 switch (fetchActions) {
   case 'getPostData':
     popupCommonDialogHeader.textContent="Showing Wordpress fetched Post(s) Data "
     apiEndpoint = `wp-json/wp/v2/posts?orderby=id&order=desc&${statusQueryParam}`;
     break;
   case 'getMediaData':
     popupCommonDialogHeader.textContent="Showing Wordpress Media Data "
     apiEndpoint = `wp-json/wp/v2/media?orderby=id&order=desc&${mediaStatusQueryParam}`;
     break;
  
   case 'getPagesData':
     popupCommonDialogHeader.textContent="Showing Wordpress Pages Data "
     apiEndpoint = `wp-json/wp/v2/pages?orderby=id&order=desc&${statusQueryParam}`;
     break;
   case 'getcatagoriesData':
     popupCommonDialogHeader.textContent="Showing Wordpress categories Data"
     apiEndpoint =  `wp-json/wp/v2/categories?orderby=id&order=desc&${statusQueryParam}`;
     break;
   default:
     console.error('Invalid action:', fetchActions);
     createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Invalid selected Wordpress Action: ' + fetchActions);
     
     
     return;

 }

 if (!apiEndpoint) {
  hideLoader(defaultLoaderId);
   console.error('Invalid Wordpress API Endpoint:', fetchActions);
   createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Not a Valid Wordpress Api Endpoint for Selected Action: ' + fetchActions);
   return;
 }


  const baseUrl = domain.endsWith('/') ? domain : domain + '/';

    const response = await fetch(baseUrl + apiEndpoint, {
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      },
    });

    if (!response.ok) {
      hideLoader(defaultLoaderId);
      createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'There is an error while fetching data from WordPress Server');
      console.error(`Failed to fetch ${fetchActions} data. Status: ${response.status}`);
      return
    }

    const wordPressApiData = await response.json();

    console.log("Wordpress API Call unstructured Data: ")
    console.table(wordPressApiData)
    
   const DataFetchedFormAPI = filterAndTransformData(wordPressApiData);

    
    // return DataFetchedFormAPI
    
if (DataFetchedFormAPI.length > 0) {

  createTableFromData(DataFetchedFormAPI, true ,tableID, false, 1);  // Add checkboxes and use dashboard elements
  hideLoader(defaultLoaderId);

createToast('WordpressToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', 'Wordpress Data has been fetched from selected <br> Domain:  ' + domain);
console.log("Wordpress Data Table:")
console.table(DataFetchedFormAPI)

} else {
  // Handle cases where no data was fetched or an error occurred
  
  createToast('WordpressToastDiv', 'warning', 'fa-solid fa-exclamation-triangle', 'Warning', 'Wordpress Data has not returned any Data or Valid Data selected <br>Domain: ' + domain);   
  console.error(`No data fetched for action: ${fetchActions}`);
  hideLoader(defaultLoaderId);
}
  } catch (error) {
    
    hideLoader(defaultLoaderId);
    createToast('WordpressToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', 'WordPress Data has been fetched from the selected <br> Domain:  ' + domain);
    console.error(`Error fetching ${fetchActions} data:`, error);
  }
}

// Function to fetch WordPress Data
// Function to fetch WordPress Data
// async function fetchWordPressData() {

//   const keyToColumnMapping = {
//     id: 'id',
//     date: 'date',
//     title: 'title.rendered',
//     status: 'status',
//     type: 'type',
//     media_type: 'media_type',
//     media_details: 'media_details.file',
//     guid: 'guid.rendered',
//     link:"link",
//     name: "name",
//     slug: "slug",

//   };
//   const domain = domainurl.value;
//   const username = domaiusername.value;
//   const password = domaipassword.value;

//   // Check if valid credentials are provided
//   if (!domain || !username || !password) {
//     createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Please provide domain, username, and password.');
//     console.error('Invalid credentials. Please provide domain, username, and password.');
//     return;
//   }

//    showLoader(defaultLoaderId);
//   const fetchActions = selectPopupActions.value;

//   console.log("Selected Action to perform: " + fetchActions)

//   try {
//     const perPage = 100;
//     let page = 1; // Start with the first page

//     let allWordPressData = []; // To store all fetched data

//     let apiEndpoint;

//     switch (fetchActions) {
//       case 'getPostData':
//         popupCommonDialogHeader.textContent = "Showing WordPress fetched Post(s) Data "
//         apiEndpoint = `wp-json/wp/v2/posts?status=publish,draft,pending,future,private,inherit,trash&per_page=${perPage}&page=${page}`;
//         break;
//       case 'getMediaData':
//         popupCommonDialogHeader.textContent = "Showing WordPress Media Data "
//         apiEndpoint = `wp-json/wp/v2/media?status=inherit,trash&per_page=${perPage}&page=${page}`;
//         break;
//       case 'getPagesData':
//         popupCommonDialogHeader.textContent = "Showing WordPress Pages Data "
//         apiEndpoint = `wp-json/wp/v2/pages?status=publish,draft,pending,future,private,inherit,trash&per_page=${perPage}&page=${page}`;
//         break;
//       case 'getCategoriesData':
//         popupCommonDialogHeader.textContent = "Showing WordPress Categories Data"
//         apiEndpoint = `wp-json/wp/v2/categories?status=publish,draft,pending,future,private,inherit,trash&per_page=${perPage}&page=${page}`;
//         break;
//       default:
//         console.error('Invalid action:', fetchActions);
//         createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Invalid selected WordPress Action: ' + fetchActions);
//         return;
//     }

//     if (!apiEndpoint) {
//        hideLoader(defaultLoaderId);
//       console.error('Invalid WordPress API Endpoint:', fetchActions);
//       createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Not a Valid WordPress API Endpoint for Selected Action: ' + fetchActions);
//       return;
//     }

//     const baseUrl = domain.endsWith('/') ? domain : domain + '/';

//     while (true) {
//       const response = await fetch(baseUrl + apiEndpoint, {
//         headers: {
//           Authorization: `Basic ${btoa(`${username}:${password}`)}`,
//         },
//       });

//       if (!response.ok) {
//          hideLoader(defaultLoaderId);
//         createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'There is an error while fetching data from WordPress Server');
//         console.error(`Failed to fetch ${fetchActions} data. Status: ${response.status}`);
//         return;
//       }

//       const wordPressApiData = await response.json();

//       if (wordPressApiData.length === 0) {
//         // No more data to fetch, exit the loop
//         break;
//       }

//       allWordPressData = allWordPressData.concat(wordPressApiData);

//       // Increment the page number for the next request
//       page++;

//       // Update the API endpoint with the new page number
//       apiEndpoint = `${apiEndpoint}&page=${page}`;
//     }

//     console.log("WordPress API Call unstructured Data: ")
//     console.table(allWordPressData);

//     const DataFetchedFromAPI = allWordPressData.map(item => {
//       const mappedItem = {};
//       for (const key in keyToColumnMapping) {
//         const apiField = keyToColumnMapping[key];
//         const apiValue = apiField.split('.').reduce((obj, field) => obj[field], item);
//         mappedItem[key] = apiValue;
//       }
//       return mappedItem;
//     });

//     if (DataFetchedFromAPI.length > 0) {
//       createTableFromData(DataFetchedFromAPI, true, tableID, false, 1); // Add checkboxes and use dashboard elements
//        hideLoader(defaultLoaderId);

//       createToast('WordpressToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', 'WordPress Data has been fetched from selected <br> Domain:  ' + domain);
//       console.log("WordPress Data Table:")
//       console.table(DataFetchedFromAPI);
//     } else {
//       createToast('WordpressToastDiv', 'warning', 'fa-solid fa-exclamation-triangle', 'Warning', 'WordPress Data has not returned any Data or Valid Data selected <br>Domain: ' + domain);
//       console.error(`No data fetched for action: ${fetchActions}`);
//        hideLoader(defaultLoaderId);
//     }
//   } catch (error) {

//      hideLoader(defaultLoaderId);
//     createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Error fetching WordPress data: ' + error.message);
//     console.error(`Error fetching ${fetchActions} data:`, error);
//   }
// }
// async function fetchWordPressData() {
//   const keyToColumnMapping = {
//     id: 'id',
//     date: 'date',
//     title: 'title.rendered',
//     status: 'status',
//     type: 'type',
//     media_type: 'media_type',
//     media_details: 'media_details.file',
//     guid: 'guid.rendered',
//     link: 'link',
//     name: 'name',
//     slug: 'slug',
//   };

//   const domain = domainurl.value;
//   const username = domaiusername.value;
//   const password = domaipassword.value;

//   // Check if valid credentials are provided
//   if (!domain || !username || !password) {
//     createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Please provide domain, username, and password.');
//     console.error('Invalid credentials. Please provide domain, username, and password.');
//     return;
//   }

//    showLoader(defaultLoaderId);
//   const fetchActions = selectPopupActions.value;

//   console.log("Selected Action to perform: " + fetchActions);

//   try {
//     const perPage = 100;
//     let page = 1; // Start with the first page

//     let allWordPressData = []; // To store all fetched data

//     let apiEndpoint;

//     switch (fetchActions) {
//       case 'getPostData':
//         popupCommonDialogHeader.textContent = "Showing WordPress fetched Post(s) Data "
//         apiEndpoint = `wp-json/wp/v2/posts?status=publish,draft,pending,future,private,inherit,trash&per_page=${perPage}&page=${page}`;
//         break;
//       case 'getMediaData':
//         popupCommonDialogHeader.textContent = "Showing WordPress Media Data "
//         apiEndpoint = `wp-json/wp/v2/media?status=inherit,trash&per_page=${perPage}&page=${page}`;
//         break;
//       case 'getPagesData':
//         popupCommonDialogHeader.textContent = "Showing WordPress Pages Data "
//         apiEndpoint = `wp-json/wp/v2/pages?status=publish,draft,pending,future,private,inherit,trash&per_page=${perPage}&page=${page}`;
//         break;
//       case 'getCategoriesData':
//         popupCommonDialogHeader.textContent = "Showing WordPress Categories Data"
//         apiEndpoint = `wp-json/wp/v2/categories?status=publish,draft,pending,future,private,inherit,trash&per_page=${perPage}&page=${page}`;
//         break;
//       default:
//         console.error('Invalid action:', fetchActions);
//         createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Invalid selected WordPress Action: ' + fetchActions);
//         return;
//     }

//     if (!apiEndpoint) {
//        hideLoader(defaultLoaderId);
//       console.error('Invalid WordPress API Endpoint:', fetchActions);
//       createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Not a Valid WordPress API Endpoint for Selected Action: ' + fetchActions);
//       return;
//     }

//     const baseUrl = domain.endsWith('/') ? domain : domain + '/';

//     while (true) {
//       const response = await fetch(baseUrl + apiEndpoint, {
//         headers: {
//           Authorization: `Basic ${btoa(`${username}:${password}`)}`,
//         },
//       });

//       if (!response.ok) {
//          hideLoader(defaultLoaderId);
//         createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'There is an error while fetching data from WordPress Server');
//         console.error(`Failed to fetch ${fetchActions} data. Status: ${response.status}`);
//         return;
//       }

//       const wordPressApiData = await response.json();

//       if (wordPressApiData.length === 0) {
//         // No more data to fetch, exit the loop
//         break;
//       }

//       allWordPressData = allWordPressData.concat(wordPressApiData);

//       // Increment the page number for the next request
//       page++;

//       // Update the API endpoint with the new page number
//       // if (fetchActions !== 'getMediaData') {
//       //   apiEndpoint = `${apiEndpoint}&page=${page}`;
//       // }
//     }

//     console.log("WordPress API Call unstructured Data: ")
//     console.table(allWordPressData);

//     const DataFetchedFromAPI = allWordPressData.map(item => {
//       const mappedItem = {};
//       for (const key in keyToColumnMapping) {
//         const apiField = keyToColumnMapping[key];
//         const apiValue = apiField.split('.').reduce((obj, field) => obj[field], item);
//         mappedItem[key] = apiValue;
//       }
//       return mappedItem;
//     });

//     if (DataFetchedFromAPI.length > 0) {
//       createTableFromData(DataFetchedFromAPI, true, tableID, false, 1); // Add checkboxes and use dashboard elements
//        hideLoader(defaultLoaderId);

//       createToast('WordpressToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', 'WordPress Data has been fetched from selected <br> Domain:  ' + domain);
//       console.log("WordPress Data Table:")
//       console.table(DataFetchedFromAPI);
//     } else {
//       createToast('WordpressToastDiv', 'warning', 'fa-solid fa-exclamation-triangle', 'Warning', 'WordPress Data has not returned any Data or Valid Data selected <br>Domain: ' + domain);
//       console.error(`No data fetched for action: ${fetchActions}`);
//        hideLoader(defaultLoaderId);
//     }
//   } catch (error) {

//      hideLoader(defaultLoaderId);
//     createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Error fetching WordPress data: ' + error.message);
//     console.error(`Error fetching ${fetchActions} data:`, error);
//   }
// }



// Function to perform actions based on selected action

// Run Operations Based on Actions
async function PerfromActionsToData() {
  
//  Perform Action Values
const selectedAction  = selectActionToPerform.value
console.log ("Selected Action to Perform is :" + selectedAction)
// Actions for Local Data

// Get the selected option element
const selectedOption = selectActionToPerform.selectedOptions[0];
// Get the text content of the selected option
const fetchSelectedActionContent = selectedOption.textContent;
console.log("Selected Action to Get Data Text Content: " + fetchSelectedActionContent);


//  Perform Action Values
actionsToPerform = selectActionToPerform.value
console.log("Selected Action: " + actionsToPerform)

  // Individual deletes if batch delete is not supported
  if (cellValuesArray.length === 0) {

  createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Please any ID to Perform Action');
    console.error('No items ID selected for Action.')
    return;
  }

  if (selectedAction ==='') {
      createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Select Action to Perform on Database: ');
      console.error('No items selected for Action.')
   return
  }

   showLoader(defaultLoaderId);

    switch (selectedAction) {

      case 'updateUnmatchedData':
        UpdateProjectSettings(true, false);
        break;
    
      case 'UpdaProjectsData':
        UpdateProjectSettings(false, false);
        break;

      case 'runCreatorPrjoct':
        runCreatorProjectInBatch(cellValuesArray);
        break;

      case 'runPosterPrjoct':
        runPosterProjectInBatch(cellValuesArray);
        break;

      case 'deleteProject':
        deleteProjectInBatch(cellValuesArray);
        break;

      case 'deleteWordpressData':
        deleteWordpressData(cellValuesArray);
        break;
    
        case 'updateRunUnmatchedData':
          UpdateProjectSettings(true, true);
          break;

      default:
      createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Invalid Selected action: ' + fetchSelectedActionContent);
      console.log('Invalid action:', fetchSelectedActionData);
      console.log("Selected Action to Get Data Text Content: " + fetchSelectedActionContent);
      hideLoader(defaultLoaderId);
      return;
    }
 
}


// Update Project Settings
async function UpdateProjectSettings(isUpdateOnlyBlogIds, isRunProjectRequired) {
  // Perform Action Values
  const selectedAction = selectActionToPerform.value;
  console.log("Selected Action to Perform is: " + selectedAction);

  try {
     showLoader(defaultLoaderId);
    const results = await bulkUpdateDatatoSEO(cellValuesArray, isUpdateOnlyBlogIds);

    console.log(results);

 
    // Extract creatorId values from results
const creatorIds = results.map(result => result.creatorId);

// Highlight rows in the 'main' table based on creatorId values
highlightRowsInTable(tableID, 1, creatorIds);

    if (isRunProjectRequired) {
      runSelectedProjectSEO(ValuestoUpdateToTable.creatorId, true);
    }
  } catch (error) {
     hideLoader(defaultLoaderId);
    // Handle any errors that occur during the process
    console.error(`Error updating settings: ${error}`);
  }
}


function highlightRowsInTable(tableId, columnIndex, targetValues) {

  try {
  const table = document.getElementById(tableId);
  const rows = table.getElementsByTagName('tr');

  for (let i = 1; i < rows.length; i++) { // Start from index 1 to skip the header row
    const cells = rows[i].getElementsByTagName('td');
    if (columnIndex < cells.length) {
      const cellValue = cells[columnIndex].textContent.trim();
      if (targetValues.includes(cellValue)) {
        // Highlight the row
        rows[i].classList.add('highlighted-row');
      }
    }
    // Remove the highlight after a delay
    setTimeout(() => {
      rows[i].classList.remove('highlighted-row');
    }, 3000);
  }

} catch (error) {
console.error('Error updating and highlighting rows:', error);
}
}


  // Function to Run Selected Projects
async function runCreatorProjectInBatch(projectArrayToRun) {

    // confirm before Delete
    const confirmDialogUse = await openConfrimDialog('RUN Selected Project(s): ?', 'Do you want to RUN ALL Selected Article Creator Project(s) on SEO?');
    
    if (confirmDialogUse) { 
      
    // Loop through the selected IDs and RUN each Project
    for (const prjoectID of projectArrayToRun) {
      // Call Local function to run a project no confimation required

       runProjectMain(prjoectID)
    
      }
  
    }

    highlightRowsInTable(tableID, 1, projectArrayToRun);
 
}

// Run Post Uploader Projects in batch.
async function runPosterProjectInBatch(PosterprojectIDsToRun) {

  // confirm before Delete
  const confirmDialogUse = await openConfrimDialog('RUN Selected Project(s): ?', 'Do you want to RUN ALL Selected Post Uploader Project(s) on SEO?');
    
  if (confirmDialogUse) { 
    
  // Loop through the selected IDs and RUN each Project
  for (const postId of PosterprojectIDsToRun) {

    // Call Local function to run a project no confimation required
    handlePostUploaderStatus(postId);
    
    }  

  }

}

  // Function to Run Selected Projects
 async function deleteProjectInBatch (projectIDsToDelete) {

// confirm before Delete
  const confirmDialogUse = await openConfrimDialog('Delete Selected Project(s): ?', 'Do you want to DELETE ALL Selected Project(s) from SEO?');
    
  if (confirmDialogUse) { 
    
  // Loop through the selected IDs and delete each post
  for (const postId of projectIDsToDelete) {

 
    // Call Local function to delete a project no confimation required
    deleteProjectDatafromSEO(postId)
  
    deleteRowsFromTableAndArray(tableID, 1, postId, blogData)
  
    }   

  }

}

// Function to delete data based on the selected action
async function deleteWordpressData(PostIdsToDelete) {

  let fetchSelectedActionData = selectPopupActions.value;

    // Get the selected option element
    const selectedOption = selectPopupActions.selectedOptions[0];
    // Get the text content of the selected option
    const fetchSelectedActionContent = selectedOption.textContent;
  
    console.log("Selected Action to Get Data Text Content: " + fetchSelectedActionContent);


  if (PostIdsToDelete.length === 0) {
      createToast('WordpressToastDiv', 'info', 'fa-solid fa-info-circle', 'Info', 'Please select any ID to perform action');
      console.error('Please select any ID to perform action');
      return;
  }

    // confirm before Delete
    const confirmDialogUse = await openConfrimDialog('DELETE Selected Wordpress Data: ?', 'Do you want to DELETE ALL Selected IDs <br> for Selected Action: ' + fetchSelectedActionContent +'?');
    
    if (!confirmDialogUse) { 
      
    return
  
    } else {

  const domain = domainurl.value;
  const username = domaiusername.value;
  const password = domaipassword.value;


  let apiEndpointToDelete;

  switch (fetchSelectedActionData) {
      case 'getPostData':
          apiEndpointToDelete = 'wp-json/wp/v2/posts';
          break;
      case 'getMediaData':
          apiEndpointToDelete = 'wp-json/wp/v2/media';
          break;
      case 'getPagesData':
          apiEndpointToDelete = 'wp-json/wp/v2/pages';
          break;
      case 'getcatagoriesData':
          apiEndpointToDelete = `wp-json/wp/v2/categories`;
          break;
      default:
          console.error('Invalid action:', fetchSelectedActionData);
          console.log("Selected Action to Get Data Text Content: " + fetchSelectedActionContent);
          createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Invalid action Selected or Empty Action: ' + fetchSelectedActionContent);
          return;
  }

  // Loop through the selected IDs and delete each post
  for (const postId of PostIdsToDelete) {
      try {
          const response = await fetch(`${domain}/${apiEndpointToDelete}/${postId}?force=true`, {
              method: 'DELETE',
              headers: {
                  Authorization: `Basic ${btoa(`${username}:${password}`)}`,
              },
          });

          if (response.ok) {
              console.log(`Post with ID ${postId} deleted successfully.`);
              deleteRowsFromTableAndArray(tableID, 1, postId);
              createToast('WordpressToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', `Successfully Deleted ID ${postId}.`);

          } else {
              createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', `Failed to delete ID ${postId}.`);
              console.error(`Failed to delete post with ID ${postId}. Status: ${response.status}`);
          }
      } catch (error) {
          console.error(`Error deleting post with ID ${postId}:`, error);
          createToast('WordpressToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', `Failed to delete ID ${postId}.`);
      }
  }
 hideLoader(defaultLoaderId);
  // Remove values from array after delete.
  cellValuesArray = [];
}
}

// Format Dates to Normal Dates 
function formatWordpressDate(isoDateString, includeTime) {
  const date = new Date(isoDateString);

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
    options.hour12 = true; // Use 12-hour format
  }

  return date.toLocaleString(undefined, options);
}


// Transfor Keys and Find Keys from Response Data
function filterAndTransformData(rawData) {

  if (!Array.isArray(rawData)) {
    return [];
  }

    // Actions for Wordpress Data

    const keyToColumnMapping = {
      id: 'id',
      date: 'date',
      title: 'title.rendered',
      status: 'status',
      type: 'type',
      media_type: 'media_type',
      media_details: 'media_details.file',
      guid: 'guid.rendered',
      link:"link",
      name: "name",
      slug: "slug",
  
    };

  const filteredData = rawData.map(item => {
    const filteredItem = {};

    for (const key in keyToColumnMapping) {
      if (keyToColumnMapping.hasOwnProperty(key)) {
        const mapTo = keyToColumnMapping[key].split('.'); // Split nested keys
        let value = item;

        // Traverse the object to access nested keys
        for (const mapKey of mapTo) {
          if (value.hasOwnProperty(mapKey)) {
            value = value[mapKey];
          } else {
            value = ''; // Set to empty string if key not found
            break; // Exit loop if key not found
          }
        }

        // Rename keys as specified
        switch (key) {
          case 'guid':
            filteredItem['url'] = value;
            break;
          case 'title':
            filteredItem['title'] = value;
            break;
          case 'media_type':
            filteredItem['filetype'] = value;
            break;
          case 'media_details':
            filteredItem['fileName'] = value;
            break;
          case 'date':
            // Format the date if the key is 'date'
            filteredItem[key] = formatWordpressDate(value, true); // Include time
            break;
          default:
            filteredItem[key] = value;
            break;
        }
      }
    }

    return filteredItem;
  });

  return filteredData;


}


// Function to Clean invalid Characters from the Data
function cleanData(data) {

  const cleanedData = data.map((item) => {
    // Remove HTML tags and replace invalid characters
    const cleanedItem = {};
    for (const key in item) {
      if (Object.hasOwnProperty.call(item, key)) {
        const value = item[key];
        if (Array.isArray(value)) {
          // Flatten arrays like categories
          cleanedItem[key] = value.map((categoryId) => categoryId).join(', ');
        } else if (typeof value === 'string') {
          // Remove HTML tags and replace invalid characters
          cleanedItem[key] = value.replace(/<[^>]*>?/gm, '').replace(/[^\w-]+/g, ' ');
        } else {
          // Preserve other data types
          cleanedItem[key] = value;
        }
      }
    }
    return cleanedItem;
  });

  return cleanedData;
}

// // Function to handle the "Select All" checkbox and individual checkboxes
function handleCheckboxes(tableID, selectAllCheckboxId, cellsToCapture) {

  //  Perform Action Values
const selectedAction  = selectActionToPerform.value
console.log ("Selected Action to Perform is :" + selectedAction)

  const table = document.getElementById(tableID);
  const selectAllCheckbox = document.getElementById(selectAllCheckboxId);
  const checkboxes = table.querySelectorAll('tbody input[type="checkbox"]');
  const updateCellValueArrayFunctions = [];

  if (!table || !selectAllCheckbox) {
    console.error('Invalid table or checkboxes.');
    
    return;
  }

 
// Function to update the cellValuesArray based on checkbox state
function updateCellValueArray(checkbox) {
  const isChecked = checkbox.checked;
  const cellIndex = Array.from(checkbox.closest('tr').querySelectorAll('td')).indexOf(checkbox.closest('td'));

  if (isChecked) {
    let cellValues = [];

    for (let i = 0; i < cellsToCapture; i++) {
      const cellValue = checkbox.closest('tr').querySelectorAll('td')[cellIndex + 1 + i].textContent;
      cellValues.push(cellValue);
    }

    // Add cellValues to the cellValuesArray
    cellValuesArray.push(cellValues);
    console.log('Array:', cellValuesArray);
  } else {
    // Handle unchecking checkboxes if needed
    const cellValue = checkbox.closest('tr').querySelectorAll('td')[cellIndex + 1].textContent;
    const indexToRemove = cellValuesArray.findIndex((values) => values.includes(cellValue));

    if (indexToRemove !== -1) {
      cellValuesArray.splice(indexToRemove, 1);
      console.log('Array:', cellValuesArray);
    }
  }
}


  // Add event listeners to individual checkboxes and store their update functions
  checkboxes.forEach((cb) => {
    const updateFn = () => updateCellValueArray(cb);
    cb.addEventListener('change', updateFn);
    updateCellValueArrayFunctions.push({ checkbox: cb, updateFn });
  });

  // Add an event listener to the "Select All" checkbox
  selectAllCheckbox.addEventListener('change', function () {
    const isChecked = this.checked;
    checkboxes.forEach((cb) => {
      cb.checked = isChecked;
      updateCellValueArray(cb);
    });
  });

  // Function to remove event listeners
  function removeCheckboxEventListeners() {
    checkboxes.forEach((cb, index) => {
      const { checkbox, updateFn } = updateCellValueArrayFunctions[index];
      cb.removeEventListener('change', updateFn);
    });
  }

  // Add a function to remove event listeners when needed
  selectAllCheckbox.addEventListener('change', function () {
    const isChecked = this.checked;
    checkboxes.forEach((cb) => {
      cb.checked = isChecked;
    });

    // Remove individual checkbox event listeners
    if (isChecked) {
      removeCheckboxEventListeners();
    } else {
      checkboxes.forEach((cb, index) => {
        const { checkbox, updateFn } = updateCellValueArrayFunctions[index];
        cb.addEventListener('change', updateFn);
      });
    }
  });
}


// Re-Arrange Data in required format.
function AllProjectData(blogData) {
  const rearrangedKeys = [
    "ProjectID",
    "PostUploaderId",
    "BlogId",
    "ProjectName",
    "ProjectCreatorStatus",
    "PostUploaderName",
    "PostUploaderStatus",
    "PostStartDate",
    "url"
  ];

  // Create a new array with the keys rearranged for each record
  const rearrangedDataArray = blogData.map((project) => {
    const rearrangedRecord = {};
    for (const key of rearrangedKeys) {
      if (project.hasOwnProperty(key)) {
        rearrangedRecord[key] = project[key];
      }
    }
    return rearrangedRecord;
  });

  console.log(rearrangedDataArray);

  return rearrangedDataArray;
}



// Function to Find Matched Projects
function getMatchedData(blogData) {

  try {
    const matchedObjects = [];

    blogData.forEach((project) => {
      const { ProjectID, PostUploaderId, ProjectName, PostUploaderName, url, BlogId, ProjectCreatorStatus, PostUploaderStatus  } = project
      // Check if the projectName is found in the URL or if the URL matches the expected pattern
      if (url.includes(ProjectName) || ProjectName.includes(url)) {
        matchedObjects.push({
          ProjectID,
          PostUploaderId,
           BlogId,
          ProjectName,
          ProjectCreatorStatus,
          PostUploaderName,
          PostUploaderStatus,
          url,
        });
      } 
    });
  
// Now you have two arrays: matchedObjects and unMatchedObjects
console.log("Matched Objects:", matchedObjects);
return matchedObjects;
} catch (error) {

  console.error(`There is no MATCHED Data Found.`);
  return matchedObjects;

}

}

// Function to Find Unmatched Projects Data
function getUnmatchedProjects(blogData) {

  try {

    const unMatchedObjects = [];

    blogData.forEach((project) => {
      const { ProjectID, PostUploaderId, ProjectName, PostUploaderName, url, BlogId, ProjectCreatorStatus, PostUploaderStatus  } = project
      // Check if the projectName is found in the URL or if the URL matches the expected pattern
      if (url.includes(ProjectName) || ProjectName.includes(url)) {
      
      } else
      unMatchedObjects.push({
        ProjectID,
        PostUploaderId,
         BlogId,
        ProjectName,
        ProjectCreatorStatus,
        PostUploaderName,
        PostUploaderStatus,
        url,
      });
    });
  
  
 // Now you have two arrays: matchedObjects and unMatchedObjects
console.log("Un Matched Objects:", unMatchedObjects);

return unMatchedObjects;

} catch (error) {
  
   console.error(`Failed to get UNMATCHED DATA from Table Data Object `);
 return unMatchedObjects;

}
  
}
  
function getUpdatedProjectData(blogData) {
  try {
      const blogUrlList = [];
      blogData.forEach((project) => {
          blogUrlList.push({
              BlogId: project.BlogId,
              url: project.url
          });
      });

      console.log("List of Blog URL and Blog IDs:", blogUrlList);

      // Collect unmatched Object from getUnmatchedProjects function.
      const unmatchedProjects = getUnmatchedProjects(blogData);

      const newUpdatedObjects = [];

      unmatchedProjects.forEach((unmatchedProject) => {
          const { ProjectName } = unmatchedProject;

          // Find the projectName in blogUrlList
          const matchingBlog = blogUrlList.find((blog) => {
              // Use RegExp to find a partial match in the URL
              const regex = new RegExp(ProjectName, 'i');
              return regex.test(blog.url);
          });

          if (matchingBlog) {
              // Construct a new updated object
              const newUpdatedObject = {
                  ProjectID: unmatchedProject.ProjectID,
                  PostUploaderId: unmatchedProject.PostUploaderId,
                  newblogID: matchingBlog.BlogId,
                  newurl: matchingBlog.url,
                  ProjectName: unmatchedProject.ProjectName,
                  ProjectCreatorStatus: unmatchedProject.ProjectCreatorStatus,
                  PostUploaderName: unmatchedProject.PostUploaderName,
                  PostUploaderStatus: unmatchedProject.PostUploaderStatus,
                  oldurl: unmatchedProject.url,
                  oldBlogId: unmatchedProject.BlogId,
              };

              newUpdatedObjects.push(newUpdatedObject);
          }
      });

      console.log("New Updated Objects:", newUpdatedObjects);
      return newUpdatedObjects; // Return the newUpdatedObjects array

  } catch (error) {
      console.error(`Failed to get UNMATCHED DATA from Table Data Object`);
      return newUpdatedObjects; // Return an empty array in case of an error
  }
}



  
  
 