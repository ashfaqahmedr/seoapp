
// Define arrays to store project data and notifications
let projectWatchlist = [];
let notificationList = [];


// Function to start monitoring projects specially on App Load or Web App Loads.
const startMonitoringProjects = () => {
  monitorAllProjectsAndCreateNotification(); // Monitor projects every minute
};

// Function to make an api call to run a project by its projectId
const runProject = async (projectId) => {
  const response = await fetch(`${seourl}/project/run/${projectId}`);
  const data = await response.json();
 
  return data.success;
};

// Function to make an api call to fetch List of Prpjects  by status
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

// Function to fetch list of projects status = waiting or running  using fetchProjectsbyStatus function
const fetchAllProjectData = async () => {
  const runningProjects = await fetchProjectsbyStatus('running');
  const waitingProjects = await fetchProjectsbyStatus('waiting');

  return { runningProjects, waitingProjects };
};

// Function to get current status, Type  of a project by its ID and update the watchlist
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
        notificationList[existingProjectNoteIndex] = {
          ...notificationList[existingProjectNoteIndex], // Preserve existing properties
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
        notificationList.push(newProjectData);
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

// Function to get only current status of a project by its ID and update the watchlist
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


  
//Function to Run a project Bases on Project Status.
async function runSelectedProjectSEO(projectToRun, isConfrimComplete=true)  {

    let selectedProjectId=projectToRun.trim();
  
    // Check if the selected project is already in the watchlist
    // const existingProject = projectWatchlist.find(project => project.id === selectedProjectId);
  let isProjectStartedRun;
    let articleCreatorName =null
    let articleCreatorType =null
    let articleCreatorStatus =null
  
    let postUploaderName = null
    let postUploaderType = null
    let postUploaderStatus = null

    let  confirmDialogUse;
  
  
      const selectedProjectData = await getProjectStatus(selectedProjectId);
      articleCreatorName = selectedProjectData.name;
      articleCreatorType = selectedProjectData.type;
      articleCreatorStatus = selectedProjectData.status;
  
      if (articleCreatorStatus === 'waiting' || articleCreatorStatus === 'running') {
        createToast(
          'bodyToastDiv', 
          'info',
          'fa-solid fa-info-circle',
          'Info',
          `Project ID: ${selectedProjectId}\nProject Name: ${articleCreatorName}\nType: ${articleCreatorType}\nis already being monitored.\nCurrent Status is: ${articleCreatorStatus}`
        );
         
        isProjectStartedRun=true;
        return isProjectStartedRun;
      }
  
      if (articleCreatorStatus !== 'complete' || articleCreatorStatus === '') {
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
            uploadImages: 'waiting'
          });
  
          
          createToast(
            'bodyToastDiv', 
            'info',
            'fa-solid fa-info-circle',
            'Info',
            `Project ID: ${selectedProjectId}\nProject Name: ${articleCreatorName}\nType: ${articleCreatorType}\nis already being monitored.\nCurrent Status is: waiting`
          );
         
          createNotification(notificationList);
  
            // Call monitorProjects to include the postUploader project in monitoring
           monitorProjects([{ id: selectedProjectId, name: articleCreatorName,  type: articleCreatorType  }]);
  

          isProjectStartedRun=true;
          return isProjectStartedRun;
  
          } else {
            isProjectStartedRun=false;
            return isProjectStartedRun;
          }
         
      } 
  
      if (articleCreatorStatus === 'complete') {
        const response = await fetch(`${seoProjectsUrl}/data/${selectedProjectId}`);
        const data = await response.json();
        const chainJobId = data.result.chainJobId.trim();


           // set folder path back to start uploading.
        const getfilePathResult =  await  UpdateFolderPathPostUploader(selectedProjectId, chainJobId)
              
          if (getfilePathResult) { 
              console.log("Folder Path Updated : "+  getfilePathResult)
              }
          
        if (chainJobId) {
          
          // Get the status, name, and type of the post uploader project using the getProjectStatus API call
          const postUploaderData = await getProjectStatus(chainJobId);
          postUploaderName = postUploaderData.name;
          postUploaderType = postUploaderData.type;
          postUploaderStatus = postUploaderData.status;
  
          if (postUploaderStatus === 'waiting' || postUploaderStatus === 'running') {
            
            createToast(
              'bodyToastDiv', 
              'info',
              'fa-solid fa-info-circle',
              'Info',
              `Project ID: ${chainJobId}\nProject Name: ${postUploaderName}\nType: ${postUploaderType}\nis already being monitored.\nCurrent Status is: ${postUploaderStatus}`
            );
            isProjectStartedRun=true;
            return isProjectStartedRun;
          }
  
          
            if (postUploaderStatus !== 'complete' || postUploaderStatus === '')  {
  
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
                    uploadImages: 'waiting',
                  });
        
                  
                  createToast(
                    'bodyToastDiv', 
                    'info',
                    'fa-solid fa-info-circle',
                    'Info',
                    `Project ID: ${chainJobId}\nProject Name: ${postUploaderName}\nType: ${postUploaderType}\nis already being monitored.\nCurrent Status is: waiting}`
                  );
  
                  
                  createNotification(notificationList);
                
                         // Call monitorProjects to include the postUploader project in monitoring
                   monitorProjects([{ id: chainJobId,   name: postUploaderName,  type: postUploaderType  }]);
  

                  isProjectStartedRun=true;
                  return isProjectStartedRun;
              } else {
                isProjectStartedRun=false;
                return isProjectStartedRun;
              }

            }

            if (postUploaderStatus === 'complete') {
         
  
              if (isConfrimComplete) { 

                confirmDialogUse = await openConfrimDialog('confrimDialog', 'Confirm Re-Run the Project?', 'Do you want to Re-Run the Completed Project again?');
  
              } else {

                confirmDialogUse=true   

              }

              if (confirmDialogUse) { 
  
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
                      uploadImages: 'waiting',
                    });
                    
                    createToast(
                      'bodyToastDiv', 
                      'info',
                      'fa-solid fa-info-circle',
                      'Info',
                      `Project ID: ${selectedProjectId}\nProject Name: ${articleCreatorName}\nType: ${articleCreatorType}\nis already being monitored.\nCurrent Status is: waiting`
                    );
                    createNotification(notificationList);
                                // Call monitorProjects to include the postUploader project in monitoring
                   monitorProjects([{ id: selectedProjectId,   name: articleCreatorName,  type: articleCreatorType  }]);
  

                    isProjectStartedRun=true;
                    return isProjectStartedRun;
                   
                  }
              }
              else {
                isProjectStartedRun=false;
                return isProjectStartedRun;
              }
            

            } 
  
        }  
  
    }
  
  }


