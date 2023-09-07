// Functions for get GOogle Sheet New Data and updated DATA



//Check the Server
async function testServer() {
    showLoader();
    try {
      const response = await fetch(`${seourl}/test`, {
        method: 'GET'
      });
  
      const data = await response.json();
  
      console.log(data)

      if (data.success)  {
   
        createToast('success', 'fa-solid fa-circle-check', 'Success', 'Logged In successfully.');
        txttopTitle.textContent="SEO Content Machine Desktop App (Connected)"
       
      }
    } catch (error) {
        console.error(error)
        createToast('error', 'fa-solid fa-circle-exclamation', 'error', 'Username or Password is invalid. error: '+error);
        loginHeader.textContent="SEO Content Machine Desktop App (DIsconnected)"
        hideLoader();
     
    }
  }
  

  //Main DashBoard Function to Create Dashboard.
async function fetchAllLocalProjects() {
//    showLoader()
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
        const response = await fetch(`${seoProjectsUrl}/data/${id}`);
        const projectData = await response.json();

        const {
          jobName,
          // articleCategories,
          // categoryInsertFile,
        //   articleKeywordsFile,
          chainJobId,
        } = projectData.result;

        // const categoryInsertFile = projectData.result.categoryInsert.CategoryInsertFile;

        formattedData[id] = {
          ...formattedData[id],
          articleProjectName: jobName,
          // articleCategories,
        //   categoryInsertFile,
        //   articleKeywordsFile,
          postProjectId: chainJobId,
        };
      });

      // Wait for all promises to resolve
      await Promise.all(projectPromises);

      // Task 3: Fetch more data based on chainJobId and update the object
      const chainJobPromises = Object.values(formattedData).map(async (project) => {
        if (project.postProjectId) {
          const response = await fetch(
            `${seoProjectsUrl}/data/${project.postProjectId}`
          );
          const chainJobData = await response.json();

          const { jobName, blogIds, postStartDate } = chainJobData.result;
          

          if (postStartDate) {
            const formattedDate = new Date(postStartDate);
            formattedDate.setDate(formattedDate.getDate() + 1);
            dateString = formattedDate.toISOString().split("T")[0];
          }

          formattedData[project.projectId] = {
            ...formattedData[project.projectId],
            postDate: dateString,
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
            `${seoProjectsUrl}/status/${project.postProjectId}`
          );
          const statusData = await response.json();
          project.postUploaderStatus = statusData.result[0].status;
        }
      });

      // Wait for all promises to resolve
      await Promise.all(statusPromises);

    //   // Task 5: Make a request to the server-side function to get data for the specified ID
    //   const fetchDataById = async (id) => {
    //     const response = await fetch(`${appurl}/data/${id}`, {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       }
    //     });
    //     return response.json();
    //   };

    //   // Collect all promises for fetching data by ID
    //   const fetchPromises = Object.values(formattedData).map(async (project) => {
    //     const blogId = project.blogId;
    //     if (blogId) {
    //       const data = await fetchDataById(blogId);
    //       const { id, username, password, url, group } = data;
    //       formattedData[project.projectId] = {
    //         ...formattedData[project.projectId],
    //         blogPostId: id,
    //         blogUserName: username,
    //         blogPassword: password,
    //         blogUrl: url,
    //         blogGroup: group,
    //       };
    //     }
    //   });

    //   // Wait for all promises to resolve
    //   await Promise.all(fetchPromises);

      // Task 6: Generate the table based on the final formattedData object
    //   createTableFromData(formattedData);



    const reorderedData = Object.values(formattedData).map((project) => ({
        index: project.projectId, // Add other keys as needed
        projectId: project.projectId,
        articleStatus: project.articleStatus,
        articleProjectName: project.articleProjectName,
        postProjectId: project.postProjectId,
        PostJobName: project.PostJobName,
        postUploaderStatus: project.postUploaderStatus,
        postStartDate: project.postDate,
        blogId: project.blogId,
      }));
      console.table(reorderedData);

      return reorderedData;
        })
        .catch((error) => {
          console.error(error);
        //       // Call createToast function after error
        // let type = 'error';
        // let icon = 'fa-solid fa-circle-exclamation';
        // let title = 'Error';
        // let text = 'An error occurred while fetching projects from Local Server.';
        // createToast(type, icon, title, text);
        // hideLoader();
          
        });
    
    }
  


    //Function to show Aricle Creator Projects fro Local Server
  async function LocalCreatorProjects() {
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
          const response = await fetch(`${seoProjectsUrl}/data/${id}`);
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

        return formattedData;
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
async function LocalPostUploaderProjects() {

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
           const response = await fetch(`${seoProjectsUrl}/data/${id}`);
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
        return formattedData;
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
async function LocalReadJsonFile() {

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
     return formattedData;
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
async function LocalProjectsbyStatus(articleStatus) {
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
      return statusCounts; // Return the statusCounts object
    });
  }
  
  //Data All  collected Data from Local Server. 

  async function GetSelectedProject(selectedRowId) {
    try {
      const data = {};
  
      // Fetch data from the first API endpoint
      const response1 = await fetch(`${seoProjectsUrl}/data/${selectedRowId}`);
      const data1 = await response1.json();
      const result1 = data1.result;
  
      data.ProjectID = result1.jobName;
      data.ProjectName = result1.jobName;
      data.ProjectCreatorStatus = result1.jobName;
      data.ProjectKeyowrds = Array.isArray(result1.articleKeywordsFile)
        ? result1.articleKeywordsFile.join(', ')
        : '';
      data.ProjectCatagories = Array.isArray(result1.categoryInsert.CategoryInsertFile)
        ? result1.categoryInsert.CategoryInsertFile.join(', ')
        : '';
      data.chainJobId = result1.chainJobId;

      jobid =result1.chainJobId;
  
      // Fetch data from the second API endpoint
      const response2 = await fetch(`${seoProjectsUrl}/data/${chainJobId}`);
      const data2 = await response2.json();
      const result2 = data2.result;
  
      data.PostUploaderId = result2.jobName;
      data.PostUploaderName = result2.jobName;
      data.PostUploaderStatus = result2.jobName;
      data.PostStartDate = new Date(result2.postStartDate);
      data.blogIds = Array.isArray(result2.blogIds) ? result2.blogIds.join(', ') : '';

      // Assign BlogIDs 
      blogsetID= data.blogIds;
  
      // Fetch data from the third API endpoint
      const response3 = await fetch(`${appurl}/data/${blogIds}`, {
        method: 'GET',
      });
      const data3 = await response3.json();
  
      data.username = data3.username;
      data.password = data3.password;
      data.url = data3.url;
      data.group = data3.group;
  
    // Log the resulting data as a JSON table
    console.table(data);

    return { success: true, data };
    } catch (error) {
      console.error('Error fetching or posting data:', error);
    
      // Return an error indicator with a message
      return { success: false, message: 'There is some error while collecting the data.' };
  
    }
  }


  async function updateDatatoSEO(selectedRowId, chainJobId, id,  JSONData) {

    let isupdatedDatatoSEO =false;

    const creatorProjectUrl =`${seoProjectsUrl}/data/${selectedRowId}`

      // Article Creator Project Update Part
    try {
         // Prepare request body
     const creatorJSON = JSON.stringify({
      jobName: JSONData[0].ProjectName,
      CategoryInsertFile : JSONData[0].ProjectCatagories,
      articleCategories : JSONData[0].ProjectCatagories,
      articleKeywordsFile: JSONData[0].ProjectKeyowrds,
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
      createToast('success', 'fa-solid fa-circle-check', 'Success', 'Creator Project Part updated succesfully.');
    
    }

  } catch (error) {
    isupdatedDatatoSEO=false;
    console.error('Error in Creator Project Update data:', error);
  
  }

// Get Folder Path of the Article Creator from Local Host


try {

  const postUploaderURL =`${appurl}/SEOFolderPath`

const response1 = await fetch(postUploaderURL);
  const data1 = await response1.json();
  const result1 = data1.result;

  const soefolder =result1.folderPath
  folderpath =`${soefolder}\\${selectedRowId}\\articles`;
 
 console.log("File path for the Artilce Creator is " + folderpath);
 isupdatedDatatoSEO=true;
} catch(error){
  console.error('Error retrieving folder path from LOCAL API:', error);
  // Handle the error
};

  // Post Uploader Project Update Part

  try {

const postUploaderURL =`${seoProjectsUrl}/data/${chainJobId}`

const PosterjsonData = JSON.stringify({
        jobName: JSONData[0].PostUploaderName,
        postStartDate: JSONData[0].PostStartDate,
        articleFolder: folderpath,
  
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
    createToast('success', 'fa-solid fa-circle-check', 'Success', 'Post Uploader Part updated succesfully.');
   
  }
  

 } catch (error) {
  isupdatedDatatoSEO=false;
  createToast('error', 'fa-solid fa-circle-exclamation', 'error', 'There is error while Updating data to JSON Api: ' + error);

   console.error('Error in Creator Project Update data:', error);

 
 }


//  Update JSON Data using LOCAL HOST

try {

  const blogIDURL = `${appurl}/data/${id}`
  
  const bloJSONData = {
    username : JSONData[0].username,
     password : JSONData[0].password, 
      url : JSONData[0].url,
      group : JSONData[0].group
   };

   const ResJSON=  await fetch(blogIDURL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bloJSONData
  });
  
  if (ResJSON.ok) {
    isupdatedDatatoSEO=true;
    createToast('success', 'fa-solid fa-circle-check', 'Success', 'Creator Project Part updated succesfully.');
   
  }
  
  
   } catch (error) {

    isupdatedDatatoSEO=false;
    createToast('error', 'fa-solid fa-circle-exclamation', 'error', 'There is error while Updating data to JSON Api: ' + error);

     console.error('Error while updating JSON API  data:', error);
   
   }

   return isupdatedDatatoSEO;

  }

 
   // Function to complete all commands
   async function createProjectsONSEO(JSONData) {
    let settingdata;
    let isProjectCreated = false;

    // Step 0 Get Custom Setting Dialog from LOCAL Host
    
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
        console.error('Error retrieving settings:', response.statusText);
      }
  
      // Step 1: Create Article Creator and Get ID.
      const response1 = await fetch(`${seourl}/create/articlecreator`);

      const data1 = await response1.json();
      console.log(data1);
      const newArticleCreatorID = data1.result.id;

      isProjectCreated = true;

      console.log('New Article Creator ID:', newArticleCreatorID);
  
      // Step 2: Create Post Uploader and Get Post ID.
      const response2 = await fetch(`${seourl}/create/postuploader`);
      const data2 = await response2.json();
      const newPostUploaderID = data2.result.id;
      console.log('New Post Uploader ID:', newPostUploaderID);
  

      isProjectCreated = true;

      // Step 3: Create new Blog and BLogID from LOCAL Host
      const response3 = await fetch(`${appurl}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const data3 = await response3.json();
      const newBlogID = data3.id;
      console.log('New Blog ID:', newBlogID);
  
      isProjectCreated = true;

      // Step 4: Update the newArticleCreatorID using POST Method
      await fetch(`${apiurl}/data/${newArticleCreatorID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          chainJobId: newPostUploaderID,
          articleUseCategoryInsert:true,
          jobName: JSONData[0].ProjectName,
          CategoryInsertFile : JSONData[0].ProjectCatagories,
          articleCategories : JSONData[0].ProjectCatagories,
          articleKeywordsFile: JSONData[0].ProjectKeyowrds,
          ListofContentFilter: [settingdata.ListofContentFilter],
          URLsDownloadResultLimits: settingdata.URLsDownloadResultLimits,
          ArticleCount: settingdata[0].ArticleCount,
          InsertNoofImagesFROM: settingdata[0].InsertNoofImagesFROM,
          InsertNoofImagesTO:settingdata[0].InsertNoofImagesTO,
          UseImages: settingdata[0].UseImages,
          UseImages: settingdata[0].UseImages,
          InsertAtStartOfBody: settingdata[0].InsertAtStartOfBody,
          UseBingImages: settingdata[0].UseBingImages,
          UseYoutubeThumbnails: settingdata[0].UseYoutubeThumbnails,
          UseCreativeCommonsImages: settingdata[0].UseCreativeCommonsImages,
          UseBingCCImages: settingdata[0].UseBingCCImages,

        })
      });
  
      isProjectCreated = true;

      const currentDate = new Date(JSONData[0].PostStartDate);
      const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
      // Step 5: Get SEO Path to Pass to Folderpath
      const response4 = await fetch(`${appurl}/SEOFolderPath`);
      const data4 = await response4.json();
      const soefolder = data4.folderPath;
      const folderpath = `${soefolder}\\${newArticleCreatorID}\\articles`;
      
      isProjectCreated = true;

      // Step 6: Update the newBlogID using POST Method
      await fetch(`${apiurl}/data/${newPostUploaderID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          blogIds: [newBlogID],
          jobName: JSONData[0].PostUploaderName,
          postStartDate: formattedDate,
          postUseToday  :settingdata[0].postUseToday,
          PostsperDay : parseInt(settingdata[0].PostsperDay),
          postIntervalFrom : parseInt(settingdata[0].PostIntervaldaysFROM),
          postIntervalTo : parseInt(settingdata[0].PostIntervaldaysTO),
          articleTitle: settingdata[0].postarticleTitle,
          articleFolder: folderpath,
        })
      });

      isProjectCreated = true;

      // Step 6: Update the newBlogID using POST Method

      const blogIDURL = `${appurl}/data/${newBlogID}`
  
     const bloJSONData = {
    username : JSONData[0].username,
     password : JSONData[0].password, 
      url : JSONData[0].url,
      group : JSONData[0].group
   };

   const ResJSON=  await fetch(blogIDURL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bloJSONData
  });
  
  if (ResJSON.ok) {
    isProjectCreated=true;  
  }

      // alert('New Article Creator ID: ' + newArticleCreatorID + ' New Post Uploader ID: ' + newPostUploaderID + ' New Blog ID: ' + newBlogID);
      hideLoader();

      createToast('success', 'fa-solid fa-circle-check', 'Success', 'New Article Creator Project with ID:' + newArticleCreatorID + 'has been created,  New Post Uploader with ID: ' + newPostUploaderID + ' has been created, New Blog with ID: ' + newBlogID + ' has been created!');

     //Update the Variables to newly created Project IDs

      return {success: isProjectCreated, ProjectID:newArticleCreatorID, PostUploaderId: newPostUploaderID, BlogId:  newBlogID}     
      } 
        catch (error) {
          isProjectCreated = false;
        console.error('Error retrieving settings:', error);
        createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is error while fetching data from SEO Server: ' + error);
        return isProjectCreated
}
}


//Delete Selected Project
async function deleteProjectDatafromSEO(selectedRowId) {

  let isProjectsDeleted=false;
  try {

    console.log(apiurl)

    //Step 1 get ChainJob ID
    const response = await fetch(`${apiurl}/data/${selectedRowId}`);
    const data = await response.json();
    const result = data.result;

    const Postjobids = result.chainJobId;

    console.log(Postjobids)

    //Step 2 Get BlogID
    const response2 = await fetch(`${apiurl}/data/${Postjobids}`);
    const data2 = await response2.json();
    const result2 = data2.result;

    const blogsetID = Array.isArray(result2.blogIds) ? result2.blogIds.join(', ') : result2.blogIds;
  
    console.log(blogsetID)

    // Step 3: Delete selected RowId of Creator
    isProjectsDeleted =  await deleteSeoProjects(selectedRowId)

    // Step 4: Delete chainJobId
    isProjectsDeleted = await  deleteSeoProjects(Postjobids)


    // Step 5: Delete blogIds
    isProjectsDeleted = await deleteJSOApi(blogsetID);

    if (isProjectsDeleted) {
      return isProjectsDeleted=true;
    } else {

      return isProjectsDeleted=false;
    }


  } catch (error) {
  
    console.error('Error retrieving settings:', error);
    createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is some Error while deleting from SEO Server error: '+ error + " Project ID: " + deleteid);
    hideLoader();
    return isProjectsDeleted=false;
  }
}

//Delete Selected ID Creator and Poster Project from SEO.
async function deleteSeoProjects(deleteid) {
  let deletedSEOProjects=false;

 try {

const response =  fetch(`${apiurl}/delete/${deleteid}`)

if (response.ok) {
  data = await response.json();
  console.table(data);
  deletedSEOProjects=true;
 return deletedSEOProjects;

} else {

  console.error('Error retrieving settings:', error);
  createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is some Error while deleting from SEO Server error: '+ error + " Project ID: " + deleteid);
  hideLoader();
  
  deletedSEOProjects=false;
  return deletedSEOProjects;
 
}

 } 
 catch(error) {
  createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is some Error while deleting the Projects from SEO ID : ' + deleteid) + "Error : " +error ;
  hideLoader();
 
  deletedSEOProjects=false;
  return deletedSEOProjects;
   
  }
 
}

//Delete Data from JSON File
async function deleteJSOApi(ID) {

 let  JSONDelete =false;

  try {
    
    const response = await fetch(`${appurl}/data/${ID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      settingdata = await response.json();
      console.table(settingdata);
      JSONDelete =true;
     return JSONDelete;
    } else {

      console.error('Error retrieving settings:', response.statusText);
      createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is some Error while deleting JSON Data: '+ response.statusText);
      hideLoader();
      JSONDelete =false;
      return JSONDelete;
     
    }

  }  catch(error) {
    createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is some Error while deleting JSON Data Error: '+ error );
    hideLoader();
    JSONDelete =false;
    return JSONDelete;
     
    }

}

//Function to call Delete functions with related IDs
function deleteUsingAPI(){
 try {
  showLoader();
  deleteProjectData(selectedRowId);

  document.getElementById('main').deleteRow(selectedRowIndex);

  createToast('success', 'fa-solid fa-circle-check', 'Success', 'Selected Project has been Deleted!');
    //Update the Table by Data
    // fetchAPI();
    
  hideLoader();
} catch(error) {
  createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is some Error while deleting the Selected Project');
  hideLoader();
}
 
}





  