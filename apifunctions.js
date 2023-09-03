//count Total Records
let totalRecords = 0
// Store the selected row ID
let selectedRowId = null;
let selectedRowIndex =null;
let jobid =null;
let blogsetID=null;
let folderpath=null;
let sectiontoshow = null;
let apiCalltoMake = null;
let titleID = null;
let confirmDialogUse = false;


let notifications = document.querySelector('.notifications');

function createToast(type, icon, title, text){
    let newToast = document.createElement('div');
    newToast.innerHTML = `
        <div class="toast ${type}">
                <i class="${icon}"></i>
                <div class="content">
                    <div class="title">${title}</div>
                    <span>${text}</span>
                </div>
                <i class="close fa-solid fa-xmark"
                onclick="(this.parentElement).remove()"
                ></i>
            </div>`;

    notifications.appendChild(newToast);
    newToast.timeOut = setTimeout(() => newToast.remove(), 5000)
}


//Main DashBoard Function to Create Dashboard.
async function fetchAPI() {
  sectiontoshow='AllDatatoshow'
  apiCalltoMake = 'ProjectsData';
  DataHeaders.innerText="Showing All Project(s) Data"

    // Show Animation
    showLoader();
  
    try {
      const response = await fetch(seourl, {
        method: 'POST',
        body: JSON.stringify({ action: 'getProjects', username: LoggedUsername }), // Include the action
      });

        const responseData = await response.json();
            // Task 6: Generate the table based on the final formattedData object
            createTableFromData(responseData);
            console.table(responseData);

  
    } catch (error) {
      console.error('Error fetching projects data:', error);
      let type = 'error';
      let icon = 'fa-solid fa-circle-exclamation';
      let title = 'Error';
      let text = 'An error occurred while fetching projects.' + error;
      createToast(type, icon, title, text);
      hideLoader();
    }
  }

  //Function to show Aricle Creator Projects
  async function fetchArticleCreator() {
    sectiontoshow = 'articleCreator'
    apiCalltoMake = 'ProjectsData';
    DataHeaders.innerText="Showing Article Creator Project(s) Data"
     // Show Animation
     showLoader();
  
     try {

      const response = await fetch(seourl, {
        method: 'POST',
        body: JSON.stringify({ action: 'getCreatorProjects', username: LoggedUsername }), // Include the action
      });

         const responseData = await response.json();
             // Task 6: Generate the table based on the final formattedData object
             createTableFromData(responseData);
             console.table(responseData);
 
   
     } catch (error) {
       console.error('Error fetching projects data:', error);
       let type = 'error';
       let icon = 'fa-solid fa-circle-exclamation';
       let title = 'Error';
       let text = 'An error occurred while fetching projects.';
       createToast(type, icon, title, text);
       hideLoader();
     }
  
  }

  //Function to show Aricle Creator Projects
  async function fetchUsers() {
    
    apiCalltoMake = 'usersData';
    DataHeaders.innerText="Showing Users(s) Data"

     // Show Animation
     showLoader();
  
     try {

      const response = await fetch(seourl, {
        method: 'POST',
        body: JSON.stringify({ action: 'getUsers', username: LoggedUsername }), // Include the action
      });

         const responseData = await response.json();
             // Task 6: Generate the table based on the final formattedData object
             createTableFromData(responseData);
             console.table(responseData);
 
     } catch (error) {
       console.error('Error fetching projects data:', error);
       let type = 'error';
       let icon = 'fa-solid fa-circle-exclamation';
       let title = 'Error';
       let text = 'An error occurred while fetching projects.';
       createToast(type, icon, title, text);
       hideLoader();
     }
  
  }

// Function to show PostUploader Projects
async function fetchPostUploader() {

  sectiontoshow = 'postuploader'
  apiCalltoMake = 'ProjectsData';
  DataHeaders.innerText="Showing Post Uploader Project(s) Data"
     // Show Animation
     showLoader();
  
     try {
       const response = await fetch(seourl, {
        method: 'POST',
        body: JSON.stringify({ action: 'getPostProjects', username: LoggedUsername }), // Include the action
      });
         const responseData = await response.json();
             // Task 6: Generate the table based on the final formattedData object
             createTableFromData(responseData);
             console.table(responseData);
 
   
     } catch (error) {
       console.error('Error fetching projects data:', error);
       let type = 'error';
       let icon = 'fa-solid fa-circle-exclamation';
       let title = 'Error';
       let text = 'An error occurred while fetching projects.';
       createToast(type, icon, title, text);
       hideLoader();
     }

}

