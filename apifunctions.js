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
let MakeGoogleAPICAll=true;

const googleurl ='https://script.google.com/macros/s/AKfycbxgyT3rHw0zc7xeF_HWP3fxiy9VjaBcwzE18b6eA7HzFejEvCQEJewrJSzDFkeaUa4m/exec'
const seourl ='http://localhost:8008'
const seoProjectsUrl = `${seourl}/project`

const appurl ='http://localhost:3000'


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


async function fetchAPI() {
  sectiontoshow = 'AllDatatoshow';
  apiCalltoMake = 'ProjectsData';
  DataHeaders.innerText = "Showing All Project(s) Data";

  // Show Animation
  showLoader();


  if (MakeGoogleAPICAll) {
   const responsePromise = fetch(googleurl, {
      method: 'POST',
      body: JSON.stringify({ action: 'getAllProjects', username: LoggedUsername }), // Include the action      
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        hideLoader();
        reject(new Error(createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error)));
      }, 30000);
    });

    try {
      const response = await Promise.race([responsePromise, timeoutPromise]);
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
  } else {
    try {
      const getAllData = await fetchAllLocalProjects();
      // Generate the table based on the final formattedData object
      createTableFromData(getAllData);
      console.table(getAllData);
    } catch (error) {
      console.error('Error fetching local projects data:', error);
      let type = 'error';
      let icon = 'fa-solid fa-circle-exclamation';
      let title = 'Error';
      let text = 'An error occurred while fetching local projects.' + error;
      createToast(type, icon, title, text);
    } finally {
      // Hide the loader when all tasks are done
      hideLoader();
    }
  }
}


  //Function to show Aricle Creator Projects
  async function fetchArticleCreator() {
    sectiontoshow = 'articleCreator'
    apiCalltoMake = 'ProjectsData';
    DataHeaders.innerText="Showing Article Creator Project(s) Data"
     // Show Animation
     showLoader();

     if (MakeGoogleAPICAll) {

     const responsePromise = fetch(googleurl, {
      method: 'POST',
      body: JSON.stringify({ action: 'getCreatorProjects', username: LoggedUsername }), // Include the action
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        hideLoader();
        reject(new Error(createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error)));
      }, 30000);
    });
  
    try {
      const response = await Promise.race([responsePromise, timeoutPromise]);   

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
  
    }  else {
      try {
        const getAllData = await LocalCreatorProjects();
        // Generate the table based on the final formattedData object
        createTableFromData(getAllData);
        console.table(getAllData);
      } catch (error) {
        console.error('Error fetching local projects data:', error);
        let type = 'error';
        let icon = 'fa-solid fa-circle-exclamation';
        let title = 'Error';
        let text = 'An error occurred while fetching local projects.' + error;
        createToast(type, icon, title, text);
      } finally {
        // Hide the loader when all tasks are done
        hideLoader();
      }
    }

  }

  //Function to show Aricle Creator Projects
  async function fetchUsers() {
    
    apiCalltoMake = 'usersData';
    DataHeaders.innerText="Showing Users(s) Data"

     // Show Animation
     showLoader();

     const responsePromise = fetch(googleurl, {
      method: 'POST',
      body: JSON.stringify({ action: 'getUsers', username: LoggedUsername }), // Include the action
  });

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      hideLoader();
      reject(new Error(createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error)));
    }, 30000);
  });

  try {
    const response = await Promise.race([responsePromise, timeoutPromise]);

      

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


     if (MakeGoogleAPICAll) {  
    const responsePromise = fetch(googleurl, {
      method: 'POST',
      body: JSON.stringify({ action: 'getPostProjects', username: LoggedUsername }), // Include the action
    });


  
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        hideLoader();
        reject(new Error(createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error)));
      }, 30000);
    });
  
    try {
      const response = await Promise.race([responsePromise, timeoutPromise]);

      
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

    }  else {
      try {
        const getAllData = await LocalPostUploaderProjects();
        // Generate the table based on the final formattedData object
        createTableFromData(getAllData);
        console.table(getAllData);
      } catch (error) {
        console.error('Error fetching local projects data:', error);
        let type = 'error';
        let icon = 'fa-solid fa-circle-exclamation';
        let title = 'Error';
        let text = 'An error occurred while fetching local projects.' + error;
        createToast(type, icon, title, text);
      } finally {
        // Hide the loader when all tasks are done
        hideLoader();
      }
    }

}

