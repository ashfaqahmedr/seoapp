// Main Toast
function createToast(toastDivId, type, icon, title, text) {
  const toastDiv = document.getElementById(toastDivId);
  if (!toastDiv) {
    console.error(`Toast element with id '${toastDivId}' not found.`);
    return;
  }

  let newToast = document.createElement('div');
  newToast.innerHTML = `
      <div class="sub-toast ${type}">
              <i class="${icon}"></i>
              <div class="content">
                  <div class="title">${title}</div>
                  <span>${text}</span>
              </div>
              <i class="close fa-solid fa-xmark"
              onclick="(this.parentElement).remove()"
              ></i>
          </div>`;

  toastDiv.appendChild(newToast);
  newToast.timeOut = setTimeout(() => newToast.remove(), 5000);
}


//Get All Project Data Api calls  both Local and Googler Server
async function getAllProjectsDataDashBoard() {
  apiCalltoMake = 'ProjectsData';
  popupCommonDialogHeader.innerText = "Showing All Project(s) Data";

  // Show Animation
  showLoader();

  if (isWebApp) {

    // If Web App Make Google Api Request to get Data

    getAllProjectDataGAPI()
  
  } 

  // If Local Server Make Local Api Request to get Data
    else  { 

      if (UseLocalDataForTable) {
    // Create table from blogData Object  
      createTableFromData(LocalData, false ,'main', true);
      } 
      else {
         // Fetch Project Data from SEO.
        fetchAllLocalProjectsSEO();
    }
  
}

updateStatusCounts(); 

}

//Get Project Counts based on api Call we made
async function updateStatusCounts() {


  if (!UseLocalDataForTable) {
    
    if (isWebApp) {
    
    updateSidebarCountsGAPI()

  }

  else {
  
  LocalGetProjectCounts();
    
  }
  }
}

//Function to uodate Dashboard Project Counts based on API Response
function updateDashboardCounts(counts) {
  const statusSpans = {
    allprojects: document.getElementById('allproject-count'),
    creator: document.getElementById('creator-count'),
    poster: document.getElementById('poster-count'),
    jsoncount: document.getElementById('json-count'),
    draft: document.getElementById('draft-count'),
    waiting: document.getElementById('waiting-count'),
    failed: document.getElementById('failed-count'),
    aborted: document.getElementById('aborted-count'),
    complete: document.getElementById('complete-count'),
    running: document.getElementById('running-count'),
    aborting: document.getElementById('aborting-count'),
  };

  for (const status in counts) {
    if (statusSpans.hasOwnProperty(status)) {
      statusSpans[status].textContent = counts[status];
    }
  }
}

//Function to Get / add  /Update projects Data for both Local and Google Server
async function fetchDataAndHandle(selectedRowId, method, isRunProjectRequired, isDuplicated) {


  
  const JSOObbject = {
    ProjectName: articleProjectNameInput.value,
    ProjectKeyowrds: articleKeywordsFileInput.value,
    ProjectCatagories: articleCategoriesInput.value,
    JobCronString: projectCronString.value,  // jobcron
    ImageType : projectImageTypeSelect.value,
    PostUploaderId: PostUploaderIdInput.value,
    PostUploaderName: postJobNameInput.value,
    PostStartDate: postDateInput.value,
    BlogId: BlogIdInput.value,
    url: blogUrlInput.value,
  }

  // Object Based on Criteria 
let mainJSONData;

  if (isUpdateDomainInfo) {
  // add Domain info in the JSON Object
    mainJSONData = {
      ...JSOObbject,
       username: blogUserNameInput.value,
       password: blogPasswordInput.value,
       group: blogGroupInput.value
     }
console.log("Data for Update with Blog Data")
     console.table(mainJSONData)
  } else {
// If not Duplicated and Add New Project dont pass Domain Info 
    mainJSONData = {
      ...JSOObbject
    }

    console.log("Data for without BLog Data")
     console.table(mainJSONData)
  }

  if (method.toUpperCase() === 'GETDATA') { 
  
  
      if (isWebApp)  {
        // Make an API Call to Google Server.
      getSelectedProjectDataGAPI(selectedRowId);
       
      } else {
        // Get Data selected project Data from Local Server.
      GetSelectedProjectLocal(selectedRowId);
      }
      
    }
  
    
  else if (method.toUpperCase() === 'UPDATEDATA') {
  
    
    // Validate required fields and check if they are all filled
const isValid = validateRequiredFields(dialogProjectsDialog);

if (isValid) {


} else {
 createToast('ProjectToastDiv', 'info', 'fa-solid fa-info-circle', 'Info', 'Fill all required Inputs.');
 return
}

      // Google JSON Data to  API Request to Make
  
  if (isWebApp)  {
  
  // Make Google API Call

  updateSelectedProjectDataGAPI(selectedRowId, mainJSONData, isRunProjectRequired)
       
  
  } else {
        // Local JSON to PASS to LOCAL Server
        //Make Local Update API Request
  updateDatatoSEO(selectedRowId, jobid, blogsetID, mainJSONData, isRunProjectRequired, false)

    }
  } 
  
  // Create Project API Call
   else if (method.toUpperCase() === 'ADDDATA') {
    
 
        // Local JSON to PASS to LOCAL Server
   const isSynced=false  
  if (isWebApp) {
  
      // call Create Googel Sheet API is Local false for WEB APP
    createSelectedProjectDataGAPI(mainJSONData, isRunProjectRequired, isDuplicated, isSynced) 

    console.log("Passed from Add DashBoard Functions")
  

  }  else {
    // Create = json, run after create, duplicate false means add else true, false Is Sync from GAPI.

    createProjectsONSEO(mainJSONData, isRunProjectRequired, isDuplicated, isSynced)
}
  
  }
  }
  
