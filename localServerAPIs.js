const seourl ='http://localhost:8008'
const apiurl = `${seourl}/project`
//Check the Server
async function testServer() {
    // showLoader();
    try {
      const response = await fetch(`${seourl}/test`, {
        method: 'GET'
      });
  
      const data = await response.json();
  
      console.log(data)

      if (data.success)  {
   
        // createToast('success', 'fa-solid fa-circle-check', 'Success', 'Logged In successfully.');
        // txttopTitle.textContent="SEO Content Machine Desktop App (Connected)"
       
      }
    } catch (error) {
        console.error(error)
        // createToast('error', 'fa-solid fa-circle-exclamation', 'error', 'Username or Password is invalid. error: '+error);
        // loginHeader.textContent="SEO Content Machine Desktop App (DIsconnected)"
        // hideLoader();
     
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
        const response = await fetch(`${apiurl}/data/${id}`);
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
  


  // Function to fetch and update data for different sections
async function fnarticleCreator(selectedRowId, method = 'GET') {
  
    // Declare input fields
  
  const articleProjectNameInput = document.getElementById('articleProjectName');
  const articleKeywordsFileInput = document.getElementById('articleKeywordsFile');
  const articleCategoriesInput = document.getElementById('articleCategories');
  const fetchdataurl =`${apiurl}/data/${selectedRowId}`
      
  try {

    if (method.toUpperCase() === 'GET') {
      // Make GET request
      const response = await fetch(fetchdataurl);
      const data = await response.json();
      const result = data.result;

     
      cnsarticleCreatorTitle.textContent = `Article Creator Details of ID: ${selectedRowId}`;


      // Update input fields with received values
      articleProjectNameInput.value = result.jobName;     
      
      articleKeywordsFileInput.value = Array.isArray(result.articleKeywordsFile)
        ? result.articleKeywordsFile.join(', ')
        : '';

      articleCategoriesInput.value = Array.isArray(result.categoryInsert.CategoryInsertFile)
        ? result.categoryInsert.CategoryInsertFile.join(', ')
        : '';
      

      jobid = result.chainJobId
    //   document.getElementById('inputchainJobId').value = jobid;


      cnspostUploaderTitle.textContent = `Post Uploader Details of ID: ${jobid}`;

      // Continue with the rest of your code for GET request
      // ...
    } else if (method.toUpperCase() === 'POST') {
      // Get values from input fields
      
      const articleProjectName = articleProjectNameInput.value;
      const articleKeywordsFile = articleKeywordsFileInput.value.split(',').map(keyword => keyword.trim());
      const articleCategories = articleCategoriesInput.value.split(',').map(category => category.trim());
      const CategoryInsertFile = articleCategoriesInput.value.split(',').map(keyword => keyword.trim());
            
      // Prepare request body
      const jsonData = JSON.stringify({
        jobName: articleProjectName,
        CategoryInsertFile,
        articleCategories,
        articleKeywordsFile,
        
      });

      // Make POST request
       await fetch(fetchdataurl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData
      });

        // Get the table element
        const table = document.getElementById('main');

        // Update the table cells with the variables if the row and cell exist
        const row = table.rows[selectedRowIndex];
        if (row) {
          const cell2 = row.cells[2];
          if (cell2) {
            cell2.textContent = articleProjectName;
          }

          const cell3 = row.cells[3];
          if (cell3) {
            cell3.textContent = CategoryInsertFile.join(', ');
          }

          const cell4 = row.cells[4];
          if (cell4) {
            cell4.textContent = articleKeywordsFile.join(', ');
          }
        }
              console.log('Article Creator Data has been saved!');

            } 

          }  catch (error) {
            console.error('Error fetching or posting data:', error);
          }
        }

// Function to fetch data for the Post Uploader section
async function fnPostUploader(chainJobId, method = 'GET') {

    const postJobNameInput = document.getElementById('postJobName');
    const postDateInput = document.getElementById('postDate');
    const postsPerDayInput = document.getElementById('postsPerDay');
    const postIntervalFromInput = document.getElementById('postIntervalFrom');
    const postIntervalToInput = document.getElementById('postIntervalTo');
    const articleTitleInput = document.getElementById('articleTitle');
 
   
  const fetchdataurl =`${apiurl}/data/${chainJobId}`

  //Get SEO Path to Pass to Folderpath 
  fetch(`${appurl}/SEOFolderPath`)
  .then(response => response.json())
  .then(data => {

    const soefolder =data.folderPath
    folderpath =`${soefolder}\\${selectedRowId}\\articles`;
    // const folderPath = data.folderPath;
  document.getElementById('articleFolder').value= folderpath;
   console.log("File path for the Artilce Creator is " + folderpath);
  })
  .catch(error => {
    console.error('Error retrieving folder path:', error);
    // Handle the error
  });

  try {
   
    if (method.toUpperCase() === 'GET') {
      const response = await fetch(fetchdataurl);
      const data = await response.json();
      const result = data.result;

      // Fill in the Post Uploader section
      postJobNameInput.value = result.jobName;

      const apiDate = result.postStartDate; // Example API date string

      if (apiDate) {

        const formattedDate = new Date(apiDate);
        formattedDate.setDate(formattedDate.getDate() + 1);
        const dateString = formattedDate.toISOString().split("T")[0];
        postDateInput.value = dateString;
      }


      postsPerDayInput.value = result.postsPerDay;
      postIntervalFromInput.value = result.postIntervalFrom;
      postIntervalToInput.value = result.postIntervalTo;
      articleTitleInput.value = result.articleTitle;
     
      blogsetID = Array.isArray(result.blogIds) ? result.blogIds.join(', ') : result.blogIds;

    // const blogIdInput = document.getElementById('blogIdinput');

      cnsblogSettingTitle.textContent = `Blog Setting details of ID: ${blogsetID}`;
      // blogIdInput.value = blogsetID;
      // Fill in more input fields for other properties as needed
    } else if (method.toUpperCase() === 'POST') {

      const postDateInput = document.getElementById('postDate');
      const currentDate = new Date(postDateInput.value);
      const formattedDate = currentDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      const jsonData = JSON.stringify({
        jobName: postJobNameInput.value,
        postStartDate: formattedDate,
        postsPerDay: postsPerDayInput.value,
        postIntervalFrom: postIntervalFromInput.value,
        postIntervalTo: postIntervalToInput.value,
        articleTitle: articleTitleInput.value,
        articleFolder: folderpath,
        // blogIds: blogIdInput.value.split(',').map(keyword => keyword.trim())

        // Include other  properties as needed
      });

       await fetch(fetchdataurl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData
      });

       // Get the table element
const table = document.getElementById('main');

// Update the table cells with the variables if the row and cell exist
const row = table.rows[selectedRowIndex];
if (row) {
  const cell2 = row.cells[6];
  if (cell2) {
    cell2.textContent = formattedDate;
  }

  const cell3 = row.cells[7];
  if (cell3) {
    cell3.textContent = postJobNameInput.value;
  }

}

     console.log('Post Uploader data has been Saved!')
    }
  } catch (error) {
    console.error('Error fetching or posting Post Uploader data:', error);
  }
}

