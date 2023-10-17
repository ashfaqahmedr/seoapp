// Functions for get GOogle Sheet New Data and updated DATA

let tableData;
//Check the Server -WORKING
async function testServer() {
     showLoader(defaultLoaderId);
    try {
      const response = await fetch(`${seourl}/test`, {
        method: 'GET'
      });
  
      const data = await response.json();
  
      console.log(data)

      if (data.success)  {
   
        createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', 'Logged In successfully.');
        txttopTitle.textContent="SEO Content Machine Desktop App (Connected)"
       
      }
    } catch (error) {
        console.error(error)
        createToast('bodyToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'error', 'Username or Password is invalid. error: '+error);
        loginHeader.textContent="SEO Content Machine Desktop App (DIsconnected)"
         hideLoader(defaultLoaderId);
     
    }
}
  
  //Main DashBoard Function to Create Dashboard.
async function fetchAllLocalProjectsSEO() {

  try {
    // Step 1: Fetch Article Creator Projects
    const response1 = await fetch(`${seourl}/all-projects?type=article%20creator`);
    const articleCreatorData = await response1.json();

    // Create a map to track projects by ProjectID
    const projectsMap = new Map();
    try {
    // Step 2: Fetch chain JOB ID from the Data
    const projectPromises = articleCreatorData.result.map(async (project) => {
      const response = await fetch(`${seoProjectsUrl}/data/${project.id}`);
      const projectData = await response.json();
      const { chainJobId } = projectData.result;

      // Create or update the project in the map
      if (!projectsMap.has(project.id)) {
        projectsMap.set(project.id, {
          ProjectID: project.id,
          ProjectName: project.name,
          ProjectCreatorStatus: project.status,
          postProjectId: chainJobId,
          postDate: null,
          BlogId: '',
          PostUploaderId: '', // Initialize as empty
          PostUploaderName: '', // Initialize as empty
          PostUploaderStatus: '', // Initialize as empty
          url: '',
        });
      } else {
        projectsMap.get(project.id).postProjectId = chainJobId;
      }
    });

    // Wait for all promises to resolve
    await Promise.all(projectPromises);
  } catch(error) {
    console.error('Error in Step 2:', error);
  }

  try {
    // Step 3: Fetch PostDate and blogID from Post Uploader Data
    const chainJobPromises = Array.from(projectsMap.values()).map(async (project) => {
      if (project.postProjectId) {
        const response = await fetch(`${seoProjectsUrl}/data/${project.postProjectId}`);
        const chainJobData = await response.json();
        const { blogIds, postStartDate } = chainJobData.result;

        // Update the project in the map
        project.postDate = postStartDate;
        project.BlogId = Array.isArray(blogIds) ? blogIds.join(', ') : blogIds;
      }
    });

    // Wait for all promises to resolve
    await Promise.all(chainJobPromises);

  
  } catch(error) {
    console.error('Error in Step 3:', error);
  }

  try {
    // Step 4: Fetch Post Uploader Projects for getting Data
    const response2 = await fetch(`${seourl}/all-projects?type=post%20uploader`);
    const postUploaderData = await response2.json();

    console.table(postUploaderData)

 // Merge the post uploader projects into the existing data
postUploaderData.result.forEach((project) => {
  // Find all projects in the projectsMap based on postProjectId
  const matchedProjects = Array.from(projectsMap.values()).filter(
    (p) => p.postProjectId === project.id
  );

  if (matchedProjects.length > 0) {
    // Update all matching projects
    matchedProjects.forEach((matchedProject) => {
      matchedProject.PostUploaderId = project.id;
      matchedProject.PostUploaderName = project.name;
      matchedProject.PostUploaderStatus = project.status;
    });
  }
});


} catch(error) {
  console.error('Error in Step 4:', error);
}

try{
    // Step 5: Fetch Unique Blog Data
    const response3 = await fetch(`${appurl}/uniqueBlogIDs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const uniqueBlogData = await response3.json();


    // Update projects in the map with unique blog URLs
    Array.from(projectsMap.values()).forEach((project) => {
      const blogIds = project.BlogId.split(', ');
      const blogUrls = blogIds.map((blogId) => {
        const blogInfo = uniqueBlogData.find((item) => item.id === blogId);
        return blogInfo ? blogInfo.url : '';
      });

      // Update the project in the map
      project.BlogId = blogIds.join(', ');
      project.url = blogUrls.join(', ');
    });

  } catch(error) {
    console.error('Error in Step 4:', error);
  }
    // Convert the map values to an array
    const formattedData = Array.from(projectsMap.values());

    // Create a new array with the keys in the desired sequence
    tableData = formattedData.map((project) => ({
      ProjectID: project.ProjectID,
      ProjectName: project.ProjectName,
      ProjectCreatorStatus: project.ProjectCreatorStatus,
      PostUploaderId: project.PostUploaderId,
      PostUploaderName: project.PostUploaderName,
      PostUploaderStatus: project.PostUploaderStatus,
      PostStartDate: project.postDate,
      BlogId: project.BlogId,
      url: project.url,
    }));

    // Display the data as a table
    console.table(tableData);
   
    createTableFromData(tableData, false ,'main', true);  // Add checkboxes and use dashboard elements
     // Create Table
     hideLoader(defaultLoaderId)
    
    // createTableFromData(tableData, true, 'popupCommonTable', false, 1);

} catch (error) {
   hideLoader(defaultLoaderId)
    console.error('Error:', error);
  }
}


    //Function to show Aricle Creator Projects fro Local Server
  async function LocalCreatorProjects() {
   
    // Show Animation
     showLoader(defaultLoaderId);
  
    // Task 1: Fetch all projects and store the required keys in an object
    fetch(`${seourl}/all-projects?type=article%20creator`)
      .then((response) => response.json())
      .then(async (data) => {
        const formattedData = {};
        // Extract the required keys from each project
        data.result.forEach((project) => {
          const { id, name, status, type} = project;
          formattedData[id] = { 
            ProjectID: id,
            ProjectName:name,
            ProjectCreatorStatus: status,
            projectType: type

          };
        });
  
      

        tableData=  formattedData;

        console.table(tableData);


        // createTableFromData(tableData, false ,'main', 'mainTableBody', true);  // Add checkboxes and use dashboard elements

        createTableFromData(tableData, true, 'popupCommonTable', false, 1);

        fetchDomainsAndShowCoDialog(true);
        hideLoader(defaultLoaderId);

        // return formattedData;

      })
      .catch((error) => {
        console.error(error);
            // Call createToast function after error
      let type = 'error';
      let icon = 'fa-solid fa-circle-exclamation';
      let title = 'Error';
      let text = 'An error occurred while fetching projects.';
      createToast('bodyToastDiv', type, icon, title, text);
       hideLoader(defaultLoaderId);
      });


  
  }


  // Function to show PostUploader Projects
  async function LocalPostUploaderProjects() {

      // Show Animation
       showLoader(defaultLoaderId);
    
       // Task 1: Fetch all projects and store the required keys in an object
       fetch(`${seourl}/all-projects?type=post%20uploader`)
       .then((response) => response.json())
       .then(async (data) => {
         const formattedData = {};
         // Extract the required keys from each project
         data.result.forEach((project) => {
          const { id, name, status, type} = project;
          formattedData[id] = { 
            PostUploaderId: id,
            PostUploaderName:name,
            PostUploaderStatus: status,
            projectType: type

          };
         });
   
      

        tableData=formattedData;

        console.table(tableData);       
    
        // createTableFromData(tableData, false ,'main', 'mainTableBody', true);  // Add checkboxes and use dashboard elements

        createTableFromData(tableData, true, 'popupCommonTable', false, 1);
        fetchDomainsAndShowCoDialog(true);
      // Create Table
      hideLoader(defaultLoaderId)

      
      })
      .catch((error) => {
        console.error(error);
            // Call createToast function after error
            let type = 'error';
            let icon = 'fa-solid fa-circle-exclamation';
            let title = 'Error';
            let text = 'An error occurred while fetching projects.';
            createToast('bodyToastDiv', type, icon, title, text);
             hideLoader(defaultLoaderId);
      });
  }
  //Function to show Json File
async function LocalReadJsonFile() {

  
  // Show Animation
  showLoader(defaultLoaderId);

  try {
    const response = await fetch(`${appurl}/data`);
    const data = await response.json();

    const formattedData = [];

    // Restructure the data into an array of objects
    data.forEach((item) => {
      const formattedItem = {
        BlogId: item.id,
        username: item.username,
        password: item.password,
        url: item.url,
        group: item.group,
      };
      formattedData.push(formattedItem);
    });

  
      // createTableFromData(tableData, false ,'main', 'mainTableBody', true);  // Add checkboxes and use dashboard elements


      tableData = formattedData;

      console.table(tableData);

      createTableFromData(tableData, true, 'popupCommonTable', false, 1);
      fetchDomainsAndShowCoDialog(true);

      hideLoader(defaultLoaderId);
      // Task 6: Generate the table based on the final formattedData object
    //  return formattedData;

    } catch (error) {
      console.error(error);
  
      // Call createToast function after error
      let type = 'error';
      let icon = 'fa-solid fa-circle-exclamation';
      let title = 'Error';
      let text = 'An error occurred while fetching projects.';
      createToast('bodyToastDiv', type, icon, title, text);
  
       hideLoader(defaultLoaderId);
    }
  }
  
  // Function to show  Projects by status
async function LocalProjectsbyStatus(articleStatus) {
  // Show Animation
   showLoader(defaultLoaderId);

  // Task 1: Fetch all projects and store the required keys in an object
  fetch(`${seourl}/all-projects?status=${articleStatus}`)
    .then((response) => response.json())
    .then(async (data) => {
      const formattedData = {};

      // Extract the required keys from each project
      data.result.forEach((project) => {
        const { id, name, type, status } = project;
        formattedData[id] = { 
         ProjectID: id,
          ProjectName: name,
          ProjectType: type,
          ProjectStatus: status
        };
      });

      // Task 6: Generate the table based on the final filteredProjects object
      if (Object.keys(formattedData).length > 0) {

     
        // createTableFromData(Object.values(formattedData), false ,'main', 'mainTableBody', true);  // Add checkboxes and use dashboard elements
       
        createTableFromData(Object.values(formattedData), true, 'popupCommonTable', false, 1);
           fetchDomainsAndShowCoDialog(true);
           
             // console.table(Object.values(formattedData));
         } else {
           console.log(`No projects found for the specified articleStatus "${articleStatus}".`);
           // Call createToast function for notifying the user
           let type = 'warning';
           let icon = 'fa-solid fa-triangle-exclamation';
           let title = 'Warning';
           let text = `No projects found for the specified article status "${articleStatus}".`;
           createToast('bodyToastDiv', type, icon, title, text);
         }
       })
       .catch((error) => {
         console.error(error);
         // Call createToast function after error
         let type = 'error';
         let icon = 'fa-solid fa-circle-exclamation';
         let title = 'Error';
         let text = 'An error occurred while fetching projects.';
         createToast('bodyToastDiv', type, icon, title, text);
       })
       .finally(() => {
          hideLoader(defaultLoaderId);
       });
   }

 
  // Function to get project and status counts Local
 async  function LocalGetProjectCounts() {
  
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
  
    const promises = [];
  
    for (const status in statusUrls) {
      const url = statusUrls[status];
      const promise = fetch(url)
        .then((response) => response.json())
        .then((data) => {
          statusCounts[status] = data.result.length;
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
      })
      .catch((error) => {
        console.error('Error fetching ID count:', error);
      });
  
    promises.push(idCountPromise);
  
    return Promise.all(promises).then(() => {
      console.log('All API calls completed.');

  // Update the Sidebar Counts
    updateDashboardCounts(statusCounts);
    console.table(statusCounts);
    
    });
  }
  
  //Data All  collected Data from Local Server.  

  async function GetSelectedProjectLocal(selectedRowId) {
    const data = {};
  
    try {


      try {
      // Fetch data from the first API endpoint
      const response1 = await fetch(`${seoProjectsUrl}/data/${selectedRowId}`);
      const data1 = await response1.json();
      const result1 = data1.result;


      const response1_1 = await fetch(`${seoProjectsUrl}/status/${selectedRowId}`);
      const data1_1 = await response1_1.json();
      const result1_1 = data1_1.result;

      data.ProjectID = selectedRowId;
      data.ProjectName = result1.jobName;

      if (result1.jobCron) {
        data.jobcronString = result1.jobCron;
      } else {
        data.jobcronString = "0 0 * * 7";
      }
      
      data.ImageType = result1.imageInsert.InsertType;
      data.ProjectCreatorStatus = result1_1[0].status;
      data.ProjectKeyowrds = Array.isArray(result1.articleKeywordsFile)
        ? result1.articleKeywordsFile.join(', ')
        : '';
      data.ProjectCatagories = Array.isArray(result1.categoryInsert.CategoryInsertFile)
        ? result1.categoryInsert.CategoryInsertFile.join(', ')
        : '';
      data.chainJobId = result1.chainJobId;
  
      jobid = result1.chainJobId;

    } catch (error) {
      console.error('Error while Fetching Data from  Article Creator Project:', error);
    }
  
    try {
      // Fetch data from the second API endpoint
      const response2 = await fetch(`${seoProjectsUrl}/data/${jobid}`);
      const data2 = await response2.json();
      const result2 = data2.result;
  
      const response2_1 = await fetch(`${seoProjectsUrl}/status/${jobid}`);
      const data2_1 = await response2_1.json();
      const result2_1 = data2_1.result;


      data.PostUploaderId = jobid;
      data.PostUploaderName = result2.jobName;
      data.PostUploaderStatus = result2_1[0].status;
      data.PostStartDate = result2.postStartDate;

      console.log("SEO Post Start Date:" + result2.postStartDate +" converted date is "+ data.PostStartDate)

      data.BlogId = Array.isArray(result2.blogIds) ? result2.blogIds.join(', ') : '';
  
      // Assign BlogIDs
      blogsetID = data.BlogId;
  
    } catch (error) {
       
      hideLoader(defaultLoaderId);
      console.error('Error while Fetching Data from  Post Uploader Project:', error);
    }
  
try {
      // Fetch data from the third API endpoint
      const response3 = await fetch(`${appurl}/data/${blogsetID}`, {
        method: 'GET',
      });
      const data3 = await response3.json();
  
      data.username = data3.username;
      data.password = data3.password;
      data.url = data3.url;
      data.group = data3.group;
  
    } catch (error) {
       
  hideLoader(defaultLoaderId);
      console.error('Error while Fetching Data from  Local API.:', error);
    }
  
      // Log the resulting data as a JSON table
      console.table(data);

    console.log("get Selected Project Log");
    console.table(data);

     // Populate dialog with unique data specific to SEO
    
    populateDialogWithUniqueDataSEO("GETDATA")
    
    // Populate Project Data
    populateProjectData(data);

    } catch (error) {
      console.error('Error fetching Project Data:', error);
       hideLoader(defaultLoaderId)
      }
  
  }
  

// Function to Update Data on SEO and Make Google API call to update Same of Google Server
  async function updateDatatoSEO(selectedRowId, chainJobId, id,  JSONData, isRunProjectRequired = false, calledfromSyncFunction = false) {
  
    let settingdata;
    
    let isupdatedDatatoSEO =false;
    
   
      // Article Creator Project Update Part
  try {
    
      try {
      const response = await fetch(`${appurl}/custom-settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
     
      settingdata = await response.json();
        console.table(settingdata);
        // Populate the input elements with the retrieved values
    
      } catch (error) {
        console.error('Error while Fetching Custom Settings:', error);
        hideLoader(defaultLoaderId)
        success = false; // Set success to false if there was an error
      }
  try {    
    const creatorProjectUrl =`${seoProjectsUrl}/data/${selectedRowId}`

    const contentFilterArray = parseCommaSeparatedString(settingdata.ListofContentFilter);

    const categoryInsertFileArray = parseCommaSeparatedString(JSONData.ProjectCatagories);
      
    const ProjectKeyowrdsArray = parseCommaSeparatedString(JSONData.ProjectKeyowrds);
  
         // Prepare request body
     const creatorJSON = JSON.stringify({
      jobName: JSONData.ProjectName,
      chainJobId: JSONData.PostUploaderId,
      articleJunkFilterFile: contentFilterArray,
      articleUseCategoryInsert:true,
      categoryInsert: {
        CategoryInsertFile: categoryInsertFileArray
      },
      articleCategories : categoryInsertFileArray,
      articleKeywordsFile: ProjectKeyowrdsArray,
      urlLimitResults: settingdata.URLsDownloadResultLimits,
      articleCountRequired: settingdata.ArticleCount,
      articleUseImages: settingdata.UseImages,
      jobCron: JSONData.JobCronString,  //Job Crone added
      imageInsert: {
        InsertAtStartOfBody: settingdata.InsertAtStartOfBody,
        FrequencyFrom: settingdata.InsertNoofImagesFROM,
        FrequencyTo:settingdata.InsertNoofImagesTO,
        InsertType: JSONData.ImageType,
        UseBing: settingdata.UseBingImages,
        UseYoutube: settingdata.UseYoutubeThumbnails,
        UseCreativeCommons: settingdata.UseCreativeCommonsImages,
        UseBingCC: settingdata.UseBingCCImages,
        UseUnsplash: true,
        UsePixaBay: true,
        UsePexels: true
      }
    });

     // Make POST request
   const resCreator=  await fetch(creatorProjectUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: creatorJSON
    });


    if (resCreator.ok)  {

      isupdatedDatatoSEO=true;

      console.log('Creator Project Part updated succesfully.');

    }  else {
      isupdatedDatatoSEO=false;
      hideLoader(defaultLoaderId)
      console.error("Error in updating data of Article Creator Project");
    }
  } catch (error) {
    hideLoader(defaultLoaderId)
    console.error("Error in updating data of Article Creator Project" , error);
  }

// Get Folder Path of the Article Creator from Local Host

try {

const folderpath = await getArticleCreatorPath(selectedRowId);

 console.log("File path for the Artilce Creator is " + folderpath);

 isupdatedDatatoSEO=true;

} catch (error) {
  hideLoader(defaultLoaderId)
  console.error("Error occured while get Folder Path " , error);
}


try {

//Update Post Data 
const postUploaderURL =`${seoProjectsUrl}/data/${chainJobId}`

// Date format: "10-01-2023"
const formattedDate = formatDate(JSONData.PostStartDate, false);

const PosterjsonData = JSON.stringify({
        blogIds: [
          JSONData.BlogId
        ],
        articleFolder: folderpath,
        postStartDate: formattedDate,
        postUseToday  :settingdata.postUseToday,
        postIntervalFrom : parseInt(settingdata.PostIntervaldaysFROM),
        postIntervalTo : parseInt(settingdata.PostIntervaldaysTO),
        postsPerDay : parseInt(settingdata.PostsperDay),
        articleTitle: settingdata.postarticleTitle,
        jobName: JSONData.PostUploaderName,
  
        });

    // Make POST request
  const resPoster=  await fetch(postUploaderURL, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: PosterjsonData
   });


   if (resPoster.ok) {
    isupdatedDatatoSEO=true;

    console.log("Post Uploader Part updated succesfully.");
   
  }  else {
    isupdatedDatatoSEO=false;
    hideLoader(defaultLoaderId)
    console.error("Error in updating Post Upload Data Project: ");

  }
  
} catch (error) {

  console.error("Error in updating Post Upload Data Project: " + error );

}

//  Update JSON Data using LOCAL HOST
  // if parameter Passed to Updated the Data
    if (isUpdateDomainInfo) {
      try {
      const blogIDURL = `${appurl}/data/${id}`
      
      const bloJSONData = JSON.stringify({
        username : JSONData.username,
        password : JSONData.password, 
        url : JSONData.url,
        group : JSONData.group
      });

      console.log("Data from Blog Update Setting ")
      console.table(bloJSONData)

      const ResJSON=  await fetch(blogIDURL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bloJSONData
      });
      
      const data = await ResJSON.json()
  
      console.table( data)
      if (data.success) {
        isupdatedDatatoSEO=data.success;
        console.log("JSON Updated Successfuly Success: " + isupdatedDatatoSEO)
       
      } else {

        isupdatedDatatoSEO=data.success;
         hideLoader(defaultLoaderId)
        console.log("JSON Updated Successfuly Success: " + isupdatedDatatoSEO)
   
      }

    } catch (error) {
      console.error('Error while updating Domain Info Data:', error);
       hideLoader(defaultLoaderId)
      success = false; // Set success to false if there was an error
    }

    } else {
      isupdatedDatatoSEO=true;
    }


   console.log("JSON Updated Successfuly Success: " + isupdatedDatatoSEO + "Sync Values : " + calledfromSyncFunction ) 

   if (isupdatedDatatoSEO && !calledfromSyncFunction) {

     hideLoader(defaultLoaderId);

    // Try to hide when not called from AutoSync Function

    
    closeDialog('ProjectsDialog')

    createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', " ID: "+ selectedRowId + ' Updated Successfully ');
 
    
  // Update Table with Data
   const celIndexesToUpdate = [1, 3, 4, 6, 7, 8]
   const formattedDate = formatDate(JSONData.PostStartDate, false);
  //  Values to Update
  const valuesToUpdate= [JSONData.ProjectName, JSONData.PostUploaderId, JSONData.PostUploaderName, formattedDate, JSONData.BlogId, JSONData.url]
    updateRowCellsByValue('main', 0, selectedRowId, celIndexesToUpdate, valuesToUpdate)

      //  Update tableData Object
       modifyTableData('update', {
        ProjectID: selectedRowId,
        ProjectName: JSONData.ProjectName,
        PostUploaderId:JSONData.PostUploaderId,
        PostUploaderName: JSONData.PostUploaderName,
        PostStartDate: formattedDate,
        BlogId: JSONData.BlogId,
        url:  JSONData.url,
      }, 'ProjectID');
      

        // If Update Project and Run Passed 
    if (isRunProjectRequired) {
        // Call Local function to run a project
      runSelectedProjectSEO(selectedRowId, calledfromSyncFunction);
    }  

   //  true to make GAPI Call if updated by Local 

    if (GAPIRequired) {

    // Make Api call after Success 
     // Update the Created Project Data back to Google Server from Local App.
     updateSelectedProjectDataGAPI(selectedRowId, JSONData, false , false) 
 
    }

    // If updated by Sync 

    if (calledfromSyncFunction) {

      // Make Api call after Success 
       // Update the Created Project Data back to Google Server from Local App.
       updateSelectedProjectDataGAPI(JSONData.SheetID, JSONData, false , calledfromSyncFunction) 
   
      }

 }

 
} catch (error) {

  isupdatedDatatoSEO=false;
  createToast('bodyToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'error', 'There is error while Updating data to Local & SEO Api: ' + error);
   console.error('Error while updating JSON API  data:', error);
    hideLoader(defaultLoaderId)
 }

}


   // Function to Create New Project of Duplicate Project from Local Server and Make Google API call to Create Same of Google Server
   // Create = json, run after create, duplicate false means add else true, false Is Sync from GAPI.
  
   async function createProjectsONSEO(JSONData, isRunProjectRequired, isDuplicated,  calledfromSyncFunction) {
    let settingdata;
    let isProjectCreated = false;
    let newArticleCreatorID;
    let newPostUploaderID;
    let newBlogID;
    // Step 0 Get Custom Setting Dialog from LOCAL Host
    
  try {
      
    try {
      const response = await fetch(`${appurl}/custom-settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        settingdata = await response.json();
        console.table(settingdata);
        // Populate the input elements with the retrieved values
      } else {
        console.error('Error retrieving settings');
      }
  
      
   } catch (error) {
    createToast('ProjectToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'error', 'There is error while retreiving Custom Settings: ' + error);
     console.error('Error while updating JSON API  data:', error);
      hideLoader(defaultLoaderId)
   }

   try {
      // Step 1: Create Article Creator and Get ID.
      const response1 = await fetch(`${seourl}/create/articlecreator`);

      const data1 = await response1.json();
      console.log(data1);
      newArticleCreatorID = data1.result.id;

      if (response1.ok) {
        isProjectCreated=true;  
      }

      console.log('New Article Creator ID:', newArticleCreatorID);
  

     } catch (error) {

        createToast('ProjectToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'error', 'There is error while Creating New Article Creator Project: ' + error);
         console.error('There is error while Creating New Article Creator Project:', error);
          hideLoader(defaultLoaderId)
       }

try {       
      // Step 2: Create Post Uploader and Get Post ID.
      const response2 = await fetch(`${seourl}/create/postuploader`);
      const data2 = await response2.json();
      newPostUploaderID = data2.result.id;
      console.log('New Post Uploader ID:', newPostUploaderID);

           isProjectCreated=true;  
  
    } catch (error) {

      createToast('ProjectToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'error', 'There is error while Creating New Post Uploader Project: ' + error);
       console.error('There is error while Creating New Post Uploader Project: ', error);
        hideLoader(defaultLoaderId)
     }

      // Step 3: Create new Blog and BLogID from LOCAL Host and Update data

     

      // If Project is Duplicated =false then no Need to add Domain Info just old Blog ID
      if (!isDuplicated) {

        try {        

      const bloJSONData = {
        username : JSONData.username,
        password : JSONData.password, 
        url : JSONData.url,
        group : JSONData.group
      };

        console.table(bloJSONData)

      const response3 = await createNewBlogID(JSONData, false)

      // BlogIdInput.value=response3.blogID;

      newBlogID = response3.blogID;
     
      console.log('New Blog ID:', newBlogID);

      if (response3.success) {
        isProjectCreated=true;  

      }

        } catch (error) {

          createToast('ProjectToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'error', 'There is error while Creating New BlogID  for Domain: ' + error);
          console.error('There is error while Creating New BlogID  for Domain: ', error);
           hideLoader(defaultLoaderId)
        }

    } else {
      newBlogID = JSONData.BlogId;
    }

  
try {
  
    const categoryInsertFileArray = parseCommaSeparatedString(JSONData.ProjectCatagories);
      
      const ProjectKeyowrdsArray = parseCommaSeparatedString(JSONData.ProjectKeyowrds);

      // Split the string into an array based on a delimiter and trim spaces
      
      const contentFilterArray = parseCommaSeparatedString(settingdata.ListofContentFilter);
      
 // Step 4: Update the newArticleCreatorID using POST Method
      const articelCreatorJSON = {
        jobName: JSONData.ProjectName,
        chainJobId: newPostUploaderID,
        jobCron: JSONData.JobCronString,  //Job Crone added
        articleCategories : categoryInsertFileArray,
        articleKeywordsFile: ProjectKeyowrdsArray,
        articleJunkFilterFile: contentFilterArray,
        articleUseCategoryInsert:true,
        categoryInsert: {
          CategoryInsertFile: categoryInsertFileArray
        },
       
        urlLimitResults: settingdata.URLsDownloadResultLimits,
        articleCountRequired: settingdata.ArticleCount,
        articleUseImages: settingdata.UseImages,
        imageInsert: {
          InsertAtStartOfBody: settingdata.InsertAtStartOfBody,
          FrequencyFrom: settingdata.InsertNoofImagesFROM,
          FrequencyTo:settingdata.InsertNoofImagesTO,
          InsertType: settingdata.InsertType,
          UseBing: settingdata.UseBingImages,
          UseYoutube: settingdata.UseYoutubeThumbnails,
          UseCreativeCommons: settingdata.UseCreativeCommonsImages,
          UseBingCC: settingdata.UseBingCCImages,
          UseUnsplash: true,
          UsePixaBay: true,
          UsePexels: true
        }
      

      }

     console.log("Article Creator Log: " + articelCreatorJSON)

       fetch(`${seoProjectsUrl}/data/${newArticleCreatorID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(articelCreatorJSON)
      });
  
      // Date format: "10-01-2023"
      const formattedDate = formatDate(JSONData.PostStartDate, false);
           // Step 5: Get SEO Path to Pass to Folderpath

      const folderpath = await getArticleCreatorPath(newArticleCreatorID);
      
      console.log("Folder Path: " + folderpath)
      // Step 6: Update the newBlogID using POST Method

      const postUploaderData = {
        blogIds: [
          newBlogID
        ],
        articleFolder: folderpath,
        postStartDate: formattedDate,
        postUseToday  :settingdata.postUseToday,
        postIntervalFrom : parseInt(settingdata.PostIntervaldaysFROM),
        postIntervalTo : parseInt(settingdata.PostIntervaldaysTO),
        postsPerDay : parseInt(settingdata.PostsperDay),
        articleTitle: settingdata.postarticleTitle,
        jobName: JSONData.PostUploaderName,
      
      }

       fetch(`${seoProjectsUrl}/data/${newPostUploaderID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postUploaderData)
      });

    } catch (error) {

      createToast('ProjectToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'error', 'There is error while Posting Article Creator or Post Uploader Data to SEO: ' + error);
       console.error('There is error while Posting Article Creator or Post Uploader Data to SEO:', error);
        hideLoader(defaultLoaderId)
     }    
      // Step 6: Update the newBlogID using POST Method

    
 
      if (isProjectCreated) { 


          // alert('New Article Creator ID: ' + newArticleCreatorID + ' New Post Uploader ID: ' + newPostUploaderID + ' New Blog ID: ' + newBlogID);
       hideLoader(defaultLoaderId);

      createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', 'New Article Creator Project with ID:' + newArticleCreatorID + '<br> has been created,  New Post Uploader with ID: ' + newPostUploaderID + '<br> has been created, New Blog with ID: ' + newBlogID + ' has been created!');

        // Update Sidebar Counts

    const formattedDate = formatDate(JSONData.PostStartDate, false);

      if (!UseLocalDataForTable) {
        updateStatusCounts()
      } 


      // if Sync Function called send Repspones to Google for Updating Data.
      if (GAPIRequired && calledfromSyncFunction) { 
      
        const jsonGAPIData = {
              ProjectID: newArticleCreatorID,
              PostUploaderId: newPostUploaderID,
              BlogId: newBlogID,
              ...JSONData,
        
        };

        // Update the Created Project Data back to Google Server from Local App.
        updateSelectedProjectDataGAPI(JSONData.SheetID, jsonGAPIData, false , calledfromSyncFunction) 
        
      }
          // if  !Sync Function called send Repspones to Google to add on Google Server.
          if (GAPIRequired && !calledfromSyncFunction) { 
      
            const jsonGAPIData = {
                  ProjectID: newArticleCreatorID,
                  PostUploaderId: newPostUploaderID,
                  BlogId: newBlogID,
                  ...JSONData,
            
            };
    
            // Add the Created Project Data back to Google Server from Local App.

            createSelectedProjectDataGAPI(jsonGAPIData, false, isDuplicated, calledfromSyncFunction )
                 
          }

      // Function call to Add Data to TableDataObject

          modifyTableData('add', {
            ProjectID: newArticleCreatorID,
            ProjectName: JSONData.ProjectName,
            ProjectCreatorStatus: 'draft',
            PostUploaderId: newPostUploaderID,
            PostUploaderName: JSONData.PostUploaderName,
            PostUploaderStatus: 'draft',
            PostStartDate: formattedDate,
            BlogId: newBlogID,
            url:  JSONData.url,
          },'ProjectID');
              
    // If Update Project and Run Passed 
    if (isRunProjectRequired) {
      // Call Local function to run a project
    runSelectedProjectSEO(newArticleCreatorID, calledfromSyncFunction);

    }  

     //Update the Variables to newly created Project IDs

      // Add a new row at index 2 (third row)
      const table = document.getElementById('main');
      const newRow = table.insertRow(1);

      // Insert cells and set their content
      for (let i = 0; i < 9; i++) {
        const cell = newRow.insertCell(i);
        cell.textContent = '';
      }
  
      // Set specific cell values based on input fields and create status spans
      newRow.cells[0].textContent = newArticleCreatorID;
      newRow.cells[1].textContent = JSONData.ProjectName;

      const statusSpan1 = document.createElement('span');
      statusSpan1.className = 'status-pill status-draft';
      statusSpan1.textContent = 'draft';
      newRow.cells[2].appendChild(statusSpan1);

      newRow.cells[3].textContent = newPostUploaderID;
      newRow.cells[4].textContent = JSONData.PostUploaderName;

      const statusSpan2 = document.createElement('span');
      statusSpan2.className = 'status-pill status-draft';
      statusSpan2.textContent = 'draft';
      newRow.cells[5].appendChild(statusSpan2);

    // Date format: "10-01-2023"
      // const formattedDate = formatDate(JSONData.PostStartDate, false);

     
      newRow.cells[6].textContent = formattedDate;

      newRow.cells[7].textContent = newBlogID;

            // Create a link element
        const link = document.createElement("a");
        link.href = JSONData.url;
        link.target = "_blank";
        link.textContent = JSONData.url;

        // Append the link element to the cell
        newRow.cells[8].appendChild(link);

        // Clear the content of the cell
        // newRow.cells[8].textContent = '';

          // Update Rows Count
      updateTableRowCount('main', 'recordCount')

       hideLoader(defaultLoaderId);

      
    }

    // Try to hide when not called from AutoSync Function
if (!calledfromSyncFunction) {
  console.log('Article Creator Data has been saved!');
  closeDialog('ProjectsDialog')
  }

} 

catch (error) {
  hideLoader(defaultLoaderId);
console.error('Error retrieving settings:', error);
createToast('ProjectToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'There is error while fetching data from SEO Server: ' + error);
        
}
}


//Delete Selected Project From Local Server and Make Google API call and Make Google API call to Delete Same of Google Server
async function deleteProjectDatafromSEO(selectedRowId, isSyncCall =false, sheetID=false) {


  if (!isSyncCall) {
   showLoader(defaultLoaderId)
    }


  try {

    console.log(seoProjectsUrl)

    //Step 1 get ChainJob ID
    const response = await fetch(`${seoProjectsUrl}/data/${selectedRowId}`);
    const data = await response.json();
    const result = data.result;

    const Postjobids = result.chainJobId;

    console.log("Creator Project ID: "+ selectedRowId +"Post Uploader ID: "+ Postjobids)

    // Step 3: Delete selected RowId of Creator
    const isArticleDeleted =  await deleteSeoProjects(selectedRowId)

    console.log("Creator Project ID: "+ selectedRowId +"Is Deleted: "+isArticleDeleted)


    // Step 4: Delete chainJobId
    const isPostDeleted = await  deleteSeoProjects(Postjobids)

    console.log("Post Uploader ID: "+ Postjobids +"Is Deleted: "+isPostDeleted)

    // // Step 5: Delete blogIds
    // const isJobIDDeleted = await deleteSelectedDomainInfo(blogsetID);

    // console.log("Blog ID: "+ blogsetID +"Is Deleted: "+ isJobIDDeleted)

  // If deleted Success fully
  // if (isArticleDeleted && isPostDeleted && isJobIDDeleted) {

    if (isArticleDeleted && isPostDeleted) {

      // Update Sidebar Counts
    if (!UseLocalDataForTable) {
      updateStatusCounts()
        } 

       // Delete Row from table

       deleteRowsFromTableAndArray('main', 0, selectedRowId)

       // // Remove data from tableData object  based on ProjectID
      modifyTableData('remove', { ProjectID: selectedRowId }, 'ProjectID');

      hideLoader(defaultLoaderId);

  if  (isSyncCall) {

createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', 'Selected Project and its related Data has been Deleted by GAPI Action! <br> Project ID :' + selectedRowId + ' and SheetID is : ' + sheetID);

} else {
createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', 'Selected Project and its related Data has been Deleted! <br> Project ID :' + selectedRowId);

}
  // if True then Delete project from Google Server 
 if (GAPIRequired && isSyncCall && sheetID ) {    

  // Delete project from Google API Server

  deleteSelectedProjectfromSEOLOCAL(sheetID)

 }

  } 


  if (!isSyncCall) {
      hideLoader(defaultLoaderId);
  
      }

  } catch (error) {
  
     
    if (!isSyncCall) {

       hideLoader(defaultLoaderId);
   
      console.error('Error while deleting Poject ID:' + selectedRowId, error);
      createToast('bodyToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'There is some Error while deleting Project from SEO Server <br>error: '+ error + " Project ID: " + selectedRowId);
  
    } else{

      console.error('Error while deleting Poject ID:' + selectedRowId + ' and SheetID is : ' + sheetID,  error);
      createToast('bodyToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'There is some Error while deleting Project from SEO Server using Sync <br> error : '+ error + " Project ID: " + selectedRowId + ' and SheetID is : ' + sheetID);
  
    }

  }
}

//Sub function for Delete deleteProjectDatafromSEO  Selected ID Creator and Poster Project from SEO.
async function deleteSeoProjects(deleteid) {
  try {
    const response = await fetch(`${seoProjectsUrl}/delete/${deleteid}`);
    const data = await response.json();
    console.table(data);

    if (data.success) {
      return true;
    } else {
      createToast('bodyToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'There was an error deleting the SEO project with ID: ' + deleteid);
      return false;
    }
  } catch (error) {
    createToast('bodyToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'There was an error while deleting the SEO project with ID: ' + deleteid + '. Error: ' + error);
    return false;
  }
}


  // Function to create array field input
  function parseCommaSeparatedString(inputString) {
    return inputString.split(',').map(item => item.trim());
  }

  // JSON File Local Server Function
  async function createNewBlogID(JSONData, isSyncCall) {
    try {
      const bloJSONData = JSON.stringify({
        username: JSONData.username,
        password: JSONData.password,
        url: JSONData.url,
        group: JSONData.group
      });
  
      console.table(bloJSONData);
  
      const response = await fetch(`${appurl}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: bloJSONData
      });
  
      const data = await response.json();
      const newBlogID = data.id;
      console.log('New Blog ID:', newBlogID);
      hideLoader(defaultLoaderId);
      createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', 'New Blog with ID: ' + newBlogID + ' has been created!');


      if (data.success) {

      if (GAPIRequired && isSyncCall) {

          const jsonReturn = {
           BlogId: newBlogID,
           username: JSONData.username,
           password: JSONData.password,
           url: JSONData.url,
           group:  JSONData.group
          }
 
           // Update the Created Project Data back to Google Server from Local App.
        updateSelectedProjectDataGAPI(JSONData.SheetID, jsonReturn, false , calledfromSyncFunction) 
   

          // updateSelectedProjectDataGAPI(JSONData.SheetID, jsonReturn, false)

        }
        return {
          success: data.success,
          blogID: newBlogID
        };

      }


    } catch (error) {
      createToast('bodyToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Error in creating New Blog ID');
  
      console.error('Error creating new blog:', error);
      return {
        success: false,
        blogID: null
      };
    }
  }

  // Function to get JSON Blog Data
