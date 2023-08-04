
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
  
    // Task 1: Fetch all projects and store the required keys in an object
    fetch(`${seourl}/all-projects?type=article%20creator`)
      .then((response) => response.json())
      .then(async (data) => {
        const formattedData = {};
        // Extract the required keys from each project
        data.result.forEach((project) => {
          const { id, status } = project;
          formattedData[id] = { projectId: id, articleStatus: status };
        });
  
        // Task 2: Fetch additional data for each project and update the object
        const projectPromises = Object.keys(formattedData).map(async (id) => {
          const response = await fetch(`${apiurl}/data/${id}`);
          const projectData = await response.json();
  
          const {
            jobName,
            // articleCategories,
            // categoryInsertFile,
            articleKeywordsFile,
            chainJobId,
          } = projectData.result;

          const categoryInsertFile = projectData.result.categoryInsert.CategoryInsertFile;

          formattedData[id] = {
            ...formattedData[id],
            articleProjectName: jobName,
            // articleCategories,
            categoryInsertFile,
            articleKeywordsFile,
            postProjectId: chainJobId,
          };
        });
  
        // Wait for all promises to resolve
        await Promise.all(projectPromises);
  
        // Task 3: Fetch more data based on chainJobId and update the object
        const chainJobPromises = Object.values(formattedData).map(async (project) => {
          if (project.postProjectId) {
            const response = await fetch(
              `${apiurl}/data/${project.postProjectId}`
            );
            const chainJobData = await response.json();
            const { jobName, blogIds, postStartDate } = chainJobData.result;
            formattedData[project.projectId] = {
              ...formattedData[project.projectId],
              postDate: postStartDate,
              PostJobName: jobName,
              blogId: Array.isArray(blogIds) ? blogIds.join(', ') : blogIds,
            };
          }
        });
  
        // Wait for all promises to resolve
        await Promise.all(chainJobPromises);
  
        // Task 4: Fetch status and name based on projectID and update the object
        const statusPromises = Object.values(formattedData).map(async (project) => {
          if (project.postProjectId) {
            const response = await fetch(
              `${apiurl}/status/${project.postProjectId}`
            );
            const statusData = await response.json();
            project.postUploaderStatus = statusData.result[0].status;
          }
        });
  
        // Wait for all promises to resolve
        await Promise.all(statusPromises);
  
        // Task 5: Make a request to the server-side function to get data for the specified ID
        const fetchDataById = async (id) => {
          const response = await fetch(`${appurl}/data/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          return response.json();
        };
  
        // Collect all promises for fetching data by ID
        const fetchPromises = Object.values(formattedData).map(async (project) => {
          const blogId = project.blogId;
          if (blogId) {
            const data = await fetchDataById(blogId);
            const { id, username, password, url, group } = data;
            formattedData[project.projectId] = {
              ...formattedData[project.projectId],
              blogPostId: id,
              blogUserName: username,
              blogPassword: password,
              blogUrl: url,
              blogGroup: group,
            };
          }
        });
  
        // Wait for all promises to resolve
        await Promise.all(fetchPromises);
  
        // Task 6: Generate the table based on the final formattedData object
        createTableFromData(formattedData);
        console.table(formattedData);
         
      })
      .catch((error) => {
        console.error(error);
            // Call createToast function after error
      let type = 'error';
      let icon = 'fa-solid fa-circle-exclamation';
      let title = 'Error';
      let text = 'An error occurred while fetching projects.';
      createToast(type, icon, title, text);
      hideLoader();
        
      });
  
  }


  //Function to show Aricle Creator Projects
  async function fetchArticleCreator() {
    sectiontoshow = 'articleCreator'
    // Show Animation
    showLoader();
  
    // Task 1: Fetch all projects and store the required keys in an object
    fetch(`${seourl}/all-projects?type=article%20creator`)
      .then((response) => response.json())
      .then(async (data) => {
        const formattedData = {};
        // Extract the required keys from each project
        data.result.forEach((project) => {
          const { id, status } = project;
          formattedData[id] = { projectId: id, articleStatus: status };
        });
  
        // Task 2: Fetch additional data for each project and update the object
        const projectPromises = Object.keys(formattedData).map(async (id) => {
          const response = await fetch(`${apiurl}/data/${id}`);
          const projectData = await response.json();
  
          // const categoryInsertdata = projectData.categoryInsert.CategoryInsertFile;

          const {
            jobName,
            // articleCategories,
            // categoryInsertFile,
            articleKeywordsFile,
            chainJobId,
          } = projectData.result;

          const categoryInsertFile = projectData.result.categoryInsert.CategoryInsertFile;

          formattedData[id] = {
            ...formattedData[id],
            articleProjectName: jobName,
            // articleCategories,
            categoryInsertFile,
            articleKeywordsFile,
            postProjectId: chainJobId,
          };
        });

  
        // Wait for all promises to resolve
        await Promise.all(projectPromises);

        // Task 6: Generate the table based on the final formattedData object
        createTableFromData(formattedData);
      })
      .catch((error) => {
        console.error(error);
            // Call createToast function after error
      let type = 'error';
      let icon = 'fa-solid fa-circle-exclamation';
      let title = 'Error';
      let text = 'An error occurred while fetching projects.';
      createToast(type, icon, title, text);
      ideLoader();
      });
  
  }

// Function to show PostUploader Projects
async function fetchPostUploader() {

  sectiontoshow = 'postuploader'
    // Show Animation
    showLoader();
  
     // Task 1: Fetch all projects and store the required keys in an object
     fetch(`${seourl}/all-projects?type=post%20uploader`)
     .then((response) => response.json())
     .then(async (data) => {
       const formattedData = {};
       // Extract the required keys from each project
       data.result.forEach((project) => {
         const { id, status } = project;
         formattedData[id] = { projectId: id, articleStatus: status };
       });
 
       // Task 2: Fetch additional data for each project and update the object
       const projectpostPromises = Object.keys(formattedData).map(async (id) => {
         const response = await fetch(`${apiurl}/data/${id}`);
         const projectData = await response.json();
         console.table(projectData);

        const {
          jobName,
          postStartDate,
          postsPerDay,
          postIntervalFrom,
          postIntervalTo,
          articleTitle,
          articleCategory,
          articleTags,
          blogIds,
        } = projectData.result;
        formattedData[id] = {
          ...formattedData[id],
          articleProjectName: jobName,
        //   articleFolder,
          postStartDate,
          postsPerDay,
          postIntervalFrom,
          postIntervalTo,
          articleTitle,
          articleCategory,
          articleTags,
          blogPostId: blogIds,
        };
      });

      // Wait for all promises to resolve
      await Promise.all(projectpostPromises);

      // Task 6: Generate the table based on the final formattedData object
      createTableFromData(formattedData);
      console.table(formattedData);
    
    })
    .catch((error) => {
      console.error(error);
          // Call createToast function after error
          let type = 'error';
          let icon = 'fa-solid fa-circle-exclamation';
          let title = 'Error';
          let text = 'An error occurred while fetching projects.';
          createToast(type, icon, title, text);
          ideLoader();
    });

}

//Function to show Json File
async function ReadJsonFile() {

  sectiontoshow = 'jsondata'

  // Show Animation
  showLoader();
  try {
    const response = await fetch(`${appurl}/data`);
    const data = await response.json();

    const formattedData = [];

    // Restructure the data into an array of objects
    data.forEach((item) => {
      const formattedItem = {
        blogPostId: item.id,
        blogUserName: item.username,
        blogPassword: item.password,
        blogUrl: item.url,
        blogGroup: item.group,
      };
      formattedData.push(formattedItem);
    });

    // Task 6: Generate the table based on the final formattedData object
    createTableFromData(formattedData);
    updateStatusCounts();
  } catch (error) {
    console.error(error);

    // Call createToast function after error
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