//Function to show Json File
async function ReadJsonFile() {

  sectiontoshow = 'jsondata'
  apiCalltoMake = 'ProjectsData';

  DataHeaders.innerText="Showing JSON Data"

  // Show Animation
  showLoader();

  if (MakeGoogleAPICAll) {

    const responsePromise = fetch(googleurl, {
      method: 'POST',
      body: JSON.stringify({ action: 'getJSON', username: LoggedUsername }), // Include the action
    });
  
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        hideLoader();
        reject(new Error(createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error)));
      }, 30000);
    });
  
    try {
      const response = await Promise.race([responsePromise, timeoutPromise]);

      
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

  } else {
    try {
      const getAllData = await LocalReadJsonFile();
      // Generate the table based on the final formattedData object
      createTableFromData(getAllData);
      console.table(getAllData);
    } catch (error) {
      console.error('Error fetching local projects data:', error);
      let type = 'error';
      let icon = 'fa-solid fa-circle-exclamation';
      let title = 'Error';
      let text = 'An error occurred while fetching local projects.' + error;
      createToast(type, icon, title, text);
    } finally {
      // Hide the loader when all tasks are done
      hideLoader();
    }
  }
   
}

// Function to show Article Creator Projects
async function fetchArticleCreatorbyStatus(articleStatus) {
 sectiontoshow='AllDatatoshow'
 apiCalltoMake = 'ProjectsData';
 DataHeaders.innerText="Showing All Project(s) Data"
  // Show Animation
  showLoader();

  if (MakeGoogleAPICAll) {
  const responsePromise = fetch(googleurl, {
    method: 'POST',
    body: JSON.stringify({ action: 'getStatus', status: articleStatus, username: LoggedUsername }), // Include the action
  });

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      hideLoader();
      reject(new Error(createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error)));
    }, 30000);
  });
  try {
    const response = await Promise.race([responsePromise, timeoutPromise]);


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

  else {
    try {
      const getAllData = await LocalProjectsbyStatus(articleStatus);
      // Generate the table based on the final formattedData object
      createTableFromData(getAllData);
      console.table(getAllData);
    } catch (error) {
      console.error('Error fetching local projects data:', error);
      let type = 'error';
      let icon = 'fa-solid fa-circle-exclamation';
      let title = 'Error';
      let text = 'An error occurred while fetching local projects.' + error;
      createToast(type, icon, title, text);
    } finally {
      // Hide the loader when all tasks are done
      hideLoader();
    }
  }
}  


//Get Project Counts
async function updateStatusCounts() {

  if (MakeGoogleAPICAll) {
    const responsePromise = fetch(googleurl, {
      method: 'POST',
      body: JSON.stringify({ action: 'getProjectCounts', username: LoggedUsername }), // Include the action
    });
  
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        hideLoader();
        reject(new Error(createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error)));
      }, 30000);
    });
  
    try {
      const response = await Promise.race([responsePromise, timeoutPromise]);

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
}  else {
  try {
    const getAllData = await LocalGetProjectCounts();
    // Generate the table based on the final formattedData object
    updateDashboardCounts(getAllData);
    console.table(getAllData);
  } catch (error) {
    console.error('Error fetching local projects data:', error);
    let type = 'error';
    let icon = 'fa-solid fa-circle-exclamation';
    let title = 'Error';
    let text = 'An error occurred while fetching local projects.' + error;
    createToast(type, icon, title, text);
  } finally {
    // Hide the loader when all tasks are done
    hideLoader();
  }
}

}