// Function to add, update, or remove data from tableData based on ProjectID

function modifyTableData(action, newData, keyField) {
  if (action === 'add') {
    // Push the new data directly into tableData
    tableData.push(newData);
  } else if (action === 'update' && newData[keyField]) {
    // Find the index of the data to update based on the specified keyField
    const indexToUpdate = tableData.findIndex((item) => item[keyField] === newData[keyField]);

    if (indexToUpdate !== -1) {
      // Update the existing data with the new data
      tableData[indexToUpdate] = { ...tableData[indexToUpdate], ...newData };
    }
  } else if (action === 'remove' && newData[keyField]) {
    // Find the index of the data to remove based on the specified keyField
    const indexToRemove = tableData.findIndex((item) => item[keyField] === newData[keyField]);

    if (indexToRemove !== -1) {
      // Remove the data at the found index
      tableData.splice(indexToRemove, 1);
    }
  }
}


  //Function to show Aricle Creator Projects Api calls  both Local and Googler Server
  async function fetchArticleCreator() {
  
    popupCommonDialogHeader.innerText="Showing Article Creator Project(s) Data"
     // Show Animation
     showLoader();
  
     if (isWebApp) {
  // Make Google Server API Call
      fetchArticleCreatorGAPI() 
  
    }  else {
    //  Call Local Creator Data
       LocalCreatorProjects();
      
    }
  
  }
  
  
// Function to show PostUploader Projects Api calls  both Local and Googler Server
async function fetchPostUploader() {


  popupCommonDialogHeader.innerText="Showing Post Uploader Project(s) Data"
     // Show Animation
     showLoader();


     if (isWebApp) {  

      // Make Google API Call
      fetchPostUploaderGAPI()
  
    }  else {
  //  Local API Call
       LocalPostUploaderProjects();
      
    }

}
 
//Function to show Json File Api calls  both Local and Googler Server
async function ReadJsonFile() {

  popupCommonDialogHeader.innerText="Showing JSON Data"

  // Show Animation
  showLoader();

  if (isWebApp) {

    // Make Google API Call
    fetchJSONGAPI();


  } else {
    // Make LOCAL API Call
    LocalReadJsonFile();
    
  
  }
   
}

// Function to show Article Creator Projects
async function fetchArticleCreatorbyStatus(articleStatus) {

 popupCommonDialogHeader.innerText="Showing All Project(s) Data"
  // Show Animation
  showLoader();

  if (isWebApp) {
//  Make Google Api Call 
fetchProjectByStatusGAPI(articleStatus);
  }  

  else {
//  Make Local Api Call
    LocalProjectsbyStatus(articleStatus);
    
  }
}  

// Function to Populate Projects Input Fields from Data Web API
function populateProjectData(data) {

    cnsarticleCreatorTitle.textContent = `Article Creator Details of ID: ${data.ProjectID}`;
    ProjectIDInput.value = data.ProjectID;
    articleProjectNameInput.value = data.ProjectName;
    ProjectStatusinput.value = data.ProjectCreatorStatus;
    articleKeywordsFileInput.value = data.ProjectKeyowrds;
    articleCategoriesInput.value = data.ProjectCatagories;
    projectImageTypeSelect.value = data.ImageType;
   
    if (isWebApp) {

      DivImageStatus.style.display = 'flex';
      DivcreatedOn.style.display = 'flex';

      createdOn.value= data.createdOn;
      ImageStatusInput.value = data.ImageStatus
      
    } else {
      DivImageStatus.style.display = 'none';
      DivcreatedOn.style.display = 'none';
    }

    if (data.JobCronString) {
      projectCronString.value = data.JobCronString;
    } else {
      projectCronString.value = "0 0 * * 7";
    }

    cnspostUploaderTitle.textContent = `Post Uploader Details of ID: ${data.PostUploaderId}`;
  
    // Fill in the Post Uploader section
    PostUploaderIdInput.value = data.PostUploaderId;
    postJobNameInput.value = data.PostUploaderName;
    PostUploaderStatusInput.value = data.PostUploaderStatus;
  
    // Extract the date part and format it as "YY-MM-DD"
const currentDate = new Date(data.PostStartDate);

currentDate.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC

// Add one day to the date to account for time zone differences
currentDate.setDate(currentDate.getDate());

// Format the current date as "YY-MM-DD"
const formattedCurrentDate = currentDate.toISOString().split('T')[0];

  // Assign the formatted current date to the input value
  postDateInput.value = formattedCurrentDate;

    // cnsblogSettingTitle.textContent = `Blog Setting details of ID: ${data.BlogId}`;
  
    // Fill in the Blog Setting section
    BlogIdInput.value = data.BlogId;
    blogUserNameInput.value = data.username;
    blogPasswordInput.value = data.password;
    blogUrlInput.value = data.url;
    blogGroupInput.value = data.group;
    SEOStatusInput.value = data.SEOStatus;
  
    // dialogProjectsDialog.style.display = "flex";
    // dialogProjectsDialog.showModal();


}