// Function to Update Status Cells with current Status
function updateStatusAndApplyClasses(projectId, projectType, newStatus) {


let tableRowIndex;
let projectColumnIndex;

  const tableId = 'main';
  const tableMain = document.getElementById(tableId);

  // Define the column index based on projectType
  let columnIndex;
  if (projectType === 'article creator') {
    columnIndex = 0;
  } else if (projectType === 'post uploader') {
    columnIndex = 3;
  }

  // console.log('columnIndex Index is: ' + columnIndex);

tableRowIndex = -1;

  // Find the row index based on projectId
  for (const rowtoFind of tableMain.tBodies[0].rows) {
    const cellValue = rowtoFind.cells[columnIndex].textContent.trim();
    if (cellValue === projectId) {
      tableRowIndex = rowtoFind.rowIndex;
      // console.log('Row Index is: ' + tableRowIndex);
      break;
    }
  }

  if (tableRowIndex === -1) {
    console.error('Project ID not found in the table:', projectId);
    return;
  }

  // Define the project column index based on projectType
  if (projectType === 'article creator') {
    projectColumnIndex = 2;
  } else {
    projectColumnIndex = 5;
  }

  // console.log('projectColumnIndex Index is: ' + projectColumnIndex);

  try {
    if (tableRowIndex === -1 || projectColumnIndex === -1) {
      console.error('Row index or status cell index is invalid.');
      return;
    }

    // Remove trailing "..." from the status
    const cleanedStatus = removeTrailingDots(newStatus);
    tableRowIndex = tableRowIndex - 1;

    const rowtoFind = tableMain.tBodies[0].rows[tableRowIndex];

    const statusCell = rowtoFind.cells[projectColumnIndex];
  

    let spanElement = statusCell.querySelector('span');

    spanElement.textContent = newStatus;
    // spanElement.classList.add(`status-${cleanedStatus.toLowerCase()}`);
    spanElement.className =`status-pill status-${cleanedStatus.toLowerCase()}`;
    // statusSpan1.className = 'status-pill status-draft';
    addStatusUpdatedClass(rowtoFind);
  } catch (error) {
    console.error('Error updating status and applying classes:', error);
  }
}