//Function to show Json File
async function ReadJsonFile() {

  sectiontoshow = 'jsondata'
  apiCalltoMake = 'ProjectsData';

  DataHeaders.innerText="Showing JSON Data"

  // Show Animation
  showLoader();
   // Show Animation
   showLoader();
  
   try {
    const response = await fetch(seourl, {
      method: 'POST',
      body: JSON.stringify({ action: 'getJSON', username: LoggedUsername }), // Include the action
    });
       const responseData = await response.json();
           // Task 6: Generate the table based on the final formattedData object
           createTableFromData(responseData);
           console.table(responseData);

 
   } catch (error) {
     console.error('Error fetching projects data:', error);
     let type = 'error';
     let icon = 'fa-solid fa-circle-exclamation';
     let title = 'Error';
     let text = 'An error occurred while fetching projects.';
     createToast(type, icon, title, text);
     hideLoader();
   }
}

// Function to show Article Creator Projects
async function fetchArticleCreatorbyStatus(articleStatus) {
 sectiontoshow='AllDatatoshow'
 apiCalltoMake = 'ProjectsData';
 DataHeaders.innerText="Showing All Project(s) Data"
  // Show Animation
  showLoader();

  try {
  // Task 1: Fetch all projects and store the required keys in an object
  const response = await fetch(seourl, {
    method: 'POST',
    body: JSON.stringify({ action: 'getStatus', status: articleStatus, username: LoggedUsername }), // Include the action
  });
    const formattedData = await response.json();

      // Task 6: Generate the table based on the final filteredProjects object
      if (Object.keys(formattedData).length > 0) {
        updateStatusCounts();
        createTableFromData(Object.values(formattedData));
        // console.table(Object.values(formattedData));
      } else {
        console.log(`No projects found for the specified articleStatus "${articleStatus}".`);
        // Call createToast function for notifying the user
        let type = 'warning';
        let icon = 'fa-solid fa-triangle-exclamation';
        let title = 'Warning';
        let text = `No projects found for the specified article status "${articleStatus}".`;
        createToast(type, icon, title, text);
      }
    }
    catch(error) {
      console.error(error);
      // Call createToast function after error
      let type = 'error';
      let icon = 'fa-solid fa-circle-exclamation';
      let title = 'Error';
      let text = 'An error occurred while fetching projects.';
      createToast(type, icon, title, text);
    }
}  

async function updateStatusCounts() {
  try {
    const response = await fetch(seourl, {
      method: 'POST',
      body: JSON.stringify({ action: 'getProjectCounts', username: LoggedUsername }), // Include the action
    });

    const data = await response.json();
    console.table(data)
    updateDashboardCounts(data); // Assuming `statusCounts` is available in the scope where this function is called.
  } catch (error) {
    let type = 'error';
      let icon = 'fa-solid fa-circle-exclamation';
      let title = 'Error';
      let text = 'Error fetching ID count' + error;
      createToast(type, icon, title, text);
    console.error('Error fetching ID count:', error);

  }
}

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

//custom Right Click Menu
function enableCustomContextMenu(tableSelector, menuSelector) {
  const contextMenu = document.querySelector(menuSelector);
  contextMenu.style.display="flex";
  const table = document.querySelector(tableSelector);

  table.addEventListener("contextmenu", e => {
    const target = e.target;

    if (target.tagName === "TD") {
      e.preventDefault();

      const row = target.parentNode;
      const firstCell = row.querySelector("td:first-child"); // Get the first cell of the row
      selectedRowId = firstCell.textContent.trim();

      selectedRowIndex = row.rowIndex;

      console.log("First TD Text:", selectedRowId);
      console.log("Row Index Number:", selectedRowIndex );

      const mousePosX = e.pageX;
      const mousePosY = e.pageY;
      const menuWidth = contextMenu.offsetWidth;
      const menuHeight = contextMenu.offsetHeight;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const maxMenuPosX = windowWidth - menuWidth;
      const maxMenuPosY = windowHeight - menuHeight;

      const menuPosX = Math.min(mousePosX, maxMenuPosX);
      const menuPosY = Math.min(mousePosY, maxMenuPosY);

      contextMenu.style.left = `${menuPosX}px`;
      contextMenu.style.top = `${menuPosY}px`;
      customMenu.style.display = 'block';
      contextMenu.style.visibility = "visible";
     
    } else {
      customMenu.style.display = 'none';
      contextMenu.style.visibility = "hidden";
    }
  });

  document.addEventListener("click", () => {
    customMenu.style.display = 'none';
    contextMenu.style.visibility = "hidden";
  });
}