async function getSelectedDomainInfo(domainBlogid) {

  try {

    const blogIDURL = `${appurl}/data/${domainBlogid}`
    
    const ResJSON=  await fetch(blogIDURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = await ResJSON.json()

    console.table( data)

    console.log("JSON Retreived Successfuly")

      return data
  
  } catch (error) {

    console.error('Error while updating Domain Info Data:', error);
    return false; // Set success to false if there was an error
  }
}

  
  // Function to Update JSON Blog Data
async function UpdateSelectedDomainInfo(domainBlogid, JSONData) {

  try {

    const blogIDURL = `${appurl}/data/${domainBlogid}`
    
    const bloJSONData = JSON.stringify({
      username : JSONData.username,
      password : JSONData.password, 
      url : JSONData.url,
      group : JSONData.group
    });

    console.log("Data from Blog Update Data ")
    console.table(bloJSONData)

    const ResJSON=  await fetch(blogIDURL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bloJSONData
    });
    
    const data = await ResJSON.json()

    console.table( data)

    if (data.success) {

      console.log("JSON Updated Successfuly Success: " + data.success)

      return true
    } else {

      console.error('Error while updating Domain Info');

      return false

    }
  } catch (error) {

    console.error('Error while updating Domain Info Data:', error);
    return false; // Set success to false if there was an error
  }
}