const usernameInput = document.getElementById('blogUserName');
const passwordInput = document.getElementById('blogPassword');
const urlInput = document.getElementById('blogUrl');
const groupInput = document.getElementById('blogGroup');


// Function to fetch data for the Blog Setting section
async function fetchBlogJSONgData(id, method = 'GET') {
  
  try {
    const response = await fetch(`${appurl}/data/${id}`, {
        method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    // Fill in the Blog Setting section
    usernameInput.value = data.username;
    passwordInput.value = data.password;
    urlInput.value = data.url;
    groupInput.value = data.group;
    console.log('Blog data has been loaded')
    // Fill in more input fields for other properties as needed
  } catch (error) {
    console.error('Error fetching Blog Setting data:', error);
  }
}

async function JSONApi(ID = '', method = 'GET', dataToParse) {

console.log('ID from JSONApi Fucntion' +ID)
try {
    let url = `${appurl}/data`;
    let options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (ID) {
      url += `/${ID}`;
    }

    if (method === 'GET' && ID) {
      const response = await fetch(url, options);
      const responseData = await response.json();

      // Fill in the input elements with retrieved data
      usernameInput.value = responseData.username;
      passwordInput.value = responseData.password;
      urlInput.value = responseData.url;
      groupInput.value = responseData.group;
  
      return responseData;
    } else if (method === 'POST' || method === 'PUT') {

      // Get the table element
      const table = document.getElementById('main');
      // Update the table cells with the variables if the row and cell exist
      const row = table.rows[selectedRowIndex];

      addStatusUpdatedClass(row)

      if (row) {

        const cell2 = row.cells[10];
        if (cell2) {
          cell2.textContent = usernameInput.value;
        }
   
        const cell3 = row.cells[11];
        if (cell3) {
          cell3.textContent = passwordInput.value;
        }
   
        
        const cell4 = row.cells[12];
        if (cell4) {
          cell4.textContent =  urlInput.value;
        }
   
        const cell5 = row.cells[13];
        if (cell5) {
          cell5.textContent =groupInput.value;
        }
      }

      options.body = JSON.stringify(dataToParse);

      console.log(JSON.stringify(dataToParse))

      await fetch(url, options);

      return;

    } else if (method === 'DELETE') {

      const response = await fetch(url, options);
      if (response.ok) {
        // Delete successful (status code within 200 to 299 range)

        document.getElementById('main').deleteRow(selectedRowIndex);

      } 
    } else {
      throw new Error(`Invalid method: ${method}`);
      alert(Error)
    }
  } catch (error) {
    console.error('Error in JSONApi:', error);
    throw error;
  }
}

async function fetchAndPopulateDialog() {

  let hasArticleCreatorData = false;
  let hasPostUploaderData = false;
  let hasBlogSettingData = false;

  try {
   showLoader();

  if (sectiontoshow === 'AllDatatoshow') {
  
      //  Fetch data for Article Creator section
    await fnarticleCreator(selectedRowId, 'GET'); // Make GET request
    // Fetch data for Post Uploader section
    await fnPostUploader(jobid, 'GET')
    // Fetch data for Blog Setting section
 
    await JSONApi(blogsetID, 'GET');

      hasArticleCreatorData = true;
      hasPostUploaderData = true;
      hasBlogSettingData = true;

      DialogTitle.textContent = `Edit Project Data for ID: [ ${selectedRowId} ]`;

    
    }

 else if (sectiontoshow === 'articleCreator') {

    //  Fetch data for Article Creator section
    await fnarticleCreator(selectedRowId, 'GET'); // Make GET request
    
    DialogTitle.textContent = `Article Creator Data for ID: [ ${selectedRowId} ]`;


    hasArticleCreatorData = true;

  } else if (sectiontoshow === 'postuploader') {
   
     //  Fetch data for Article Creator section
     await fnPostUploader(selectedRowId, 'GET'); // Make GET request
    
     DialogTitle.textContent = `Post Uploader Data for ID: [ ${selectedRowId} ]`;

          hasPostUploaderData = true;
          // Handle the successful response data
     
  } else if (sectiontoshow === 'jsondata') {
     await JSONApi(selectedRowId, 'GET');

     DialogTitle.textContent = `Json File Data for ID: [ ${selectedRowId} ]`;

          hasBlogSettingData = true;
          // Handle the successful response data
          
    }

    const updateButton = document.getElementById('updatedata');

    if (sectiontoshow === 'AllDatatoshow') {
      // Show the "Update Data" button
      updateButton.style.display = 'flex';
    } else {
      // Hide the "Update Data" button
      updateButton.style.display = 'none';
    }
    
  setSectionVisibility(hasArticleCreatorData, hasPostUploaderData, hasBlogSettingData);
  Projectdialog.showModal();
  hideLoader();
  createToast('success', 'fa-solid fa-circle-check', 'Success', 'Data from SEO and custom API has been Retrieved!');

    } catch(error) {
      hideLoader();
      createToast('error', 'fa-solid fa-circle-exclamation', 'error', 'There is error while retrieving data from SEO and custom API! Error: ' + error);
    }
}

//Update the Data to SEO App

async function updateDataToApi() {

try {

showLoader();

await fnarticleCreator(selectedRowId, 'POST'); // Make GET request
await fnPostUploader(jobid, 'POST');
  
const username = document.getElementById('blogUserName').value;
const password = document.getElementById('blogPassword').value;
const url = document.getElementById('blogUrl').value;
const group = document.getElementById('blogGroup').value;

 const jsonData = { username, password, url, group };
 console.log(jsonData)

 await JSONApi(blogsetID, 'PUT', jsonData); 
 
  Projectdialog.close();

    hideLoader();
    // fetchAPI();
   
    createToast('success', 'fa-solid fa-circle-check', 'Success', 'Data has been Updated to SEO for Selected Project!');

  } catch(error) {
    
    createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is an error while savind data to files.');
    hideLoader();
  }
} 

  //Delete Selected Project
  async function deleteProjectData(selectedRowId) {
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
      deleteSeoProjects(selectedRowId)
  
      // Step 4: Delete chainJobId
      deleteSeoProjects(Postjobids)
  
      // Step 5: Delete blogIds
      JSONApi(blogsetID, 'DELETE');
  
      // alert('Data deleted successfully');
  
    } catch (error) {
      // alert('Error deleting data:', error.message);
    }
  }
  
  //Delete Selected ID Creator and Poster Project from SEO.
  function deleteSeoProjects(deleteid) {
    fetch(`${apiurl}/delete/${deleteid}`)
    // alert(`Deleted ID: ` +deleteid)
  }
  
  //Function to call Delete functions with related IDs
  function deleteUsingAPI(){
   try {
    showLoader();
    deleteProjectData(selectedRowId);
    createToast('success', 'fa-solid fa-circle-check', 'Success', 'Selected Project has been Deleted!');
      //Update the Table by Data
      // fetchAPI();
      
    hideLoader();
  } catch(error) {
    createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is some Error while deleting the Selected Project');
    hideLoader();
  }
   
  }
  
  function createnewJobID() {

  try {
  showLoader();
  // Call the function to complete all commands
  createProjects();


} catch(error) {
  createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is some error on the server');

}
  
  }
  
  // Function to complete all commands
  async function createProjects() {
    let settingdata;
    try {
      // Retrieve the file content from the API
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
  
      // Step 1: Create Article Creator
      const response1 = await fetch(`${seourl}/create/articlecreator`);
      const data1 = await response1.json();
      console.log(data1);
      const newArticleCreatorID = data1.result.id;

      console.log('New Article Creator ID:', newArticleCreatorID);
  
      // Step 2: Create Post Uploader
      const response2 = await fetch(`${seourl}/create/postuploader`);
      const data2 = await response2.json();
      const newPostUploaderID = data2.result.id;
      console.log('New Post Uploader ID:', newPostUploaderID);
  
      // Step 3: Create new Blog
      const response3 = await fetch(`${appurl}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const data3 = await response3.json();
      const newBlogID = data3.id;
      console.log('New Blog ID:', newBlogID);
  
      // Step 4: Update the newArticleCreatorID using POST Method
      await fetch(`${apiurl}/data/${newArticleCreatorID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chainJobId: newPostUploaderID,
          articleUseCategoryInsert:true,
          ListofContentFilter: settingdata.ArticleCreatorSettings.ListofContentFilter,
          URLsDownloadResultLimits: settingdata.ArticleCreatorSettings.URLsDownloadResultLimits,
          ArticleCount: settingdata.ArticleCreatorSettings.ArticleCount,
          InsertNoofImagesFROM: settingdata.ArticleCreatorSettings.InsertNoofImagesFROM,
          InsertNoofImagesTO:settingdata.ArticleCreatorSettings.InsertNoofImagesTO,
          UseImages: settingdata.ArticleCreatorSettings.UseImages,
          UseBingImages: settingdata.ArticleCreatorSettings.UseBingImages,
          UseYoutubeThumbnails: settingdata.ArticleCreatorSettings.UseYoutubeThumbnails,
          UseCreativeCommonsImages: settingdata.ArticleCreatorSettings.UseCreativeCommonsImages,
          UseBingCCImages: settingdata.ArticleCreatorSettings.UseBingCCImages,
        })
      });
  
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
      // Step 5: Get SEO Path to Pass to Folderpath
      const response4 = await fetch(`${appurl}/SEOFolderPath`);
      const data4 = await response4.json();
      const soefolder = data4.folderPath;
      const folderpath = `${soefolder}\\${newArticleCreatorID}\\articles`;
  
      // Step 6: Update the newBlogID using POST Method
      await fetch(`${apiurl}/data/${newPostUploaderID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          blogIds: [newBlogID],
          postUseToday: settingdata.PostUploaderSettings.postUseToday,
          postStartDate: formattedDate,
          articleFolder: folderpath,
          articleTitle: settingdata.PostUploaderSettings.postarticleTitle,
          postsPerDay: parseInt(settingdata.PostUploaderSettings.PostsperDay),
          postIntervalFrom: parseInt(settingdata.PostUploaderSettings.PostIntervaldaysFROM),
          postIntervalTo: settingdata.PostUploaderSettings.PostIntervaldaysTO,
        })
      });

      // alert('New Article Creator ID: ' + newArticleCreatorID + ' New Post Uploader ID: ' + newPostUploaderID + ' New Blog ID: ' + newBlogID);
      hideLoader();

      createToast('success', 'fa-solid fa-circle-check', 'Success', 'New Article Creator Project with ID:' + newArticleCreatorID + 'has been created,  New Post Uploader with ID: ' + newPostUploaderID + ' has been created, New Blog with ID: ' + newBlogID + ' has been created!');


//Update the Variables to newly created Project IDs
      selectedRowId =newArticleCreatorID;
      jobid = newPostUploaderID;
      blogsetID = newBlogID;

      document.getElementById('main').insertRow(selectedRowIndex);
      const table = document.getElementById('main');
      // Create a new row element
      const newRow = table.insertRow(2); // Index 2, meaning it will be inserted as the third row (0-indexed)

      for (let i = 0; i < 11; i++) {
        const cell = newRow.insertCell(i);
        cell.textContent = '';
      }

      const newRowIdx = newRow.rowIndex;

      selectedRowIndex=newRowIdx;

      // Create cells and set their content
      const cell1 = newRow.insertCell(0); // Index 0, first cell in the new row
      cell1.textContent = selectedRowId;
      const span1 = document.createElement('span');

      span1.className = 'status-pill status-draft';
      span1.textContent = 'draft';
      newRow.cells[1].appendChild(span1);

      const cell2 = newRow.insertCell(5);
      cell2.textContent = jobid;

      const span2 = document.createElement('span');
      span2.className = 'status-pill status-draft';
      span2.textContent = 'draft';
      newRow.cells[8].appendChild(span2);

      const cell3 = newRow.insertCell(9); // Index 2, third cell in the new row
      cell3.textContent = blogsetID;

      // document.getElementById('main').rows[rowIndex]?.cells[2]?.textContent = articleProjectName;

      // Fetch data for Article Creator section
      await fnarticleCreator(selectedRowId, 'GET'); // Make GET request

      // Fetch data for Post Uploader section
      await fnPostUploader(jobid, 'GET')

      // Fetch data for Blog Setting section
      await JSONApi(blogsetID, 'GET');

      // Show the Projectdialog
      Projectdialog.showModal();
      // closeButton.focus();

      //Update the Table by Data
      //  fetchAPI();
      } 
        catch (error) {
        console.error('Error retrieving settings:', error);
        createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is error while fetching data from SEO Server: ' + error);

}
}
  


// Function to populate the dialog with retrieved settings data
async function populateSettingsDialog() {
   
      // Retrieve the file content from the API
      const response = await fetch(`${appurl}/custom-settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

    
}



 // Send the updated settings to the server
 const response = await fetch(`${appurl}/custom-settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedSettings)
  });