// Define a function to handle the toggleBlogInfoCheckbox change event
function handleToggleEditPostNameChange() {
    if (toggleditPostNameCheckbox.checked) {
      // Checkbox is checked, enable the input for editing and focus on it
      postJobNameInput.removeAttribute('readonly');
      postJobNameInput.focus();
    } else {
      // Checkbox is not checked, disable the input
      postJobNameInput.setAttribute('readonly', 'readonly');
    }
  
}


// Define a function to handle the toggleBlogInfoCheckbox change event
function handleToggleBlogInfoChange() {

  if (toggleBlogInfoCheckbox.checked && toggleBlogInfoCheckbox) {
    // Checkbox is checked, show inputs for toggleBlogInfo

    secBlogUsername.style.display = 'flex';
    secBlogPassword.style.display = 'flex';
    secBloggroup.style.display = 'flex';


    // Checkbox is not checked, disable the input
    blogUserNameInput.setAttribute('required', 'required');
    blogPasswordInput.setAttribute('required', 'required');

    DivProjectBlogID.style.display = 'flex';

    btnAddNewdomainInfo.style.display = 'none';
    isUpdateDomainInfo= true;
    console.log("Update Required: " +isUpdateDomainInfo)

  } else {
    // Checkbox is not checked, hide inputs for toggleBlogInfo
    secBlogUsername.style.display = 'none';
    secBlogPassword.style.display = 'none';
    secBloggroup.style.display = 'none';

    blogUserNameInput.removeAttribute('required');
    blogPasswordInput.removeAttribute('required');

    isUpdateDomainInfo= false;
    console.log("Update Required: " +isUpdateDomainInfo)
    btnAddNewdomainInfo.style.display = 'none';
  }
}


// Define a function to handle the addNewBlogInfoCheckbox change event
function handleAddNewBlogInfoChange() {
  if (addNewBlogInfoCheckbox.checked && addNewBlogInfoCheckbox ) {
    // Checkbox is checked, show inputs for addNewBlogInfo
  
    // toggleBlogInfoCheckbox.checked = true;

    btnAddNewdomainInfo.style.display = 'flex';

    DivProjectBlogID.style.display = 'none';

    blogUrlInput.style.display = 'flex';

    blogUserNameInput.value = '';
    blogPasswordInput.value = '';
    blogGroupInput.value = '';


  } else {
    // Checkbox is not checked, hide inputs for addNewBlogInfo
   
    DivProjectBlogID.style.display = 'flex';

    blogUrlInput.style.display = 'flex';

    btnAddNewdomainInfo.style.display = 'none';

    toggleBlogInfoCheckbox.checked = false;
  }
}


function OpenAddDomainDialog() {

  showLoader()
  clearDialog(DialogdomainInfoAdd);
  DialogdomainInfoAdd.style.display = 'flex';
  DialogdomainInfoAdd.showModal();
 hideLoader();


 const blogUrlInput = document.getElementById('blogInfoUrl');

 blogUrlInput.addEventListener('change', UpdateblogUrlInput);

 function UpdateblogUrlInput () {

    const value = this.value;
    blogUrlInput.value = `https://${value}`;

 }


}