//Sub function for Delete deleteProjectDatafromSEO  Selected ID  from JSON file on Local Server
async function deleteSelectedDomainInfo(blogId) {

  try {
    const response = await fetch(`${appurl}/data/${blogId}`, {
      method: 'DELETE'
    });
    const isDeleteBlogID = await response.json();

  console.log('BlogID Deleted  successfully');

  return isDeleteBlogID.success;

  }  catch(error) {
  
    console.error('Error while deleting the Selected BlogID:', error);
   
    }

}

//Sub function to GET Project Settings from JSON file on Local Server
async function getProjectSettingsLocal() {


  sheetIDInput.style.display='none';
  
  seoStatusInput.style.display='none';


  try {
    // Retrieve the file content from the API
 const response = await fetch(`${appurl}/custom-settings`, {
   method: 'GET',
   headers: {
     'Content-Type': 'application/json'
   }
 });

 if (response.ok) {
 
   const data = await response.json();


 // Fill values in the Custom Setting Dialog
 fillCustomSettingDialogValues(data)
   
   createToast('SettingsToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', 'Settings has been loaded!');

   hideLoader(defaultLoaderId);
 }

   } catch (error) {
     console.error('Error retrieving settings:', error);
     createToast('SettingsToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Error retrieving settings from Local Server: ' + error);
     hideLoader(defaultLoaderId);
   }
}

