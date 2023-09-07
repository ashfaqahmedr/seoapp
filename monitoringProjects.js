
// Define arrays to store project data and notifications
let projectWatchlist = [];
let notificationList = [];


// Function to run project by ID and show loader while running
async function runProjectById() {
  showLoader();
  await startMonitoringProject(selectedRowId);
  hideLoader();
}


// Function to run a project by its ID
const runProject = async (projectId) => {
  const response = await fetch(`${seourl}/project/run/${projectId}`);
  const data = await response.json();
  hideLoader();
  return data.success;
};

// Function to fetch all projects by status
const fetchProjectsbyStatus = async (status) => {
  const response = await fetch(`${seourl}/all-projects?status=${status}`);
  const data = await response.json();
  return data.result.map(project => ({
    id: project.id,
    name: project.name,
    type: project.type,
    status: project.status
  }));
}

// Function to fetch all project data
const fetchAllProjectData = async () => {
  const runningProjects = await fetchProjectsbyStatus('running');
  const waitingProjects = await fetchProjectsbyStatus('waiting');

  return { runningProjects, waitingProjects };
};

// Function to get current status of a project by its ID and update the watchlist
const getProjectStatus = async (projectId) => {

  try {
    const response = await fetch(`${seourl}/project/status/${projectId}`);
    const data = await response.json();

    const currentStatus = data.result[0].status;
    const existingProjectIndex = projectWatchlist.findIndex(project => project.id === projectId);

    if (existingProjectIndex !== -1) {
      // Update the existing project's data in the watchlist
      projectWatchlist[existingProjectIndex] = {
        ...projectWatchlist[existingProjectIndex], // Preserve existing properties
        status: currentStatus, // Update the status
        name: data.result[0].name, // Add project name to the watchlist
        type: data.result[0].type, // Add project type to the watchlist
      };
    } else {
      // If the project doesn't exist in the watchlist, add it along with its name and type information
      const newProjectData = {
        id: projectId,
        name: data.result[0].name, // Add project name to the watchlist
        type: data.result[0].type, // Add project type to the watchlist
        status: currentStatus,
      };
      projectWatchlist.push(newProjectData);

      const existingProjectNoteIndex = notificationList.findIndex(project => project.id === projectId);

      if (existingProjectNoteIndex !== -1) {
        // Update the existing project's data in the watchlist
        projectWatchlist[existingProjectNoteIndex] = {
          ...projectWatchlist[existingProjectNoteIndex], // Preserve existing properties
          status: currentStatus, // Update the status
          name: data.result[0].name, // Add project name to the watchlist
          type: data.result[0].type, // Add project type to the watchlist
        };
      
      } else {
        // If the project doesn't exist in the watchlist, add it along with its name and type information
        const newProjectData = {
          id: projectId,
          name: data.result[0].name, // Add project name to the watchlist
          type: data.result[0].type, // Add project type to the watchlist
          status: currentStatus,
        };
        projectWatchlist.push(newProjectData);
      } 
  
    } 
    
         // Call the createNotification function with the updated watchlist
         createNotification(notificationList);

    return {
      status: currentStatus,
      name: data.result[0].name,
      type: data.result[0].type,
    };

  } catch (error) {
    console.error('Error fetching project status:', error);
    return {
      status: 'unknown', // Return 'unknown' status if there's an error
      name: '',
      type: '',
    };
  }
};

// Function to get current status of a project by its ID and update the watchlist
const currentProjectStatus = async (projectId) => {

    try {
      const response = await fetch(`${seourl}/project/status/${projectId}`);
      const data = await response.json();
      const currentStatus = data.result[0].status;
    
      return currentStatus
  
    } catch (error) {
      console.error('Error fetching project status:'+projectId , error);
      return 'unknown'
        
    }
  };

// Function to start monitoring a project
const startMonitoring = () => {
    monitorAllProjectsAndCreateNotification(); // Monitor projects every minute
  };

  