// Add New Post Uploder Project in Edit Dialog
async function EditDialogAddPostUploader() {
  // Call createJSONDomain function with the provided data
    showLoader()

    try {       
      // Step 2: Create Post Uploader and Get Post ID.
      const response2 = await fetch(`${seourl}/create/postuploader`);
      const data2 = await response2.json();
      newPostUploaderID = data2.result.id;
      console.log('New Post Uploader ID:', newPostUploaderID);

      PostUploaderId.value = newPostUploaderID;

      createToast('ProjectToastDiv', 'success', 'fa-solid fa-check', 'Success', 'New Post Uploader Created Succefully. ID: ' + newPostUploaderID);


      hideLoader()
  
    } catch (error) {

      createToast('ProjectToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'error', 'There is error while Creating New Post Uploader Project: ' + error);
       console.error('Error while creating Post Uploader Project:', error);
       hideLoader()
     }

  
  }


// Function to AddNewDomain in EditProject Dialog

async function EditDialogAddDomain() {
  // Call createJSONDomain function with the provided data
  
    try {

    showLoader()
    const bloJSONData = {
      username : blogUserNameInput.value,
      password : blogPasswordInput.value,
      url : blogUrlInput.value,
      group : blogGroupInput.value

    };
    const response3 = await createNewBlogID(bloJSONData)
    BlogIdInput.value = response3.blogID;

    hideLoader()

  createToast('ProjectToastDiv', 'success', 'fa-solid fa-check', 'Success', 'New BlogId Created Succefully. ID: ' + response3.blogID);

  }  catch(error) {

  hideLoader()

  createToast('ProjectToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'error', 'There is error while creating New Domain. error: '+error);
    return
  }
  }
 
// Call function create New Domain
async function callAddNewDomain(isSyncCall=false) {
// Call createJSONDomain function with the provided data

if (!isSyncCall) {

  const isValid = validateRequiredFields(DialogdomainInfoAdd);
if (isValid) {
showLoader()

  const blogInfoIdInput = document.getElementById('blogInfoId');
  const blogUserNameInput = document.getElementById('blogInfoUserName');
  const blogPasswordInput = document.getElementById('blogInfoPassword');
  const blogUrlInput = document.getElementById('blogInfoUrl');
  const blogGroupInput = document.getElementById('blogInfoGroup');


  const bloJSONData = {
    username : blogUserNameInput.value,
    password : blogPasswordInput.value,
    url : blogUrlInput.value,
    group : blogGroupInput.value

  };
  
    console.table(bloJSONData)
  
  const response3 = await createNewBlogID(bloJSONData)

  blogInfoIdInput.value = response3.blogID;

  blogUrlInput.value=bloJSONData.url;

  hideLoader()

  createToast('DialogdomainInfotDiv', 'success', 'fa-solid fa-check', 'Success', 'New BlogId Created Succefully. ID: ' + response3.blogID);


}   else{

  createToast('DialogdomainInfotDiv', 'warning', 'fa-solid fa-exclamation-triangle', 'Warning', 'Highlighted Input Value is missing or not Valid');

}
} else {

  const response3 = await createNewBlogID(bloJSONData)
  blogInfoIdInput.value = response3.blogID;

  if (GAPICommandsForSEOServer) {


  }

}
}


async function populateInputsFromUniqueData(uniqueData, method) {
  // Clear old Values

  
  // Populate the Dialog for adding Data
  if (method.toUpperCase() === "ADDDATA") {
   
        // Set Dialog Title      
  DialogTitle.textContent="Add New Project to SEO App"

  articleProjectNameInput.addEventListener('input', updateAddDataInputs);
    
  function updateAddDataInputs() {
    // const value = this.value.toLowerCase();
    const value = this.value;

    postJobNameInput.value = value + ' (U)';
    blogUrlInput.value = `https://${value}`;
    articleProjectNameInput.classList.add('transition');
    postJobNameInput.classList.add('transition');
    blogUrlInput.classList.add('transition');
  } 

    postJobNameInput.removeAttribute('readonly');

    PostUploaderId.removeAttribute('required');

    BlogId.removeAttribute('required');
    
    clearDialog(dialogProjectsDialog);
    // Show Only Add Project Button // Show Run Button

    projectCronString.value = "0 0 * * 7"

    addButton.style.display = "flex";
    addButton.querySelector('i').className = 'fas fa-plus'; 
    addButtonText.textContent = "Add";

        // Function to Add Project New Project
   
    showeditPostName.style.display = 'none';
    showcheckshowBlogInfo.style.display = 'none';
    showcheckAddBlogInfo.style.display = 'none';

           // Checkbox is not checked, disable the input
    blogUserNameInput.setAttribute('required', 'required');
    blogPasswordInput.setAttribute('required', 'required');

    addButton.onclick = function() {

    createProjects(false, false);


  };


  // Create and Run

  runButton.style.display = "flex";
  runButton.querySelector('i').className = 'fas fa-play';
  runButtonText.textContent = "Run";

  runButton.onclick = function() {

    createProjects(true, false);

  }

   
    // Hide Update and Duplicate Buttons
    updateButton.style.display = 'none';
    updateButton.querySelector('i').className = 'fas fa-pencil';

    duplicateButton.style.display = 'none';
    duplicateButton.querySelector('i').className = 'fas fa-clone';

// Get the current date
const currentDate = new Date();
currentDate.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC

// Add one day to the date to account for time zone differences
currentDate.setDate(currentDate.getDate());

// Format the current date as "YY-MM-DD"
const formattedCurrentDate = currentDate.toISOString().split('T')[0];

  // Assign the formatted current date to the input value
  postDateInput.value = formattedCurrentDate;

    cnsarticleCreatorTitle.textContent = "Add Article Creator Data here";
    cnspostUploaderTitle.textContent = "Add Post Uploader Data here";
    cnsblogSettingTitle.textContent = "Add JSON Data here";

    // Hide IDs of Creator, Poster Blod, and statuses as not required while adding Project
    DivProjectCreatorStatus.style.display = 'none';
    DivProjectCreatoID.style.display = 'none';

    DivProjectPosterStatus.style.display = 'none';
    

    // blogSettingSection.style.display = "none"

    DivProjectBlogID.style.display = "none"

    secBlogUsername.style.display = "flex";
    secBlogPassword.style.display = "flex";
    secBloggroup.style.display = "flex";

    btnAddNewdomainInfo.style.display = 'none';
    addNewPosterID.style.display = 'none';

    DivProjectPosterrID.style.display = 'none';

    DivcreatedOn.style.display = 'none';

    DivImageStatus.style.display = 'none';

    
    if (isWebApp) {

    }


  }
  // Populate the Dialog for getting existing Data
  else if (method.toUpperCase() === "GETDATA") {


    btnAddNewdomainInfo.style.display = 'flex';
    addNewPosterID.style.display = 'flex';

    postJobNameInput.setAttribute('required', 'required');

    PostUploaderId.setAttribute('required', 'required');
    BlogId.setAttribute('required', 'required');

    BlogId.setAttribute('readonly', 'readonly');

    // secBlogUsername.style.display = "none";
    // secBlogPassword.style.display = "none";
    // secBloggroup.style.display = "none";


    // Add Button will be Duplicate
    addButton.style.display = "flex";
    addButton.querySelector('i').className = 'fas fa-clone';
    addButtonText.textContent = "Duplicate";

    blogUserNameInput.removeAttribute('required');
    blogPasswordInput.removeAttribute('required');

    // Function to duplicate Project with Same Settings
    addButton.onclick = function() {

      createProjects(false, true);

  };

// Duplicate and Run
  duplicateButton.style.display = 'flex';
  duplicateButton.querySelector('i').className = 'fas fa-clone';
  duplicateButtonText.textContent = "Duplicate & Run";

         // Duplicate and Run
  duplicateButton.onclick = function() {

    createProjects(true, true);
  
  }


// Update Button will be Update only
    updateButton.style.display = 'flex';
    updateButtonText.textContent = "Update";
    updateButton.querySelector('i').className = 'fas fa-pencil';

    updateButton.onclick = function() {

   updateDataToApi(false);
  
  }


//Run Button will be Update & Run 
    runButton.style.display = "flex";
    runButton.querySelector('i').className = 'fas fa-play';
    runButtonText.textContent = "Update & Run";

    runButton.onclick = function() {

      updateDataToApi(true);

     }
    

    // Show IDs of Creator, Poster Blod, and statuses as required while getting existing Project
    DivProjectCreatoID.style.display = 'flex';
    DivProjectCreatorStatus.style.display = 'flex';
    DivProjectPosterrID.style.display = 'flex';

    DivProjectPosterStatus.style.display = 'flex';
    DivProjectBlogID.style.display = 'flex';
 
  // Hide Blog Section When Adding Project
DivProjectBlogID.style.display = "flex"

    // showcheckshowBlogInfo.style.display = 'flex';
    // showcheckAddBlogInfo.style.display = 'flex';
    // showeditPostName.style.display = 'flex';

    blogIdNo.style.display = "flex"

    // Hide SEO Status if not WebApp
    if (isWebApp) {
      DivcreatedOn.style.display = 'flex';
      DivImageStatus.style.display = 'flex';
      DivProjectSEOStatus.style.display = 'flex';
    } else {
      DivcreatedOn.style.display = 'none';
      DivImageStatus.style.display = 'none';
      DivProjectSEOStatus.style.display = 'none';
    }
 
  // Clear the existing options in the datalist for Project Names
  clearDatalist(projectNamesDatalist);

  // Sort the project names alphabetically
  const sortedProjectNames = uniqueData.ProjectNames.map((name) => name[0]).sort();

  // Populate the datalist with the sorted project names
  for (const projectName of sortedProjectNames) {
    const option = document.createElement("option");
    option.value = projectName;
    projectNamesDatalist.appendChild(option);
  }

  // Clear the existing options in the datalist Post Uploader Names
  clearDatalist(postJobNameDataList);

  // Sort the project Post Uploader names alphabetically
  const sortedPostJobNameDataList = uniqueData.PostUploaderIds.map((name) => name[1]).sort();

  // Populate the datalist with the sorted Post Uploader names
  for (const postJobName of sortedPostJobNameDataList) {
    const option = document.createElement("option");
    option.value = postJobName;
    postJobNameDataList.appendChild(option);
  }

  // Clear the existing options in the datalist Blog Ids
  clearDatalist(BlogurlDataList);

  // Sort the Blog Ids alphabetically
  const sortedBlogUrlsDataList = uniqueData.BlogIds.map((name) => name[1]).sort();

  // Populate the datalist with the sorted Blog Ids
  for (const blogurllst of sortedBlogUrlsDataList) {
    const option = document.createElement("option");
    option.value = blogurllst;
    BlogurlDataList.appendChild(option);
  }

  // Add event listeners
// Add event listeners to the checkboxes and use the defined functions as callbacks
toggleditPostNameCheckbox .addEventListener('change', handleToggleEditPostNameChange)
addNewBlogInfoCheckbox.addEventListener('change', handleAddNewBlogInfoChange);
toggleBlogInfoCheckbox.addEventListener('change', handleToggleBlogInfoChange);

articleProjectNameInput.addEventListener('input', updateAllInputs);

  postJobNameInput.addEventListener('input', updatePostUploaderInput);
  blogUrlInput.addEventListener('input', updateBlogUrlInput);

  // Function to update inputs based on selected project name
  function updateAllInputs() {
    // const value = this.value.toLowerCase();

    const value = this.value;

    // Reset all input fields initially
    // BlogIdInput.value = '';
    // PostUploaderIdInput.value = '';
    // postJobNameInput.value = value + ' (U)';
    // blogUrlInput.value = `https://${value}`;

    articleProjectNameInput.classList.add('transition');
    postJobNameInput.classList.add('transition');
    blogUrlInput.classList.add('transition');


    // Update Post Job Name Input
    const projectFound = uniqueData.ProjectNames.find(item => item[0].toLowerCase().includes(value));
    if (projectFound) {
      postJobNameInput.value = projectFound[0] + ' (U)';
      postJobNameInput.classList.add('transition');
    }

    // Update Blog ID Input and Blog URL Input
    const blogFound = uniqueData.BlogIds.find(item => item[1].toLowerCase().includes(value));
    if (blogFound) {
      BlogIdInput.value = blogFound[0];
      blogUrlInput.value = blogFound[1];
      blogUserNameInput.value = blogFound[2];
      blogPasswordInput.value = blogFound[3];
      blogGroupInput.value = blogFound[4];
      BlogIdInput.classList.add('transition');
      blogUrlInput.classList.add('transition');
    }

    // Update Post Uploader ID Input
    const uploaderFound = uniqueData.PostUploaderIds.find(item => item[1].toLowerCase().includes(value));
    if (uploaderFound) {
      PostUploaderIdInput.value = uploaderFound[0];
      PostUploaderIdInput.classList.add('transition');
    }



  }
  }

  // Function to update PostUploaderIdInput based on selected project name
  function updatePostUploaderInput() {
    const value = this.value.toLowerCase();

    // Reset PostUploaderIdInput initially
    PostUploaderIdInput.value = '';

    // Update PostUploaderIdInput
    const uploaderFound = uniqueData.PostUploaderIds.find(item => item[1].toLowerCase().includes(value));
    if (uploaderFound) {
      PostUploaderIdInput.value = uploaderFound[0];
      PostUploaderIdInput.classList.add('transition');
    }
  }

  // Function to update blogUrlInput based on selected Blog ID
  function updateBlogUrlInput() {
    const value = this.value.toLowerCase();

    // Reset blogUrlInput initially
    // blogUrlInput.value = `https://${value}`;

    // Update blogUrlInput
    const blogFound = uniqueData.BlogIds.find(item => item[1].toLowerCase().includes(value));
    if (blogFound) {
      blogUrlInput.classList.add('transition');
      BlogIdInput.value = blogFound[0];
      blogUserNameInput.value = blogFound[2];
      blogPasswordInput.value = blogFound[3];
      blogGroupInput.value = blogFound[4];
   
    }
  }

  articleProjectNameInput.addEventListener('blur', removeTransition);
  postJobNameInput.addEventListener('blur', removeTransition);
  blogUrlInput.addEventListener('blur', removeTransition);
  
  // Show the dialog after populating the data
  dialogProjectsDialog.style.display = "flex";
  dialogProjectsDialog.showModal();
  hideLoader();
}
 
// // Function to clear options from a datalist
function clearDatalist(datalist) {
  while (datalist.firstChild) {
    datalist.removeChild(datalist.firstChild);
  }
}

  // Function to remove the transition class after the transition ends  of Project Dialog
  function removeTransition(event) {
    if (event.propertyName !== 'background-color') return;
    articleProjectNameInput.classList.remove('transition');
    this.classList.remove('transition');
    
  }

// Function to Fetch User Data
async function fetchUsers() {

  apiCalltoMake = 'usersData';
  DataHeaders.innerText = "Showing Users(s) Data";

   // Show Animation
   showLoader();
  
   if (isWebApp) {
// Make Google Server API Call
 
fetchUsersGAPI() 

  }  else {

  //  Call Local  Data
createToast('bodyToastDiv', 'info', 'fa-solid fa-info-circle', 'Info', 'Local API for Users currently not Available.');   
// dashboardLink.classList.toggle('active');
hideLoader()

  }


}

//Function to call Delete functions with related IDs from Local Server and Google Server
  async function deleteProjectData(selectedRowId) {
    
  
   
    if (isWebApp) {

//  Function to Mark Project for Delete
    showLoader()
    // Set to true if user confirmation is required
    performAction(selectedRowId, "Delete", false);
  
   } else {

    showLoader()

    //  SelectedId, from Syncing, SheetId if Synced
    deleteProjectDatafromSEO(selectedRowId, false, false)

     

   }

  }
  
//Run Selected Project on Local Server or check its current status
async function runPorojectSEO(selectedRowId) {

  if (isWebApp) {

    //  Function to Mark Project for RUN
    showLoader()
    // Set to true if user confirmation is required
    performAction(selectedRowId, "Run", false);
 
    
 } else {
// Call Local function to run a project
runSelectedProjectSEO(selectedRowId,);

}

}
  
//Function to clear filled inputs of previous data.
function clearDialog(dialog) {
  const formElements = dialog.querySelectorAll('input, select, textarea');

  formElements.forEach((element) => {
    switch (element.type) {
      case 'checkbox':
        element.checked = false;
        break;
      case 'date':
        // Skip clearing date input and keep it as is
        break;
      case 'number':
        element.value = '1'; // Set to 1 for type "number"
        break;
      case 'text':
        element.value = ''; // Set to an empty string for type "text"
        break;
      // Add more cases for other input types if needed
    }
  });
}

// Function to validate required fields and return true if all are filled, false otherwise

function validateRequiredFields(dialog) {
  const formElements = dialog.querySelectorAll('[required]');
  let isValid = true;
  const emptyFieldIds = []; // Array to store the IDs of empty fields

  const showcheckAddBlogInfo = document.getElementById('showcheckAddBlogInfo');
  const addNewBlogInfoCheckbox = document.getElementById('addNewBlogInfoCheckbox');
  const blogUserNameInput = document.getElementById('blogUserName');
  const blogPasswordInput = document.getElementById('blogPassword');

  // Check if either of the checkboxes is not checked or not visible
  if ((!showcheckAddBlogInfo || !showcheckAddBlogInfo.checked) && (!addNewBlogInfoCheckbox || !addNewBlogInfoCheckbox.checked)) {
    if (blogUserNameInput) {
      blogUserNameInput.style.border = ''; // Clear the border style
      blogUserNameInput.style.fontWeight = ''; // Clear the font weight
    }
    
    if (blogPasswordInput) {
      blogPasswordInput.style.border = ''; // Clear the border style
      blogPasswordInput.style.fontWeight = ''; // Clear the font weight
    }
  }

  formElements.forEach((element) => {
    if (element.type === 'checkbox' && !element.checked) {
      isValid = false;
      element.style.border = '2px solid red';
      emptyFieldIds.push(element.id); // Add the ID to the emptyFieldIds array
    } else if (element.value.trim() === '') {
      isValid = false;
      element.style.border = '2px solid red';
      emptyFieldIds.push(element.id); // Add the ID to the emptyFieldIds array

    } else if (element.type === 'url' && element.value.trim() !== '') {
      const urlPattern = /^https:\/\/[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
      if (urlPattern.test(element.value)) { 
        element.style.border = '2px solid green';
        isValid = true;
      } else {
        element.style.border = '2px solid red';
        emptyFieldIds.push(element.id); // Add the ID to the emptyFieldIds array
        isValid = false;
    
      }
        
  
    } else {
      element.style.border = ''; // Clear the border style
      element.style.fontWeight = ''; // Clear the font weight
    }

  });

  if (!isValid) {

    console.log('Empty field IDs:', emptyFieldIds);

  }

  return isValid;
}




  // Show the dialogProjectsDialog
function openSettingDialog() {
   
    getandUpdateProjectSetting("GETDATA");
 
    }

//function to Pop project Settings
 
function fillCustomSettingDialogValues(data) {


  //  clear the Inputs before loading the dialog 
clearDialog(customSettingDialog);

  console.log("Fill Inputs : " + data)
  // Populate the input elements with the retrieved values
  // Populate the input elements for GOOGLE SERVER Data
  sheetIDInput.style.display = 'flex';
  seoStatusInput.style.display = 'flex';


  // Get the current date
const currentDate = new Date();
currentDate.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC

// Add one day to the date to account for time zone differences
currentDate.setDate(currentDate.getDate());

// Format the current date as "YY-MM-DD"
const formattedCurrentDate = currentDate.toISOString().split('T')[0];

  sheetIDInput.value = data.SheetID;
  listofContentFilterInput.value = data.ListofContentFilter;
  urlsDownloadResultLimitsInput.value = data.URLsDownloadResultLimits;
  articleCountInput.value = data.ArticleCount;
  insertNoofImagesFROMInput.value = data.InsertNoofImagesFROM;
  insertNoofImagesTOInput.value = data.InsertNoofImagesTO;
  jobcronStringinput.value = data.jobcronString
  articleUseCategoryInsertInput.checked = data.articleUseCategoryInsert;
  useImagesInput.checked = data.UseImages;
  imageInserTypeInput.value = data.InsertType;
  InsertAtStartOfBodyInput.checked = data.InsertAtStartOfBody;
  useBingImagesInput.checked = data.UseBingImages;
  useYoutubeThumbnailsInput.checked = data.UseYoutubeThumbnails;
  useCreativeCommonsImagesInput.checked = data.UseCreativeCommonsImages;
  useBingCCImagesInput.checked = data.UseBingCCImages;
  posttodayDateInput.value =  formattedCurrentDate;
  postUseTodayInput.checked = data.postUseToday;
  postsperDayInput.value = data.PostsperDay;
  postIntervaldaysFROMInput.value = data.PostIntervaldaysFROM;
  postIntervaldaysTOInput.value = data.PostIntervaldaysTO;
  postarticleTitleInput.value = data.postarticleTitle;
  seoStatusInput.value = data.SEOStatus

  btnupdateSettingbtn.style.display='flex';
  customSettingDialog.style.display = 'flex';
  customSettingDialog.showModal();
  hideLoader();

  createToast( 'SettingsToastDiv', 'success', 'fa-solid fa-check', 'Success', 'Custom Settings has been Loaded');

  
 }

// Update setting from Dialog
  async function UpdateCustomSettig() {

   getandUpdateProjectSetting("UPDATEDATA"); 
  
  }

// Function to populate the dialog with retrieved settings data
async function getandUpdateProjectSetting(METHOD) {

  showLoader();

  let settingJSONData;

    settingJSONData = {
      "SheetID":sheetIDInput.value,
      "ListofContentFilter": listofContentFilterInput.value,
      "URLsDownloadResultLimits": parseInt(urlsDownloadResultLimitsInput.value),
      "ArticleCount": parseInt(articleCountInput.value),
      "InsertNoofImagesFROM":  parseInt(insertNoofImagesFROMInput.value),
      "InsertNoofImagesTO": parseInt(insertNoofImagesTOInput.value),
      "jobcronString" : jobcronStringinput.value,
      "articleUseCategoryInsert":articleUseCategoryInsertInput.checked,
      "UseImages": useImagesInput.checked,
      "InsertType": imageInserTypeInput.value,
      "InsertAtStartOfBody": InsertAtStartOfBodyInput.checked,
      "UseBingImages":  useBingImagesInput.checked,
      "UseYoutubeThumbnails": useYoutubeThumbnailsInput.checked,
      "UseCreativeCommonsImages": useCreativeCommonsImagesInput.checked,
      "UseBingCCImages": useBingCCImagesInput.checked,
      "postUseToday": postUseTodayInput.checked,
      "PostsperDay": parseInt(postsperDayInput.value),
      "PostIntervaldaysFROM": parseInt(postIntervaldaysFROMInput.value),
      "PostIntervaldaysTO": parseInt(postIntervaldaysTOInput.value),
      "postarticleTitle": postarticleTitleInput.value,
      "SEOStatus": "complete"

    }


  if (METHOD==="GETDATA") {
   
 
if (isWebApp) {
// Call Google Server Settingss
    getProjectSettingGAPI();
 
    } else {

  //Call Local Server Setting Data
      getProjectSettingsLocal()

    }

}

    // metod to Update Data.
if (METHOD==="UPDATEDATA") {

    if (isWebApp) {

      //Call Google Update API (false for WebApp)
      UpdateProjectSettingGAPI(settingJSONData)


    } else {
      
      updateProjectSettingsLocal(settingJSONData, false)
            
      }

  }
    
}
    


// Function to populate User Dialog with Data
function fillUserDataDialog(data) {
  // Populate the input elements with the retrieved values
  //  clear the Inputs before loading the dialog 
clearDialog(dialoguserDialog);

  usersheetIDInput.value = data.SheetID;
  userFullInputInput.value = data.FullName;
  usernameInputInput.value = data.userName;
  userpasswordInput.value = data.Password || "";
  usertimeCountInput.value = data.TimeOutMinute;
  userTypeInput.value = data.UserType;
  userseoStatusinput.value = data.SEOStatus;

  UserDialogsheetID.style.display = 'flex';
  UserDialogSeoStatus.style.display = 'flex';

  dialoguserDialog.style.display="flex";
  dialoguserDialog.showModal();
} 
 

// Function to populate selected User Data from API Call
async function getandAddUsers(METHOD, selectedUserId) {
showLoader()
  const jsonData = {
    FullName:  userFullInputInput.value,
    userName: usernameInputInput.value,
    Password:  userpasswordInput.value,
    UserType: userTypeInput.value,
    TimeOutMinute: parseInt(usertimeCountInput.value),
   
  }

  console.table(jsonData)

  if (METHOD==="GETUSERDATA") {

// Call Google Server Settingss
if (isWebApp) {

  fetchSelectedUsersGAPI(selectedUserId);
 
  } else {

        //  Call Local  Data
      createToast('ProjectToastDiv', 'info', 'fa-solid fa-info-circle', 'Info', 'Local API for Users currently not Available.');   
      // dashboardLink.classList.toggle('active');
      hideLoader()
    }

  }

  if (METHOD==="ADDUSERDATA") {

    // Call Add User Google Server 
      if (isWebApp) {

        // Local Call False 
        addUsersDataGAPI(jsonData, false);
      
        } else {

              //  Call Local  Data
            createToast('bodyToastDiv', 'info', 'fa-solid fa-info-circle', 'Info', 'Local API for Users currently not Available.');   
            // dashboardLink.classList.toggle('active');
            hideLoader()
          }

  }

  if (METHOD==="UPDATEUSERDATA") {

      // Call Add User Google Server 
      if (isWebApp) {

        // Local Call False 
        updateSelectedUsersDataGAPI(selectedUserId, jsonData, false);
      
        } else {

              //  Call Local  Data
            createToast('UserToastDiv', 'info', 'fa-solid fa-info-circle', 'Info', 'Local API for Users currently not Available.');   
            // dashboardLink.classList.toggle('active');
            hideLoader()
          }

  }

    //Delete Data
  if (METHOD==="DELETEUSERDATA") {
        
       // Call Add User Google Server 
       if (isWebApp) {

        // Local Call False 
        deleteSelectedUsersDataGAPI(selectedUserId, false)

        } else {

              //  Call Local  Data
            createToast('UserToastDiv', 'info', 'fa-solid fa-info-circle', 'Info', 'Local API for Users currently not Available.');   
            // dashboardLink.classList.toggle('active');
            hideLoader()
          }  
  }

}

// Function to close the dialog
function closeDialog(dialogname) {
  defaultLoaderId = 'loadingOverlay';
  const fileDialog = document.getElementById(dialogname);
  fileDialog.style.display="none";
  fileDialog.close();
  
  hideLoader();
// Event listeners
}