//Sub function to GET Project Settings from JSON file on Local Server
async function updateProjectSettingsLocal(settingJSONData, calledfromSyncFunction=false) {

  try {
    const response = await fetch(`${appurl}/custom-settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settingJSONData)

    });

 if (response.ok) {


      // Try to hide when not called from AutoSync Function
if (!calledfromSyncFunction) {

  hideLoader(defaultLoaderId);

  closeDialog('customSettingDialog')

  createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', 'Settings has been loaded!');


  }

//call Google Api to Update Data on Google Server

 if (GAPIRequired) {       
// true for Local Call
  UpdateProjectSettingGAPI(settingJSONData, true) 
 }

 }

 hideLoader(defaultLoaderId);

 return true

   } catch (error) {
     console.error('Error retrieving settings:', error);
     createToast('bodyToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Error retrieving settings from Local Server: ' + error);
      hideLoader(defaultLoaderId)
   }
   
}


// Function to collect Unique Data
async function populateDialogWithUniqueDataSEO(method) {

  if (method.toUpperCase() === "GETDATA") {

  try {

    // For the future Updates
    // Step 1: Fetch data from the first API endpoint
    const apiResponse1 = await fetch(`${seourl}/all-projects`);
    const data1 = await apiResponse1.json();

    // Step 2: Fetch data from the second API endpoint
    const apiResponse2 = await fetch( `${appurl}/data`);
    const data2 = await apiResponse2.json();

    // Process data1 and data2 to create the desired response structure
    const articleCreatorProjects = [];
    const postUploaderProjects = [];
    const blogIdsArray = [];

    data1.result.forEach((project) => {
      if (project.type === "article creator") {
        // Check if the project name is not already in the array before adding it
        if (!articleCreatorProjects.some((item) => item[0] === project.name)) {
          articleCreatorProjects.push([project.name]);
        }
      } else if (project.type === "post uploader") {
        // Check if the project name and ID combination is not already in the array before adding it
        if (!postUploaderProjects.some((item) => item[1] === project.name && item[0] === project.id)) {
          postUploaderProjects.push([
            project.id,
            project.name,
          ]);
        }
      }
    });

    for (const key in data2) {
      if (data2.hasOwnProperty(key)) {
        const blogData = data2[key];
        // Check if the blog ID is not already in the array before adding it
        if (!blogIdsArray.some((item) => item[0] === blogData.id)) {
          blogIdsArray.push([blogData.id, blogData.url, blogData.username, blogData.password, blogData.group]);
        }
      }
    }

    const finalResponse = {
      success: true,
      uniqueData: {
        ProjectNames: articleCreatorProjects,
        PostUploaderIds: postUploaderProjects,
        BlogIds: blogIdsArray,
      }
    }
    ;


// Display the data in the console
console.log("Collecting API Data: " + finalResponse);
console.table(finalResponse);


const projectNames = finalResponse.uniqueData;
console.log("get UniqueData Log")
console.table(projectNames);


// Populate input elements i the dialog with the options obtained from the API response

hideLoader(defaultLoaderId)
 populateInputsFromUniqueData(projectNames, method);

  } catch (error) {
    console.error("Error processing data:", error);
     hideLoader(defaultLoaderId)
  }

  // Populate Dialog without Unique List
}  else {

  hideLoader(defaultLoaderId)
  populateInputsFromUniqueData(false, method);

}
}

// Function to Update Data on SEO and Make Google API call to update Same of Google Server

async function bulkUpdateDatatoSEO(dataArray, onlyUpdateBlogIs = false) {
  const results = [];

  try {

    const celIndexesToUpdate = [6, 7, 8]

    for (const data of dataArray) {
      const [creatorId, posterId, newBlogId, newUrl] = data;
      const result = { creatorId, success: false, message: '' };

      // Update Creator Project Data
      if (creatorId.length > 10) {
        try {
          const creatorProjectUrl = `${seoProjectsUrl}/data/${creatorId}`;
          const contentFilterArray = parseCommaSeparatedString(listofContentFilterInput.value);

          // Prepare request body
          const creatorJSON = JSON.stringify({
            articleJunkFilterFile: contentFilterArray,
            articleUseCategoryInsert: true,
            urlLimitResults: urlsDownloadResultLimitsInput.value,
            articleCountRequired: parseInt(articleCountInput.value),
            articleUseImages: useImagesInput.checked,
            jobCron: jobcronStringinput.value,
            imageInsert: {
              InsertAtStartOfBody: InsertAtStartOfBodyInput.checked,
              FrequencyFrom: parseInt(insertNoofImagesFROMInput.value),
              FrequencyTo: parseInt(insertNoofImagesTOInput.value),
              InsertType: imageInserTypeInput.value,
              UseBing: useBingImagesInput.checked,
              UseYoutube: useYoutubeThumbnailsInput.checked,
              UseCreativeCommons: useCreativeCommonsImagesInput.checked,
              UseBingCC: useBingCCImagesInput.checked,
              UseUnsplash: true,
              UsePixaBay: true,
              UsePexels: true,
            },
          });

          // Make POST request
          const resCreator = await fetch(creatorProjectUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: creatorJSON,
          });

          if (resCreator.ok) {

            console.log('Creator Project Part updated successfully.');
            result.success = true;
            result.message = 'Creator Project Part updated successfully.';
          } else {
            console.error("Error in updating data of Article Creator Project");
            result.message = 'Error in updating data of Article Creator Project: ';
          }
        } catch (error) {
          console.error("Error in updating data of Article Creator Project", error);
          result.message = 'Error in updating data of Article Creator Project: ' + error.message;
        }
      }

      if (posterId.length > 10) {
        // Update Post Data 
        const postUploaderURL = `${seoProjectsUrl}/data/${posterId}`;
        try {

          let  MainjsonData;

          if (!onlyUpdateBlogIs) {

            const updatedFolderPath = await getArticleCreatorPath(creatorId);

            // Object Based on Criteria 
         
            MainjsonData = {
              articleFolder: updatedFolderPath,
              postStartDate: posttodayDateInput.value,
              postUseToday: postUseTodayInput.checked,
              postIntervalFrom: parseInt(postIntervaldaysFROMInput.value),
              postIntervalTo: parseInt(postIntervaldaysTOInput.value),
              postsPerDay: parseInt(postsperDayInput.value),
              articleTitle: postarticleTitleInput.value,
            };


          } else if (onlyUpdateBlogIs && newBlogId) {
            MainjsonData = {
              blogIds: [newBlogId],
            };
          }

          // Make POST request
          const resPoster = await fetch(postUploaderURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(MainjsonData),
          });

          if (resPoster.ok) {

            const formattedDate = formatDate(posttodayDateInput.value, false);
            
            //  Values to Update
            const valuesToUpdate = [formattedDate, newBlogId, newUrl]
          
             updateRowCellsByValue('main', 0, creatorId, celIndexesToUpdate, valuesToUpdate)

            console.log("Post Uploader Part updated successfully.");
            result.success = true;
            result.message = "Post Uploader Part updated successfully.";
          } else {
            console.error("Error in updating Post Upload Data Project: ");
            result.message = "Error in updating Post Upload Data Project: ";
          }
        } catch (error) {
          console.error("Error in updating Post Upload Data Project: " + error);
          result.message = 'Error in updating Post Upload Data Project: ' + error.message;
        }
      }


      if (result.success && GAPIRequired) {
        // If success, push the required data for Google API
       

        let MainjsonData;
        const formattedDate = formatDate(posttodayDateInput.value, false);
       
       
       const commonData = {
          PostStartDate: formattedDate,
        };

        if (!onlyUpdateBlogIs) {
       MainjsonData = {
            ...commonData,
          };
       
        }

        else if (onlyUpdateBlogIs) {
          MainjsonData = {
            BlogId: newBlogId,
            url: newUrl,
            ...commonData,
          };
        }

        // Push data to Google API function
         // Update the Created Project Data back to Google Server from Local App.
         updateSelectedProjectDataGAPI(creatorId, MainjsonData, false , calledfromSyncFunction) 
  
      }

      createToast('WordpressToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', `Successfully updated to SEO ID ${creatorId}.`);

      results.push(result);
    }
    
  } catch (error) {
    console.error('Error while performing Bulk Update to Data :', error);
    return creatorId;
  }

 

  return results;
}


