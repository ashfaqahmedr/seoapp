
// let sectiontoshow ='AllDatatoshow'


let success = document.getElementById('success');
let error = document.getElementById('error');
let warning = document.getElementById('warning');
let info = document.getElementById('info');
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
// success.onclick = function(){
//     let type = 'success';
//     let icon = 'fa-solid fa-circle-check';
//     let title = 'Success';
//     let text = 'This is a success toast.';
//     createToast(type, icon, title, text);
// }
// error.onclick = function(){
//     let type = 'error';
//     let icon = 'fa-solid fa-circle-exclamation';
//     let title = 'Error';
//     let text = 'This is a error toast.';
//     createToast(type, icon, title, text);
// }
// warning.onclick = function(){
//     let type = 'warning';
//     let icon = 'fa-solid fa-triangle-exclamation';
//     let title = 'Warning';
//     let text = 'This is a warning toast.';
//     createToast(type, icon, title, text);
// }
// info.onclick = function(){
//     let type = 'info';
//     let icon = 'fa-solid fa-circle-info';
//     let title = 'Info';
//     let text = 'This is a info toast.';
//     createToast(type, icon, title, text);
// }


//Main DashBoard Function to Create Dashboard.
async function fetchAPI() {
  sectiontoshow='AllDatatoshow'
    // Show Animation
    showLoader();
  
    try {
      const response = await fetch(`${seourl}?action=getData&sheetName=Projects`);
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
  async function fetchArticleCreator() {
    sectiontoshow = 'articleCreator'
     // Show Animation
     showLoader();
  
     try {
       const response = await fetch(`${seourl}?action=getCreatorProjects&sheetName=Projects`);
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
       const response = await fetch(`${seourl}?action=getPostProjects&sheetName=Projects`);
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
     const response = await fetch(`${seourl}?action=getJSON&sheetName=Projects`);
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

  // Task 1: Fetch all projects and store the required keys in an object
  fetch(`${seourl}/all-projects?status=${articleStatus}`)
    .then((response) => response.json())
    .then(async (data) => {
      const formattedData = {};

      // Extract the required keys from each project
      data.result.forEach((project) => {
        const { id, name, type, status } = project;
        formattedData[id] = { 
          projectID: id,
          projectName: name,
          projectType: type,
          projectStatus: status
        };
      });

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
    })
    .catch((error) => {
      console.error(error);
      // Call createToast function after error
      let type = 'error';
      let icon = 'fa-solid fa-circle-exclamation';
      let title = 'Error';
      let text = 'An error occurred while fetching projects.';
      createToast(type, icon, title, text);
    })
    .finally(() => {
      hideLoader();
    });
}


const statusCounts = {
  allprojects: 0,
  creator: 0,
  poster: 0,
  jsoncount: 0,
  draft: 0,
  waiting: 0,
  failed: 0,
  aborted: 0,
  complete: 0,
  running: 0,
  aborting: 0,
};

const statusUrls = {
  allprojects: `${seourl}/all-projects`,
  creator: `${seourl}/all-projects?type=article%20creator`,
  poster: `${seourl}/all-projects?type=post%20uploader`,
  draft: `${seourl}/all-projects?status=draft`,
  waiting: `${seourl}/all-projects?status=waiting`,
  failed: `${seourl}/all-projects?status=failed`,
  aborted: `${seourl}/all-projects?status=aborted`,
  complete: `${seourl}/all-projects?status=complete`,
  running: `${seourl}/all-projects?status=running`,
  aborting: `${seourl}/all-projects?status=aborting...`,
};


function updateStatusCounts() {

  const promises = [];

  for (const status in statusUrls) {
    const url = statusUrls[status];
    const promise = fetch(url)
      .then((response) => response.json())
      .then((data) => {
        statusCounts[status] = data.result.length;
        updateDashboardCounts();
      })
      .catch((error) => {
        console.error(`Error fetching ${status} projects:`, error);
      });

    promises.push(promise);
  }

  // Separate API call to count IDs
  const idCountPromise = fetch(`${appurl}/data`)
    .then((response) => response.json())
    .then((data) => {
      statusCounts.jsoncount = data.length;
      updateDashboardCounts();
    })
    .catch((error) => {
      console.error('Error fetching ID count:', error);
    });

  promises.push(idCountPromise);

  Promise.all(promises)
    .then(() => {
      console.log('All API calls completed.');
    })
    .catch((error) => {
      console.error('Error in API calls:', error);
    });
}

function updateDashboardCounts() {
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

  for (const status in statusCounts) {
    if (statusSpans.hasOwnProperty(status)) {
      statusSpans[status].textContent = statusCounts[status];
    }
  }
}