// Highlight Project Running Row
function addStatusUpdatedClass(rowtoFind) {
  rowtoFind.classList.add('highlighted-row');
  // Remove the class and reapply it after a short delay (10ms)
  setTimeout(() => {
    rowtoFind.classList.remove('highlighted-row');
    // void rowtoFind.offsetWidth; // Trigger reflow (optional)
    // row.classList.add('status-row');
  }, 3000);
}

// Function to monitor a list of projects' status and update the watchlist and get list on Load and Also Add projects to be added
const monitorProjects = async (projects) => {
  const statusArray = ['complete', 'failed', 'aborted', 'aborting...', ''];

  for (const projectData of projects) {
    const { id: projectId, name: projectName, type: projectType } = projectData;

    let currentStatus;
    let uploadImages = 'checking';

    currentStatus = await currentProjectStatus(projectId);


    let isProjectUploadImages={}
    let postUploaderId;

    let existingProjectIndex;
    let existingNotificationIndex;


    console.log(`Project ID: ${projectId}, Project Name: ${projectName}, Project Type: ${projectType}, Status: ${currentStatus}`);

    if (projectType === 'article creator'  &&  currentStatus !== 'complete') {
      
      isProjectUploadImages = await CheckUploadImagesRequired(projectId);

      if (isProjectUploadImages) {

        uploadImages = 'waiting';

        postUploaderId = isProjectUploadImages.postUploaderId;
        console.table(isProjectUploadImages);

        const getfilePathResult = await clearUploaderPath(postUploaderId);

        console.log(`File Path Set to Blank for ID: ${postUploaderId}, Image Insert Type: ${isProjectUploadImages.imageInsertType}, current path is: ${getfilePathResult}`);


      } else {
        uploadImages = 'NA';
        console.log("Project does not need to upload Images. Option is: " +  isProjectUploadImages.imageInsertType);
      }

      // If project is Post Uploader then Call Post Uploader function from Here.
    } else if (projectType === 'post uploader'  &&  currentStatus !== 'complete') {

      existingProjectIndex =  projectWatchlist.findIndex((proj) => proj.id.trim() === projectId);

       projectWatchlist.splice(existingProjectIndex, 1);
       handlePostUploaderStatus(postUploaderId, projectId);

       return
    }

      existingProjectIndex =  projectWatchlist.findIndex((proj) => proj.id.trim() === projectId);
      existingNotificationIndex=   notificationList.findIndex((proj) => proj.id.trim() === projectId);


    while (!statusArray.includes(currentStatus)) {


      await new Promise((resolve) => setTimeout(resolve, 5000));
      currentStatus = await currentProjectStatus(projectId);

      
      if (existingProjectIndex !== -1) {

        projectWatchlist[existingProjectIndex].status = currentStatus;

      }

      if (existingNotificationIndex !== -1) {

        notificationList[existingNotificationIndex].status = currentStatus;
        notificationList[existingNotificationIndex].uploadImages = uploadImages;      
 
      }

      updateStatusAndApplyClasses(projectId, projectType, currentStatus, uploadImages);
        
      console.log(`Project ID: ${projectId}, Project Name: ${projectName}, Project Type: ${projectType}, Status: ${currentStatus}`);


      createNotification(notificationList);

        if (currentStatus === 'aborted' || currentStatus === 'failed' || currentStatus === '' || currentStatus === 'aborting...') {
          if (projectType === 'article creator' && isProjectUploadImages && currentStatus === 'aborting...') {
            const getfilePathResult = await UpdateFolderPathPostUploader(projectId, postUploaderId);
            console.log(`Folder Path reverted Back to: ${getfilePathResult}`);
            createToast(
              'bodyToastDiv',
              'warning',
              'fa-solid fa-exclamation-triangle',
              'Warning',
              `Project with name "${projectName}", ID: "${projectId}", Type: "${projectType}" folderPath reverted back to "${getfilePathResult}" on SEO App.`
            );

            currentStatus = 'aborted';
            if (isProjectUploadImages) {
              uploadImages = 'failed';
            } else{
              uploadImages = 'not-required';
            }

          }

          createToast(
            'bodyToastDiv',
            currentStatus === 'complete' ? 'success' : 'warning',
            currentStatus === 'complete' ? 'fa-solid fa-check-circle' : 'fa-solid fa-exclamation-triangle',
            currentStatus === 'complete' ? 'Success' : 'Warning',
            `Project with name "${projectName}", ID: "${projectId}", Type: "${projectType}" has been ${currentStatus} on SEO App.`
          );

          projectWatchlist.splice(existingProjectIndex, 1);

          if (GAPIRequired) {
            await UpdateSelectedProjectStatusGAPI(projectId, projectType, currentStatus, uploadImages);
          }
  
          if (existingNotificationIndex !== -1) {

            notificationList[existingNotificationIndex].status = currentStatus;
            notificationList[existingNotificationIndex].uploadImages = uploadImages;
    
            updateStatusAndApplyClasses(projectId, projectType, currentStatus, uploadImages);
            
            modifyTableData('update', {
              ProjectID: projectId,
              ProjectCreatorStatus: currentStatus,
            },'ProjectID');

            createNotification(notificationList);
          }

          break;
        }
    }
 
   if (currentStatus === 'complete' && projectType === 'article creator'  && !isProjectUploadImages) { 
     
    // If local images not required go to Post Uploader
       handlePostUploaderStatus(postUploaderId, projectId);

      return 
  }

   // Check if Images to be uploaded Images are uploaded.
   else if (currentStatus === 'complete' && projectType === 'article creator' && isProjectUploadImages) {
      
          // set folder path back to start uploading.
          const getfilePathResult =  await getArticleCreatorPath(projectId)
        
          console.log("Folder Path Updated  to : "+  getfilePathResult)

          let imagesFolderPath;
          let isImageUploaded;
          //  if path exists  then Run the Post Uploader Project
          if (getfilePathResult) {
        
            console.log("Folder Path to Articlces: "+ getfilePathResult)

            imagesFolderPath = `${getfilePathResult}\\images`;

            console.log("Folder Path for Images: "+ imagesFolderPath)
            
          } else {

          getfilePathResult =  await getArticleCreatorPath(projectId)
        
            console.log("Folder Path Updated  to : "+  getfilePathResult)

          imagesFolderPath = `${getfilePathResult}\\images`;

            console.log("Folder Path for Images: "+ imagesFolderPath)

          }

          isImageUploaded = uploadImagetoWordPressText(isProjectUploadImages.url, isProjectUploadImages.username, isProjectUploadImages.password, imagesFolderPath, getfilePathResult, false) 
        
        
          if (isImageUploaded) {

            console.log("Images uploaded and return to main Function Success is  : "+ isImageUploaded)

          uploadImages='complete';

          if (existingNotificationIndex !== -1) {

            notificationList[existingNotificationIndex].status = currentStatus;
            notificationList[existingNotificationIndex].uploadImages = uploadImages;
  
            updateStatusAndApplyClasses(projectId, projectType, currentStatus, uploadImages );
            createNotification(notificationList);
          
          }

        // Call GAPI to Upload Images
          if (GAPIRequired) {
          UpdateSelectedProjectStatusGAPI(projectId, projectType, currentStatus, uploadImages);
          }
       
            //Call Run Post Uploader Function from here.
          handlePostUploaderStatus(postUploaderId, projectId);
            return 
          }  else{
           isImageUploaded = uploadImagetoWordPressText(isProjectUploadImages.url, isProjectUploadImages.username, isProjectUploadImages.password, imagesFolderPath, getfilePathResult, false) 
           if (isImageUploaded) {
           console.log(" Retried due to success was False Images uploaded and return to main Function Success is  : "+ isImageUploaded)
           return 
           }
        }
    }  
}  

// Function to Run Post Uploader Project and Hand Over to monitorProjects  after Success 
  async function handlePostUploaderStatus(postUploaderId, projectId = false) {

    const getfilePathResult =  await  UpdateFolderPathPostUploader(projectId, postUploaderId)

      if (getfilePathResult) {
        console.log("Folder Path Updated back from Post Uploader Function : "+  getfilePathResult)
      }

  const statusArray = ['complete', 'failed', 'aborted', 'aborting...', ''];

let postUploaderName
let postUploaderType

let postUploaderStatus;

let existingProjectIndex;
let existingNotificationIndex;

 let uploadImages = 'na';

 postUploaderStatus = await currentProjectStatus(postUploaderId);
  
    while (postUploaderStatus !== 'running' ||  postUploaderStatus !== 'waiting' || postUploaderStatus !== 'complete') {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      const success = await runProject(postUploaderId);
      if (success) {
      postUploaderStatus = await currentProjectStatus(postUploaderId);
       }
      break;
    }


      const postUploaderData = await getProjectStatus(postUploaderId);
      postUploaderName = postUploaderData.name;
      postUploaderType = postUploaderData.type;
      postUploaderStatus = postUploaderData.status;
  
      projectWatchlist.push({
        id: postUploaderId,
        name: postUploaderName,
        type: postUploaderType,
        status: postUploaderStatus,
        uploadImages:uploadImages
      });
  
      notificationList.push({
        id: postUploaderId,
        name: postUploaderName,
        type: postUploaderType,
        status: postUploaderStatus,
        uploadImages: uploadImages
      });
      
   
    existingProjectIndex = projectWatchlist.findIndex((proj) => proj.id.trim() === postUploaderId);

    existingNotificationIndex = notificationList.findIndex((proj) => proj.id.trim() === postUploaderId);

    updateStatusAndApplyClasses(postUploaderId, postUploaderType, postUploaderStatus, uploadImages);

     createNotification(notificationList);

        while (!statusArray.includes(postUploaderStatus)) {
          
          await new Promise((resolve) => setTimeout(resolve, 10000));
          postUploaderStatus = await currentProjectStatus(postUploaderId);
         
            if (existingProjectIndex !== -1) {
  
              projectWatchlist[existingProjectIndex].status = postUploaderStatus;
  
            }
  
            if (existingNotificationIndex !== -1) {
  
              notificationList[existingNotificationIndex].status = postUploaderStatus;
              notificationList[existingNotificationIndex].uploadImages = uploadImages;

              updateStatusAndApplyClasses(postUploaderId, postUploaderType, postUploaderStatus, uploadImages );
              createNotification(notificationList);
            }
  
           

            console.log(`Project ID: ${postUploaderId}, Project Name: ${postUploaderName}, Project Type: ${postUploaderType}, Status: ${postUploaderStatus}`);

  
            if (postUploaderStatus === 'aborted' || postUploaderStatus === 'failed' || postUploaderStatus === '' || postUploaderStatus === 'aborting...' || postUploaderStatus === 'complete') {
  
  
              if (postUploaderStatus === 'aborting...') {
                postUploaderStatus = 'aborted';

                uploadImages = 'complete';
            
              }
  
              createToast(
                'bodyToastDiv',
                postUploaderStatus === 'complete' ? 'success' : 'warning',
                postUploaderStatus === 'complete' ? 'fa-solid fa-check-circle' : 'fa-solid fa-exclamation-triangle',
                postUploaderStatus === 'complete' ? 'Success' : 'Warning',
                `Project with name "${postUploaderName}", ID: "${postUploaderId}", Type: "${postUploaderType}" has been ${postUploaderStatus} on SEO App.`
              );
  
  
              projectWatchlist.splice(existingProjectIndex, 1);
              

              if (GAPIRequired) {
                await UpdateSelectedProjectStatusGAPI(postUploaderId, postUploaderType, postUploaderStatus);
              }
  
                if (existingNotificationIndex !== -1) {
                  notificationList[existingNotificationIndex].status = postUploaderStatus;
                  notificationList[existingNotificationIndex].uploadImages = uploadImages;
  
                  updateStatusAndApplyClasses(postUploaderId, postUploaderType, postUploaderStatus, uploadImages );
                 
                  modifyTableData('update', {
                    ProjectID: projectId,
                    PostUploaderStatus: postUploaderStatus,
                  },'ProjectID');
  
                  createNotification(notificationList);
                }
                
              break;
            }
        }  
    }
}
  
  
  // Function to check if the project has insertImageType = local
