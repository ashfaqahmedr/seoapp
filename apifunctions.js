
// let sectiontoshow ='AllDatatoshow'

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
    sectiontoshow = 'userData'
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
    updateDashboardCounts(data); // Assuming `statusCounts` is available in the scope where this function is called.
  } catch (error) {
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
  const table = document.querySelector(tableSelector);

  table.addEventListener("contextmenu", e => {
    const target = e.target;
    // if (target.tagName === "TD" && target.cellIndex === 0) {
    if (target.tagName === "TD") {
      
      e.preventDefault();

      const row = target.parentNode;
      selectedRowId = target.textContent.trim();

       // Get the row index number
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
      contextMenu.style.visibility = "visible";
    } else {
      contextMenu.style.visibility = "hidden";
    }
  });

  document.addEventListener("click", () => {
    contextMenu.style.visibility = "hidden";
  });

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