//Function to Run a project Bases on Project Status.

async function startMonitoringProject (projectToRun)  {

    let selectedProjectId=projectToRun.trim();
  
    // Check if the selected project is already in the watchlist
    // const existingProject = projectWatchlist.find(project => project.id === selectedProjectId);
  
    let articleCreatorName =null
    let articleCreatorType =null
    let articleCreatorStatus =null
  
    let postUploaderName = null
    let postUploaderType = null
    let postUploaderStatus = null
  
  
      const selectedProjectData = await getProjectStatus(selectedProjectId);
      articleCreatorName = selectedProjectData.name;
      articleCreatorType = selectedProjectData.type;
      articleCreatorStatus = selectedProjectData.status;
  
      if (articleCreatorStatus === 'waiting' || articleCreatorStatus === 'running') {
        createToast(
          'info',
          'fa-solid fa-info-circle',
          'Info',
          `Project ID: ${selectedProjectId}\nProject Name: ${articleCreatorName}\nType: ${articleCreatorType}\nis already being monitored.\nCurrent Status is: ${articleCreatorStatus}`
        );
        return;
      }
  
      if (articleCreatorStatus !== 'complete') {
        // If the project status is not complete, run the project and add it to the watchlist with status 'waiting'
        const success = await runProject(selectedProjectId);
  
        if (success) {
          // Add the project to the watchlist with status 'waiting'
          projectWatchlist.push({
            id: selectedProjectId,
            name: articleCreatorName,
            type: articleCreatorType,
            status: 'waiting',
          });
  
           // Add the project to the watchlist with status 'waiting'
           notificationList.push({
            id: selectedProjectId,
            name: articleCreatorName,
            type: articleCreatorType,
            status: 'waiting',
          });
  
  
          createToast(
            'info',
            'fa-solid fa-info-circle',
            'Info',
            `Project ID: ${selectedProjectId}\nProject Name: ${articleCreatorName}\nType: ${articleCreatorType}\nis already being monitored.\nCurrent Status is: waiting`
          );
         
          createNotification(notificationList);
  
          monitorProjects([{ id: selectedProjectId }]);
  
          }
      } 
  
      if (articleCreatorStatus === 'complete') {
        const response = await fetch(`${apiurl}/data/${selectedProjectId}`);
        const data = await response.json();
        const chainJobId = data.result.chainJobId.trim();
       
         // Check if the post uploader project already exists in the watchlist
        //  const existingPostUploaderProject = projectWatchlist.find(project => project.id === chainJobId);
          
        if (chainJobId) {
          
          // Get the status, name, and type of the post uploader project using the getProjectStatus API call
          const postUploaderData = await getProjectStatus(chainJobId);
          postUploaderName = postUploaderData.name;
          postUploaderType = postUploaderData.type;
          postUploaderStatus = postUploaderData.status;
  
          if (postUploaderStatus === 'waiting' || postUploaderStatus === 'running') {
            createToast(
              'info',
              'fa-solid fa-info-circle',
              'Info',
              `Project ID: ${chainJobId}\nProject Name: ${postUploaderName}\nType: ${postUploaderType}\nis already being monitored.\nCurrent Status is: ${postUploaderStatus}`
            );
            return;
          }
  
          
            if (postUploaderStatus !== 'complete')  {
  
              // If the post uploader project is not complete, run it and add it to the watchlist with status 'waiting'
              const success = await runProject(chainJobId);
        
              if (success) {
                // If the post uploader project doesn't exist in the watchlist, add it along with its name and type information
  
                  projectWatchlist.push({
                    id: chainJobId,
                    name: postUploaderName,
                    type: postUploaderType,
                    status: 'waiting',
                  });
  
                  notificationList.push({
                    id: chainJobId,
                    name: postUploaderName,
                    type: postUploaderType,
                    status: 'waiting',
                  });
        
                  createToast(
                    'info',
                    'fa-solid fa-info-circle',
                    'Info',
                    `Project ID: ${chainJobId}\nProject Name: ${postUploaderName}\nType: ${postUploaderType}\nis already being monitored.\nCurrent Status is: waiting}`
                  );
  
                  
                  createNotification(notificationList);
                
                  monitorProjects([{ id: chainJobId }]);
                 
              }
            }
  
            if (postUploaderStatus === 'complete') {
         
              hideLoader();
  
              const confirmDialogUse = await openConfrimDialog('confrimDialog', 'Confirm Re-Run the Project?', 'Do you want to Re-Run the Completed Project again?');
  
              if (confirmDialogUse) { 
  
                showLoader();
  
                // Run the article creator project again and add it to the watchlist with status 'waiting'
                       
                    // If the project status is not complete, run the project and add it to the watchlist with status 'waiting'
                    const success = await runProject(selectedProjectId);
              
                    if (success) {
                    //   // Add the project to the watchlist with status 'waiting'
                      projectWatchlist.push({
                        id: selectedProjectId,
                        name: articleCreatorName,
                        type: articleCreatorType,
                        status: 'waiting',
                      });
                    
                      // Add the project to the watchlist with status 'waiting'
                    notificationList.push({
                      id: selectedProjectId,
                      name: articleCreatorName,
                      type: articleCreatorType,
                      status: 'waiting',
                    });
  
                    createToast(
                      'info',
                      'fa-solid fa-info-circle',
                      'Info',
                      `Project ID: ${selectedProjectId}\nProject Name: ${articleCreatorName}\nType: ${articleCreatorType}\nis already being monitored.\nCurrent Status is: waiting`
                    );
                    createNotification(notificationList);
                    monitorProjects([{ id: chainJobId }]);  
                   
                  }
              }
              else {
                return;
              }
  
            } 
  
        }  
  
    }
  
  }
  
  // Function to monitor a list of projects' status and update the watchlist
  const monitorProjects = async (projects) => {
    const statusArray = ['complete', 'failed', 'aborted', ''];
  
    const monitoredProjects = [];
  
    for (const projectData of projects) {
      const { id: projectId, name: projectName, type: projectType } = projectData;
  
      let currentStatus = await currentProjectStatus(projectId);
  
      const existingProjectIndex = projectWatchlist.findIndex(
        (proj) => proj.id.trim() === projectId
      );
  
      if (existingProjectIndex === -1) {
        projectWatchlist.push({
          id: projectId,
          name: projectName,
          type: projectType,
          status: 'waiting',
        });
      }
  
      const existingNotificationIndex = notificationList.findIndex(
        (proj) => proj.id.trim() === projectId
      );
  
      if (existingNotificationIndex === -1) {
        notificationList.push({
          id: projectId,
          name: projectName,
          type: projectType,
          status: 'waiting',
        });
      }
  
  
      while (!statusArray.includes(currentStatus)) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        currentStatus = await currentProjectStatus(projectId);
  
        if (existingProjectIndex !== -1) {
          projectWatchlist[existingProjectIndex].status = currentStatus;
  
          console.log(`Project with ID ${projectId} status is: ${currentStatus}`);
  
          if (currentStatus === 'aborted' || currentStatus === 'failed' || currentStatus === '') {
            createToast(
              currentStatus === 'complete' ? 'success' : 'warning',
              currentStatus === 'complete' ? 'fa-solid fa-check-circle' : 'fa-solid fa-exclamation-triangle',
              currentStatus === 'complete' ? 'Success' : 'Warning',
              `Project with name "${projectName}", id: "${projectId}", type: "${projectType}" has been ${currentStatus} on SEO App.`
            );
            projectWatchlist.splice(existingProjectIndex, 1);
            break;
          }
        }
  
        if (currentStatus === 'aborting...') {
          createToast(
            'warning',
            'fa-solid fa-exclamation-triangle',
            'Warning',
            `Project with name "${projectName}", id: "${projectId}", type: "${projectType}" has been ${currentStatus} on SEO App.`
          );
        }
  
        const existingNotificationIndex = notificationList.findIndex((proj) => proj.id === projectId);
  
        if (existingNotificationIndex !== -1) {
          notificationList[existingNotificationIndex].status = currentStatus;
          findRowIndexAndStatusCellIndex(projectId, projectType);
          updateStatusAndApplyClasses(currentStatus);
          createNotification(notificationList);
        }
      }
  
      if (currentStatus === 'complete' && projectType === 'article creator') {
        if (existingNotificationIndex !== -1) {
          notificationList[existingNotificationIndex].status = currentStatus;
        }
  
        findRowIndexAndStatusCellIndex(projectId, projectType);
        updateStatusAndApplyClasses(currentStatus);
        createNotification(notificationList);
  
        createToast(
          currentStatus === 'complete' ? 'success' : 'warning',
          currentStatus === 'complete' ? 'fa-solid fa-check-circle' : 'fa-solid fa-exclamation-triangle',
          currentStatus === 'complete' ? 'Success' : 'Warning',
          `Project with name "${projectName}", id: "${projectId}", type: "${projectType}" has been ${currentStatus} on SEO App.`
        );
  
        projectWatchlist.splice(existingProjectIndex, 1);
  
        const response = await fetch(`${apiurl}/data/${projectId}`);
        const data = await response.json();
        const postUploaderId = data.result.chainJobId;
  
        if (postUploaderId) {
          let tries = 0;
          let postUploaderStatus = await currentProjectStatus(postUploaderId);
  
          while (postUploaderStatus !== 'running' && tries < 3) {
            await new Promise((resolve) => setTimeout(resolve, 10000));
            const success = await runProject(postUploaderId);
            tries++;
            postUploaderStatus = await currentProjectStatus(postUploaderId);
          }
  
          if (postUploaderStatus === 'running') {
            const postUploaderData = await getProjectStatus(postUploaderId);
            const postUploaderName = postUploaderData.name;
            const postUploaderType = postUploaderData.type;
            const postUploaderStatus = postUploaderData.status;
  
            projectWatchlist.push({
              id: postUploaderId,
              name: postUploaderName,
              type: postUploaderType,
              status: postUploaderStatus,
            });
  
            notificationList.push({
              id: postUploaderId,
              name: postUploaderName,
              type: postUploaderType,
              status: postUploaderStatus,
            });
  
            if (existingNotificationIndex !== -1) {
              notificationList[existingNotificationIndex].status = currentStatus;
              findRowIndexAndStatusCellIndex(projectId, projectType);
              updateStatusAndApplyClasses(currentStatus);
            }
  
            createToast(
              currentStatus === 'complete' ? 'success' : 'warning',
              currentStatus === 'complete' ? 'fa-solid fa-check-circle' : 'fa-solid fa-exclamation-triangle',
              currentStatus === 'complete' ? 'Success' : 'Warning',
              `Project with name "${projectWatchlist.find(project => project.id === postUploaderId).name}", id: "${postUploaderId}", type: "${projectType}" has been ${currentStatus} on SEO App.`
            );
  
            createNotification(notificationList);
  
          } else {
            createToast('error', 'fa-solid fa-times-circle', 'Error', 'Post uploader project failed to start.');
          }
        } else {
          createToast('error', 'fa-solid fa-times-circle', 'Error', 'Chain job ID not found for the Post Uploader project.');
        }
      } else if (currentStatus === 'complete' && projectType !== 'article creator') {
        createToast(
          currentStatus === 'complete' ? 'success' : 'warning',
          currentStatus === 'complete' ? 'fa-solid fa-check-circle' : 'fa-solid fa-exclamation-triangle',
          currentStatus === 'complete' ? 'Success' : 'Warning',
          `Project with name "${projectName}", id: "${projectId}", type: "${projectType}" has been ${currentStatus} on SEO App.`
        );
      }
  
      if (existingNotificationIndex !== -1) {
        notificationList[existingNotificationIndex].status = currentStatus;
        findRowIndexAndStatusCellIndex(projectId, projectType);
        updateStatusAndApplyClasses(currentStatus);
        createNotification(notificationList);
      }
    }
  
  
  };
  
  // Function to continuously monitor projects and update notifications
  const monitorAllProjectsAndCreateNotification = async () => {
    const { runningProjects, waitingProjects } = await fetchAllProjectData();
    const allProjectData = [...runningProjects, ...waitingProjects];
  
    const trimmedProjects = allProjectData.map(projectData => ({
      id: projectData.id.trim(),
      name: projectData.name.trim(),
      type: projectData.type.trim(),
      status: projectData.status,
    }));
  
    allProjectData.forEach(projectData => {
  
      const projectId = projectData.id.trim();
      let existingProject = projectWatchlist.find(project => project.id === projectId);
  
      if (!existingProject) {
        projectWatchlist.push({
          id: projectId,
          name: projectData.name,
          type: projectData.type,
          status: projectData.status,
        });
  
        notificationList.push({
          id: projectId,
          name: projectData.name,
          type: projectData.type,
          status: projectData.status,
        });
      }
    });
  
    // Show notification with all running and waiting projects
    createNotification(notificationList);
  
    // Monitor all projects
     await monitorProjects(trimmedProjects);
  
    // If there are no running, waiting, or aborting projects, show a toast
    if (!allProjectData.some(project => project.status === 'running' || project.status === 'waiting' || project.status === 'aborting...')) {
      createToast('info', 'fa-solid fa-info-circle', 'Info', 'There are no projects to monitor on SEO App.');
    }
  };
  
  
  
  const notificationTableBody = document.getElementById('notificationTableBody');
  const popupContainer = document.getElementById('popupContainer');
  
  function createNotification(allProjectData) {
    toggleNotificationPanel();
  
    if (allProjectData.length === 0) {
      // If there is no data, hide the notification and remove the HTML elements
      // createToast('info', 'fa-solid fa-info-circle', 'Info', 'No projects are currently running.');
      popupContainer.style.display = 'none';
      notificationTableBody.innerHTML = '';
      return;
    } else {
      // Show the notification and update the table body with the new data
      popupContainer.style.display = 'block';
  
      const existingProjectIds = new Set(); // To store existing project IDs
  
      // Clear the previous contents of the table body
      notificationTableBody.innerHTML = '';
  
      // Create table rows with project data
      allProjectData.forEach(project => {
        if (!existingProjectIds.has(project.id)) {
          // If the project ID is not in the set, add the row and store the project ID in the set
          existingProjectIds.add(project.id);
  
          const notificationRow = document.createElement('div');
          notificationRow.classList.add('notification-row');
  
          const idCell = document.createElement('div');
          idCell.classList.add('data-cell');
          idCell.textContent = project.id;
          notificationRow.appendChild(idCell);
  
          const nameCell = document.createElement('div');
          nameCell.classList.add('data-cell');
          nameCell.textContent = project.name;
          notificationRow.appendChild(nameCell);
  
          const typeCell = document.createElement('div');
          typeCell.classList.add('data-cell');
          typeCell.textContent = project.type;
          notificationRow.appendChild(typeCell);
  
          const statusCell = document.createElement('div');
          statusCell.classList.add('data-cell');
          statusCell.textContent = project.status;
          notificationRow.appendChild(statusCell);
  
          // Append the row to the notificationTableBody
          notificationTableBody.appendChild(notificationRow);
        } else {
          // If the project ID already exists in the set, update the status in the existing row
          const existingRow = notificationTableBody.querySelector(`.notification-row > .data-cell:first-child[data-value="${project.id}"]`);
          if (existingRow) {
            existingRow.nextElementSibling.textContent = project.status;
          }
        }
      });
  
      // Apply conditional formatting to cells
      const rows = notificationTableBody.querySelectorAll('.notification-row');
      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll('.data-cell');
        for (let j = 0; j < cells.length; j++) {
          const cell = cells[j];
          const value = cell.textContent.trim().toLowerCase();
  
          // Apply conditional formatting based on cell value
          if (
            value === 'draft' ||
            value === 'waiting' ||
            value === 'failed' ||
            value === 'aborted' ||
            value === 'complete' ||
            value === 'running' ||
            value === 'aborting...'
          )
           {
            const statusSpan = document.createElement('span');
            statusSpan.classList.add('status-pill');
  
            // Remove trailing "..." from the status
     const cleanedStatus = removeTrailingDots(value);
  
     statusSpan.classList.add(`status-${cleanedStatus.toLowerCase()}`);
  
            statusSpan.textContent = value;
  
            // Clear the existing content of the cell
            cell.innerHTML = '';
  
            // Append the status span to the cell
            cell.appendChild(statusSpan);
          }
  
          // Apply border radius to cells
          cell.style.borderRadius = '5px';
        }
      }
    }
  }
  
  
  // Close button event handler
  const closeBtn = document.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => {
    notificationTableBody.innerHTML = '';
    toggleNotificationPanel();
  });


  // JavaScript