async function CheckUploadImagesRequired(projectId) {
  try {

    const blogdata={}

    const response = await fetch(`${seoProjectsUrl}/data/${projectId}`);

      if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    blogdata.projectID = projectId;
    blogdata.postUploaderId = data.result.chainJobId;
    blogdata.PostUploaderName = data.result.jobName;
    blogdata.imageInsertType = data.result.imageInsert.InsertType;
    
    // console.log("Chain Job Id: " + postUploaderId + " Image Type: " + imageInsertType);

    if (blogdata.imageInsertType === 'local') {
      // console.log("Project ID:"+ projectId +" has Image type: " + imageInsertType + "need to upload images and has chainJobID : "+ postUploaderId);
    const response = await fetch(`${seoProjectsUrl}/data/${blogdata.postUploaderId}`);
    const data = await response.json();
    

    blogdata.blogsetID = Array.isArray(data.result.blogIds) ? data.result.blogIds.join(', ') : '';
    blogdata.PostStartDate = data.result.postStartDate;

    // console.log("PostUploader ID: "+ postUploaderId +" has name : " + PostUploaderName + " with blogID  : "+ blogsetID +  " with Start Date  : "+ PostStartDate + " Folder Path: " + folderpath  );
  
      // Fetch data from the third API endpoint
      const response3 = await fetch(`${appurl}/data/${ blogdata.blogsetID}`, {
        method: 'GET',
      });
      const data3 = await response3.json();
      blogdata.url = data3.url;
      blogdata.username = data3.username;
      blogdata.password = data3.password;
     

      return blogdata
    } else {

      console.log("No need to Run Upload Images")

      return false
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


// Function to return Folder Path of Article Creator Project
async function getArticleCreatorPath(projectId) {

  console.log("Artilce Creator id is : " + projectId);

  try {
    const response = await fetch(`${appurl}/SEOFolderPath`);
    const data = await response.json();
     
        const soefolder = data.folderPath;
        console.log('SEO Folder Path:', soefolder);
      
        folderpath = `${soefolder}\\${projectId}\\articles`;
            
     console.log("Artilce Creator Folder path is : " + folderpath);
        
     return folderpath;

  } catch (error) {
  
    console.error("Error in updating Post Upload Data Project: " + error );
    return false;
  }

}

// Update the Folder Path if needed
async function UpdateFolderPathPostUploader(projectId, postUploaderId) {
let folderpathtoUpdate
  console.log("Artilce Creator Project ID is : " + projectId);
  console.log("Post Uploader  ID is : " + postUploaderId);
  
  if (!projectId) {
    console.log("Artilce Creator Project ID is not valid : " + projectId);
    createToast('WordpressToastDiv', 'warning','fa-solid fa-exclamation-triangle', 'Warning', 'Article Creaotr ID is not Valid');
    return false
  }


  if (!postUploaderId) {
    createToast('WordpressToastDiv', 'warning','fa-solid fa-exclamation-triangle', 'Warning', 'Post Uploader ID is not Valid');
    console.log("Post Uploader  ID is not valid : " + postUploaderId);
   
    return false

  }


  folderpathtoUpdate = await getArticleCreatorPath(projectId);


  try {
    
      //Update Post Data 
      const postUploaderURL =`${seoProjectsUrl}/data/${postUploaderId}`
         
      const PosterjsonData = JSON.stringify({
              articleFolder: `${folderpathtoUpdate}`
              });
      
          // Make POST request
        const resPoster=  await fetch(postUploaderURL, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: PosterjsonData
         });

         const data = await resPoster.json();

         folderpathtoUpdate  = data.result.articleFolder

         console.log("Post Uploader successfuly Updated Folder path is : " + folderpathtoUpdate);
         return folderpathtoUpdate;
      
      } catch (error) {
      
        console.error("Error in updating Post Upload Data Project: " + error );
        return false;
      }

}


// Function to clear path to empty to stop the Post Uploader project.
async function clearUploaderPath(chainJobId)  {

  //Update Post Data 
const postUploaderURL =`${seoProjectsUrl}/data/${chainJobId}`

const PosterjsonData = JSON.stringify({
          articleFolder: ''
        });
    // Make POST request
  const resPoster=  await fetch(postUploaderURL, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: PosterjsonData
   });

    const data = await resPoster.json();
    // console.table(data);

    if (data.success) {
      return data.result.articleFolder;
    } else {
      console.error("Article Creator Folder Path not be updated ")
      return false;
    }

}

  // Function to continuously monitor projects and update notifications
  // const monitorAllProjectsAndCreateNotification = async () => {
  //   const { runningProjects, waitingProjects } = await fetchAllProjectData();
  //   const allProjectData = [...runningProjects, ...waitingProjects];
  
  //   const trimmedProjects = allProjectData.map(projectData => ({
  //     id: projectData.id.trim(),
  //     name: projectData.name.trim(),
  //     type: projectData.type.trim(),
  //     status: projectData.status,
  //   }));
  
  //   allProjectData.forEach(projectData => {
  
  //     const projectId = projectData.id.trim();
  //     let existingProject = projectWatchlist.find(project => project.id === projectId);
  
  //     if (!existingProject) {
  //       projectWatchlist.push({
  //         id: projectId,
  //         name: projectData.name,
  //         type: projectData.type,
  //         status: projectData.status,
  //       });
  
  //       notificationList.push({
  //         id: projectId,
  //         name: projectData.name,
  //         type: projectData.type,
  //         status: projectData.status,
  //       });
  //     }
  //   });
  
  //   // Show notification with all running and waiting projects
  //   createNotification(notificationList);
  
  //   // Monitor all projects
  //    await monitorProjects(trimmedProjects);
   
  
  //   // If there are no running, waiting, or aborting projects, show a toast
  //   if (!allProjectData.some(project => project.status === 'running' || project.status === 'waiting' || project.status === 'aborting...')) {
  //     createToast('bodyToastDiv', 'info', 'fa-solid fa-info-circle', 'Info', 'There are no projects to monitor on SEO App.');
  //   }
  // };
  
  const monitorAllProjectsAndCreateNotification = async () => {

    const { runningProjects, waitingProjects } = await fetchAllProjectData();
    const allProjectData = [...runningProjects, ...waitingProjects];
  
    const projectsToAdd = []; // Store projects to add to projectWatchlist and notificationList
  
    allProjectData.forEach(projectData => {
      const projectId = projectData.id.trim();
      
    console.log("Project is being Monitored through Cron Job")

      let existingProject = projectWatchlist.find(project => project.id === projectId);
  
      if (!existingProject) {
        // Add the project to the list of projects to add
        projectsToAdd.push({
          id: projectId,
          name: projectData.name,
          type: projectData.type,
          status: projectData.status,
        });
      }
    });
  
    // Add the new projects to projectWatchlist and notificationList
    projectWatchlist.push(...projectsToAdd);
    notificationList.push(...projectsToAdd);
  
    console.log("Project is being Monitored through Cron Job")
    // If there are new projects, show the notification
    if (projectsToAdd.length > 0) {
      createNotification(projectsToAdd);
  
      // Monitor all projects (including new and existing projects)
      await monitorProjects(projectsToAdd);
    }
  
    // If there are no running, waiting, or aborting projects, show a toast
    if (!allProjectData.some(project => project.status === 'running' || project.status === 'waiting' || project.status === 'aborting...')) {
      createToast('bodyToastDiv', 'info', 'fa-solid fa-info-circle', 'Info', 'There are no projects to monitor on SEO App.');
    }
  };
  
  
  // Create Notification List for Projects by its Status and update the status value and css class

  function createNotification(allProjectData) {
  const notificationTableBody = document.getElementById('notificationTableBody');
  const popupContainer = document.getElementById('popupContainer');
  toggleNotificationPanel();

  if (allProjectData.length === 0) {
    // If there is no data, hide the notification and remove the HTML elements
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
    allProjectData.forEach((project) => {
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

        // Create a separate cell for "Images" value
        const imageCell = document.createElement('div');
        imageCell.classList.add('data-cell');
        imageCell.textContent = project.uploadImages;
        notificationRow.appendChild(imageCell);

        // Append the row to the notificationTableBody
        notificationTableBody.appendChild(notificationRow);
      } else {
        // If the project ID already exists in the set, update the status and "Images" values in the existing row
        const existingRow = notificationTableBody.querySelector(
          `.notification-row > .data-cell:first-child[data-value="${project.id}"]`
        );
        if (existingRow) {
          existingRow.nextElementSibling.textContent = project.status;
          // Update "Images" value in the existing row
          existingRow.nextElementSibling.nextElementSibling.textContent = project.uploadImages;
           // Instead of updating the "Images" value in the existing row, create a new cell for it
            const imageCell = document.createElement('div');
            imageCell.classList.add('data-cell');
            imageCell.textContent = project.uploadImages;
            
            // Insert the new "Images" cell after the status cell
            existingRow.parentNode.insertBefore(imageCell, existingRow.nextElementSibling);
            
        }
      }
    });


    // Apply conditional formatting to cells based on their values
    const rows = notificationTableBody.querySelectorAll('.notification-row');
    rows.forEach((row) => {
      const cells = row.querySelectorAll('.data-cell');
      cells.forEach((cell) => {
        const value = cell.textContent.trim().toLowerCase();

        // Apply conditional formatting based on cell value
        if (
          value === 'draft' ||
          value === 'waiting' ||
          value === 'failed' ||
          value === 'aborted' ||
          value === 'complete' ||
          value === 'running' ||
          value === 'aborting...' ||
          value === 'pending' ||
          value === 'na'
        ) {
          // Clear the existing content of the cell
          cell.innerHTML = '';

          const statusSpan = document.createElement('span');
          statusSpan.classList.add('status-pill');

          // Remove trailing "..." from the status
          const cleanedStatus = removeTrailingDots(value);

          statusSpan.classList.add(`status-${cleanedStatus.toLowerCase()}`);
          statusSpan.textContent = cleanedStatus;

          // Append the status span to the cell
          cell.appendChild(statusSpan);
        }

        // Apply border radius to cells
        cell.style.borderRadius = '5px';
      });
    });
  }

  // Close button event handler
  const closeBtn = document.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => {
    notificationTableBody.innerHTML = '';
    toggleNotificationPanel();
  });
}