function updateMenuItems(apiCall) {
  const editItem = document.getElementById('customEditData');
  const deleteItem = document.getElementById('customDeleteData');
  const addItem = document.getElementById('customAddData');
 
  
  
  // Update menu item text and onclick event based on the API call
  switch (apiCall) {
    case 'usersData':



      editItem.querySelector('span').textContent = 'Edit User Data';
      deleteItem.querySelector('span').textContent = 'Delete User Data';
      addItem.querySelector('span').textContent = 'Add User Data';

     editItem.querySelector('i').className = 'far fa-user-edit';
     addItem.querySelector('i').className = 'fas fa-user-plus';
     deleteItem.querySelector('i').className = 'far fa-user-minus';

      editItem.onclick = updateSelectedUserData;
      deleteItem.onclick = deleteSelectedUserData;
      addItem.onclick = showAddUserDialog;
      // Update other items as needed
      break;

    case 'ProjectsData':
      editItem.querySelector('span').textContent = 'Edit Project Data';
      deleteItem.querySelector('span').textContent = 'Delete Project Data';
      addItem.querySelector('span').textContent = 'Add Project Data';

      editItem.querySelector('i').className = 'far fa-edit';
      addItem.querySelector('i').className = 'fas fa-plus';
      deleteItem.querySelector('i').className = 'fas fa-trash-alt';


      editItem.onclick = fetchAndPopulateDialog;
      deleteItem.onclick = deleteUsingAPI;
      addItem.onclick = createnewJobID;
      // Update other items as needed
      break;

    // Add cases for other API calls

    default:
      // Default case if apiCall doesn't match any known API calls
      break;
  }
}


//  Function to remove trailing "..." from a status
const removeTrailingDots = (status) => {
  return status.replace(/\.\.\.$/, '');
};

async function testConfrin() { 

const confirmDialogUse = await openConfrimDialog('confrimDialog', 'Confirm Re-Run the Project?', 'Do you want to Re-Run the Completed Project again?');

if (confirmDialogUse) { 

}
}

// Function to open the dialog
function openDialog() {
  openConfrimDialog('confrimDialog','Confirm Re-Run the Project?','Do you want to Re-Run the Completed Project again?')
     
}

function openConfrimDialog(dialogId, titleHeader, confirmMessage) {
  return new Promise((resolve, reject) => {
    const confrimdialog = document.getElementById(dialogId);
    const dialogTitleelement = document.getElementById('dialogHeader');
    const confirmMessageelement = document.getElementById('confirmMessage');  
    // const confirmIcon = document.getElementById('confirmIcon').className=`fas fa${confirmIconClass}`;

    dialogTitleelement.textContent = titleHeader;
    confirmMessageelement.textContent = confirmMessage;
    // confirmIcon.className = `fas ${confirmIconClass}`;
    
    // Event listener for the confirm button
    document.getElementById('confirmButton').addEventListener('click', function() {
      resolve(true); // Resolve the promise with true when confirm button is clicked
      closeDialog(dialogId);
    });

    // Event listener for the cancel button
    document.getElementById('cancelButton').addEventListener('click', function() {
      resolve(false); // Resolve the promise with false when cancel button is clicked
      closeDialog(dialogId);
    });

    confrimdialog.showModal();
  });
}

const customSelect = document.getElementById('table-filter');
const selectedOption = customSelect.querySelector('.selected-option');
const optionsContainer = customSelect.querySelector('.options');
const options = customSelect.querySelectorAll('.option');

customSelect.addEventListener('mouseenter', () => {
  optionsContainer.style.display = 'block';
});

customSelect.addEventListener('mouseleave', () => {
  optionsContainer.style.display = 'none';
});

options.forEach(option => {
  option.addEventListener('click', () => {
    selectedOption.textContent = option.textContent;
    optionsContainer.style.display = 'none';
  });
});