let tablerowIndex;
let statusCellIndex;

let tableRowIndex;
let projectColumnIndex;

function findRowIndexAndStatusCellIndex(projectId, projectType) {

  const tableMain = document.getElementById('main');
  let columnIndex;

  if (projectType === 'article creator') {
    columnIndex = 0;
  } else if (projectType === 'post uploader') {
    columnIndex = 5;
  } else {
    return;
  }

  console.log('columnIndex Index is: ' + columnIndex);

  tableRowIndex = -1;

  for (const rowtoFind of tableMain.tBodies[0].rows) {
    const cellValue = rowtoFind.cells[columnIndex].textContent.trim();
    if (cellValue === projectId) {
      tableRowIndex = rowtoFind.rowIndex;
      console.log('Row Index is: ' + tableRowIndex);
      break;
    }
  }

  if (tableRowIndex === -1) {
    console.error('Project ID not found in the table:', projectId);
    return;
  }

  if (projectType === 'article creator') {
    projectColumnIndex = 1;
  } else {
    projectColumnIndex = 8;
  }

  console.log('projectColumnIndex Index is: ' + projectColumnIndex);
}

function updateStatusAndApplyClasses(newStatus) {
  if (tableRowIndex === -1 || projectColumnIndex === -1) {
    console.error('Row index or status cell index is invalid. Please call findRowIndexAndStatusCellIndex first.');
    return;
  }

  // Remove trailing "..." from the status
  const cleanedStatus = removeTrailingDots(newStatus);
  tableRowIndex=tableRowIndex-1
  const tableMain = document.getElementById('main');
  const rowtoFind = tableMain.tBodies[0].rows[tableRowIndex];
  const statusCell = rowtoFind.cells[projectColumnIndex];

  let spanElement = statusCell.querySelector('.status-pill');

  spanElement.textContent = newStatus;
  spanElement.classList.add(`status-${cleanedStatus.toLowerCase()}`);
  addStatusUpdatedClass(rowtoFind);
}

// Function to add the status-updated class and trigger the animation
function addStatusUpdatedClass(rowtoFind) {
  rowtoFind.classList.add('status-row');
  // Remove the class and reapply it after a short delay (10ms)
  setTimeout(() => {
    rowtoFind.classList.remove('status-row');
    void rowtoFind.offsetWidth; // Trigger reflow (optional)
    // row.classList.add('status-row');
  }, 3000);
}