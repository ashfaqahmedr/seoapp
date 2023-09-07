
//count Total Records
let totalRecords = 0
// Store the selected row ID
let selectedRowId = null;
let selectedRowIndex =null;
let jobid =null;
let blogsetID=null;
let folderpath=null;
let sectiontoshow = null;
let titleID = null;
let confirmDialogUse = false;

const seourl ='http://localhost:8008'
const apiurl = `${seourl}/project`

const appurl ='http://localhost:3000'

//Load the Events on Load

//Check the Server
async function testServer() {
  try {
    const response = await fetch(`${seourl}/test`, {
      method: 'GET'
    });

    const data = await response.json();

    if (data.success)  {
      updateHeader(data.success);
    }
  } catch (error) {
    console.error('Error:', error);
    updateHeader(false);
  }
}


window.onload = async () =>{


  document.getElementById('popupContainer').style.display = 'none';

  testServer();
  
  const sidebar = document.querySelector(".sidebar");
  const closeBtn = document.querySelector("#btn");
  
  closeBtn.addEventListener("click", function(){
      sidebar.classList.toggle("open");
      menuBtnChange();

  
  });
  
  
  sidebar.classList.toggle("open");
  //Call Main Function to Fetch  the Data
  fetchAPI();
   // Activate the "Dashboard" link on page load
   var dashboardLink = document.getElementById('dashboard-link');
   dashboardLink.classList.add('active');
  // toggleSidebar();
  
  //Call Active Element Click
  ActivateElementClick();

  //Show Toast after table Loading
  createToast('success', 'fa-solid fa-circle-check', 'Success', 'Fetching projects completed successfully.');
  startMonitoring();
  
  }


  // Function to toggle the visibility of the notification panel
const toggleNotificationPanel = () => {
  const popupContainer = document.getElementById('popupContainer');
  if (popupContainer.style.display === 'none') {
    // Show the notification panel
    popupContainer.style.display = 'block';
  } else {
    // Hide the notification panel
    popupContainer.style.display = 'none';
  }
};

  
  function ActivateElementClick () {
    // Get all sidebar links
    const sidebarLinks = document.querySelectorAll('.nav-list li a');
    
    // Add click event listener to each sidebar link
    sidebarLinks.forEach((link) => {
      link.addEventListener('click', function (event) {
        // Remove active class from all links
        sidebarLinks.forEach((link) => {
          link.classList.remove('active');
        });
    
        // Add active class to the clicked link
        this.classList.add('active');
      });
    });
    }

    //Update the Header based on Result
function updateHeader(status) {
  const headerElement = document.getElementById('header');
  if (status) {
    // console.log(true)
    headerElement.classList.remove('disconnected');
    headerElement.classList.add('connected');
    headerElement.innerText = 'SEO Content Machine Web App (Connected)';
    const linkcontainer = document.getElementById('LinkHost');
    linkcontainer.innerHTML=""
    const link = document.createElement('a');
    link.href=`${seourl}/`
    link.textContent="SEO API"
    link.target="_blank"
    linkcontainer.appendChild(link)
    // headerElement.appendChild(linkcontainer)
  } 
  
  else  {
    headerElement.classList.remove('connected');
    headerElement.classList.add('disconnected');
    headerElement.innerText = 'SEO Content Machine Web App (Cannot Connect)';
  }
  
  }

  function menuBtnChange(){
      if(sidebar.classList.contains("open")){
          closeBtn.classList.replace("bx-menu","bx-menu-alt-right");
      }else{
          closeBtn.classList.replace("bx-menu-alt-right","bx-menu");
      }
  }
  

// Create Table from Code
function createTableFromData(data) {
  if (!data || typeof data !== 'object') {
    console.error('Invalid data. Cannot create table.');
        // Call createToast function after error
        let type = 'error';
        let icon = 'fa-solid fa-circle-exclamation';
        let title = 'Error';
        let text = 'Invalid data. Cannot create table.';
        createToast(type, icon, title, text);
    return;
  }
  const table = document.getElementById('main');
  table.innerHTML=''
  // Create the table headers
  const headers = Object.keys(data[Object.keys(data)[0]]);

  const tableHeader = document.createElement('tr');

  headers.forEach((header) => {
    if (header !== 'blogId') {
      // Exclude 'blogId' header
      const th = document.createElement('th');
      const ColHeaderspan = document.createElement('span');
      th.textContent = header.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
      ColHeaderspan.classList.add('icon-arrow');
      ColHeaderspan.innerHTML = '&UpArrow;';
      th.appendChild(ColHeaderspan);
      tableHeader.appendChild(th);
    }
  });

  table.appendChild(tableHeader);
  const ColHeader = document.createElement('thead');
  ColHeader.appendChild(tableHeader);
  table.appendChild(ColHeader);

  const tableBody = document.createElement('tbody');

  // Create the table rows
  Object.values(data).forEach((rowData) => {
    const row = document.createElement('tr');
    headers.forEach((header) => {
      if (header !== 'blogId') {
        // Exclude 'blogId' value
        const td = document.createElement('td');
        const value = rowData[header];

        if (Array.isArray(value)) {
          td.textContent = value.join(', ');
        } else {
          td.textContent = value !== undefined ? value : '';
        }
        row.appendChild(td);
      }
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);


//Search by Search Text
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    searchTable(searchTerm);
  });

  //Filter by Status Text
  const tableFilter = document.getElementById('table-filter');
  tableFilter.addEventListener('change', () => {
    const selectedValue = tableFilter.value;
    searchTable(selectedValue);
  });


  function searchTable(searchData) {
    let visibleCount = 0; // Variable to store the count of visible records
  
    tableRows.forEach((row, i) => {
      let tableData = row.textContent.toLowerCase();
  
      const isRowVisible = tableData.indexOf(searchData) >= 0;
      row.classList.toggle('hide', !isRowVisible);
      row.style.setProperty('--delay', isRowVisible ? visibleCount / 25 + 's' : '0s'); // Delay animation only for visible rows
  
      if (isRowVisible) {
        visibleCount++;
      }
    });
  
    const showingText = `Showing ${visibleCount} of ${totalRecords} record(s)`;
    recordCountElement.textContent = showingText;
  
    document.querySelectorAll('tbody tr:not(.hide)').forEach((visibleRow, i) => {
      visibleRow.style.backgroundColor = i % 2 == 0 ? 'transparent' : '#0000000b';
    });
  }

  sortTable(0, true);

  const tableHeadings = document.querySelectorAll('thead th');
  const tableRows = document.querySelectorAll('tbody tr');

  tableHeadings.forEach((head, i) => {
    let sortAsc = true;
    head.onclick = () => {
      tableHeadings.forEach((head) => head.classList.remove('active'));
      head.classList.add('active');
      document.querySelectorAll('td').forEach((td) => td.classList.remove('active'));
      tableRows.forEach((row) => {
        row.querySelectorAll('td')[i].classList.add('active');
      });

      head.classList.toggle('asc', sortAsc);
      sortAsc = head.classList.contains('asc') ? false : true;
      sortTable(i, sortAsc);
    };

    tableRows.forEach((row) => {
      row.querySelectorAll('td')[0].classList.add('active');
      tableHeadings[0].classList.add('active');
      tableHeadings[0].classList.toggle('asc', sortAsc);
    });
  });

  totalRecords = Object.values(data).length;

  const recordCountElement = document.getElementById('recordCount');
  recordCountElement.textContent = `Showing ${totalRecords} of ${totalRecords} record(s)`;

  //Apply conditional Formatting
  applyConditionalFormatting()

  //update counts.
  updateStatusCounts();

  //Custom Right Click Menu
  enableCustomContextMenu("#main tbody", ".wrapper");

  hideLoader();


  console.log("Inside the Table Scrope: "+ totalRecords)
 
}

// Function to sort the table
function sortTable(column, sort_asc) {
  const table_rows = document.querySelectorAll('tbody tr');

  [...table_rows].sort((a, b) => {
    let first_row = a.querySelectorAll('td')[column].textContent.toLowerCase();
    let second_row = b.querySelectorAll('td')[column].textContent.toLowerCase();

    return sort_asc ? (first_row < second_row ? 1 : -1) : first_row < second_row ? -1 : 1;
  }).map(sorted_row => document.querySelector('tbody').appendChild(sorted_row));
}

//Apply status Classes

function applyConditionalFormatting() {
  const table = document.getElementById('main');
  const rows = table.getElementsByTagName('tr');

  const statusColumnIndices = [];
  const headerRow = rows[0]; // Header row is at index 0

  // Find all the column indices of the "Status" columns in the header row
  const headerCells = headerRow.getElementsByTagName('th');
  for (let j = 0; j < headerCells.length; j++) {
    const headerCell = headerCells[j];
    const headerValue = headerCell.textContent.trim();

    if (headerValue.includes('Status')) {
      statusColumnIndices.push(j);
    }
  }

  if (statusColumnIndices.length === 0) {
    console.error('Status column not found in the header.');
    return;
  }

  // Apply conditional formatting based on cell value in the "Status" columns
  for (let i = 1; i < rows.length; i++) { // Start from index 1 to ignore header row
    const cells = rows[i].getElementsByTagName('td');

    // Loop through each status column and apply the span
    statusColumnIndices.forEach(statusColumnIndex => {
      const cell = cells[statusColumnIndex];
      const value = cell.textContent.trim().toLowerCase();

      const statusSpan = document.createElement('span');
      statusSpan.classList.add('status-pill');

      if (value === '') {
        statusSpan.classList.add('status-draft');
      } else {
        // Remove trailing "..." from the status
        const cleanedStatus = removeTrailingDots(value);
        statusSpan.classList.add(`status-${cleanedStatus.toLowerCase()}`);
      }

      statusSpan.textContent = value;

      // Clear the existing content of the cell
      cell.innerHTML = '';

      // Append the status span to the cell
      cell.appendChild(statusSpan);

      // Apply border radius to cells
      cell.style.borderRadius = '5px';
      cell.style.width = '100%';
    });
  }
}



//Loadoverlay Div
const loadingOverlay = document.getElementById('loadingOverlay');
// Function to show the loader
function showLoader() {
  // alert('Loader')
  document.body.style.cursor = 'none';
  loadingOverlay.style.display = 'flex';
}

// Function to hide the loader
function hideLoader() {
  document.body.style.cursor = 'auto';
  loadingOverlay.style.display = 'none';
}


// Get the table and context menu elements
const table = document.getElementById('main');
const contextMenu = document.querySelector('.menu');

   // Get the dialog element and its content areas
const Projectdialog = document.getElementById('myDialog');

const closeButton = document.getElementById('closeDialogButton');

const updateButton = document.getElementById('updateDataButton');

// // Get the input elements
const articleProjectNameInput = document.getElementById('articleProjectName');
const postJobNameInput = document.getElementById('postJobName');
const blogUrlInput = document.getElementById('blogUrl');

// Add event listeners to the articleProjectNameInput
articleProjectNameInput.addEventListener('input', updateInputs);
articleProjectNameInput.addEventListener('transitionend', removeTransition);


// Function to update the inputs
function updateInputs() {
  articleProjectNameInput.classList.add('transition');
  const value = this.value;

  // Update the postJobNameInput value
  const postJobNameValue = value + ' (U)';
  if (postJobNameInput.value !== postJobNameValue) {
    postJobNameInput.value = postJobNameValue;
    postJobNameInput.classList.add('transition');
  }

  // Update the blogUrlInput value
  const blogUrlValue = `https://${value}/`;
  if (blogUrlInput.value !== blogUrlValue) {
    blogUrlInput.value = blogUrlValue;
    blogUrlInput.classList.add('transition');
    
  }

  // Add the transition class for visual effect
  articleProjectNameInput.classList.add('transition');


}

// Function to remove the transition class after the transition ends
function removeTransition(event) {
  if (event.propertyName !== 'background-color') return;
  articleProjectNameInput.classList.remove('transition');
  this.classList.remove('transition');
  
}

const DialogTitle =  document.getElementById('dialogTitle')
    
const cnsarticleCreatorTitle = document.getElementById("articlecreator");
const cnsarticleCreatorSection = document.getElementById("articleCreatorSection")

const cnspostUploaderTitle = document.getElementById("postuploader");
const cnspostUploaderSection = document.getElementById("postUploaderSection");

const cnsblogSettingTitle = document.getElementById('blogIdNo');
const cnsblogSettingSection = document.getElementById("blogSettingSection");


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

function setSectionVisibility(showArticleCreator, showPostUploader, showBlogSetting) {

  cnsarticleCreatorSection.style.display = showArticleCreator ? "flex" : "none";
  cnsarticleCreatorTitle.style.display = showArticleCreator ? "flex" : "none";
 
  cnspostUploaderSection.style.display = showPostUploader ? "flex" : "none";
  cnspostUploaderTitle.style.display = showPostUploader ? "flex" : "none";

  cnsblogSettingTitle.style.display = showBlogSetting ? "flex" : "none";
  cnsblogSettingSection.style.display = showBlogSetting ? "flex" : "none";

 
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

const filedialog = document.getElementById('fileDialog');

function openSettingDialog() {
    // Show the Projectdialog
    showLoader();
 
    filedialog.showModal();
    populateSettingsDialog();
 
    this.classList.remove('active');

    }

//custom settings 
const listofContentFilterInput = document.getElementById('listofContentFilter');
const urlsDownloadResultLimitsInput = document.getElementById('urlsDownloadResultLimits');
const articleCountInput = document.getElementById('articleCount');
const insertNoofImagesFROMInput = document.getElementById('insertNoofImagesFROM');
const insertNoofImagesTOInput = document.getElementById('insertNoofImagesTO');
const articleUseCategoryInsertInput = document.getElementById('articleUseCategoryInsert');
const useImagesInput = document.getElementById('useImages');
const useBingImagesInput = document.getElementById('useBingImages');
const useYoutubeThumbnailsInput = document.getElementById('useYoutubeThumbnails');
const useCreativeCommonsImagesInput = document.getElementById('useCreativeCommonsImages');
const useBingCCImagesInput = document.getElementById('useBingCCImages');
const postsperDayInput = document.getElementById('postsperDay');
const postIntervaldaysFROMInput = document.getElementById('postIntervaldaysFROM');
const postIntervaldaysTOInput = document.getElementById('postIntervaldaysTO');
const postarticleTitleInput = document.getElementById('postarticleTitle');
const postUseTodayInput = document.getElementById('postUseToday');


// Function to populate the dialog with retrieved settings data
async function populateSettingsDialog() {
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

      // Populate the input elements with the retrieved values
      listofContentFilterInput.value = data.ArticleCreatorSettings.ListofContentFilter.join(', ');
      urlsDownloadResultLimitsInput.value = data.ArticleCreatorSettings.URLsDownloadResultLimits;
      articleCountInput.value = data.ArticleCreatorSettings.ArticleCount;
      insertNoofImagesFROMInput.value = data.ArticleCreatorSettings.InsertNoofImagesFROM;
      insertNoofImagesTOInput.value = data.ArticleCreatorSettings.InsertNoofImagesTO;
      articleUseCategoryInsert.checked = data.ArticleCreatorSettings.articleUseCategoryInsert;
      useImagesInput.checked = data.ArticleCreatorSettings.UseImages;
      useBingImagesInput.checked = data.ArticleCreatorSettings.UseBingImages;
      useYoutubeThumbnailsInput.checked = data.ArticleCreatorSettings.UseYoutubeThumbnails;
      useCreativeCommonsImagesInput.checked = data.ArticleCreatorSettings.UseCreativeCommonsImages;
      useBingCCImagesInput.checked = data.ArticleCreatorSettings.UseBingCCImages;
      postUseTodayInput.checked = data.PostUploaderSettings.postUseToday;
      postsperDayInput.value = data.PostUploaderSettings.PostsperDay;
      postIntervaldaysFROMInput.value = data.PostUploaderSettings.PostIntervaldaysFROM;
      postIntervaldaysTOInput.value = data.PostUploaderSettings.PostIntervaldaysTO;
      postarticleTitleInput.value = data.PostUploaderSettings.postarticleTitle;
 
      hideLoader();
      createToast('success', 'fa-solid fa-circle-check', 'Success', 'Settings has been loaded!');
   
    } else {
      console.error('Error retrieving settings:', response.statusText);
      hideLoader();
      createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'Error retrieving settings: ' + response.statusText);
    }
  } catch (error) {
    console.error('Error retrieving settings:', error);
    createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'Error retrieving settings: ' + response.statusText);
    hideLoader();
  }
}

async function UpdateCustomSettig() {
  showLoader();
await updateSettings(); 

}
// Function to update the settings

async function updateSettings() {
  try {
    
    // Get the values from the input elements
    const listofContentFilter = listofContentFilterInput.value;
    const urlsDownloadResultLimits = parseInt(urlsDownloadResultLimitsInput.value);
    const articleCount = parseInt(articleCountInput.value);
    const insertNoofImagesFROM = parseInt(insertNoofImagesFROMInput.value);
    const insertNoofImagesTO = parseInt(insertNoofImagesTOInput.value);
    const articleUseCategoryInsert = articleUseCategoryInsertInput.checked;
    const useImages = useImagesInput.checked;
    const useBingImages = useBingImagesInput.checked;
    const useYoutubeThumbnails = useYoutubeThumbnailsInput.checked;
    const useCreativeCommonsImages = useCreativeCommonsImagesInput.checked;
    const useBingCCImages = useBingCCImagesInput.checked;
    const postsperDay = parseInt(postsperDayInput.value);
    const postIntervaldaysFROM = parseInt(postIntervaldaysFROMInput.value);
    const postIntervaldaysTO = parseInt(postIntervaldaysTOInput.value);
    const postarticleTitle = postarticleTitleInput.value;
    const postUseToday = postUseTodayInput.checked;

    // Create the updated settings object
    const updatedSettings = {
      "ArticleCreatorSettings": {
        "ListofContentFilter": listofContentFilter.split(',').map(value => value.trim()),
        "URLsDownloadResultLimits": urlsDownloadResultLimits,
        "ArticleCount": articleCount,
        "InsertNoofImagesFROM": insertNoofImagesFROM,
        "InsertNoofImagesTO": insertNoofImagesTO,
        "articleUseCategoryInsert":articleUseCategoryInsert,
        "UseImages": useImages,
        "UseBingImages": useBingImages,
        "UseYoutubeThumbnails": useYoutubeThumbnails,
        "UseCreativeCommonsImages": useCreativeCommonsImages,
        "UseBingCCImages": useBingCCImages
      },
      "PostUploaderSettings": {
        "postUseToday": postUseToday,
        "PostsperDay": postsperDay,
        "PostIntervaldaysFROM": postIntervaldaysFROM,
        "PostIntervaldaysTO": postIntervaldaysTO,
        "postarticleTitle": postarticleTitle
      }
    };

    // Send the updated settings to the server
    const response = await fetch(`${appurl}/custom-settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedSettings)
    });

    if (response.ok) {
    
      createToast('success', 'fa-solid fa-circle-check', 'Success', 'Settings has been Saved!');
      filedialog.close()

      hideLoader();
      
    } else {
      createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'Error retrieving settings: ' + response.statusText);
      filedialog.close()
      hideLoader();
    }
  } catch (error) {

    filedialog.close()

    createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'Error retrieving settings: ' + response.statusText);

    filedialog.close()
    hideLoader();
           
  }

}


// Function to close the dialog
function closeDialog(dialogname) {
  const fileDialog = document.getElementById(dialogname);
  fileDialog.close();
  hideLoader();
// Event listeners
}


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
    console.error('Error fetching project status:', error);
    return 'unknown'
      
  }
};


// Function to start monitoring a project
const startMonitoring = () => {
  monitorAllProjectsAndCreateNotification(); // Monitor projects every minute
};

//Function to Run a project Bases on Project Status.

async function startMonitoringProject (selectedProjectId)  {


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

        monitorProject(selectedProjectId);

        }
    } 

    if (articleCreatorStatus === 'complete') {
      const response = await fetch(`${apiurl}/data/${selectedProjectId}`);
      const data = await response.json();
      const chainJobId = data.result.chainJobId;
     
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
      

              monitorProject(chainJobId);
            
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

                  monitorProject(selectedProjectId);    

                }
            }
            else {
              return;
            }

          } 

      }  

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

// JavaScript
let tablerowIndex;
let statusCellIndex;

let tableRowIndex;
let projectColumnIndex;

function findRowIndexAndStatusCellIndex(projectId, projectType) {
  const table = document.getElementById('main');
  let columnIndex;

  if (projectType === 'article creator') {
    columnIndex = 0;
  } else if (projectType === 'post uploader') {
    columnIndex = 5;
  } else {
    console.error('Invalid project type:', projectType);
    return;
  }

  console.log('columnIndex Index is: ' + columnIndex);

  tableRowIndex = -1;

  for (const row of table.tBodies[0].rows) {
    const cellValue = row.cells[columnIndex].textContent.trim();
    if (cellValue === projectId) {
      tableRowIndex = row.rowIndex;
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
  const table = document.getElementById('main');
  const row = table.tBodies[0].rows[tableRowIndex];
  const statusCell = row.cells[projectColumnIndex];

  let spanElement = statusCell.querySelector('.status-pill');

  if (!spanElement) {
    // If spanElement doesn't exist, create a new one
    spanElement = document.createElement('span');
    spanElement.classList.add('status-pill');
    statusCell.appendChild(spanElement);
  }

  spanElement.textContent = newStatus;
  spanElement.classList.add(`status-${cleanedStatus.toLowerCase()}`);

  addStatusUpdatedClass(row);
}

// Function to add the status-updated class and trigger the animation
function addStatusUpdatedClass(row) {
  row.classList.add('status-row');
  // Remove the class and reapply it after a short delay (10ms)
  setTimeout(() => {
    row.classList.remove('status-row');
    void row.offsetWidth; // Trigger reflow (optional)
    // row.classList.add('status-row');
  }, 3000);
}


//  Function to remove trailing "..." from a status
const removeTrailingDots = (status) => {
  return status.replace(/\.\.\.$/, '');
};


// Function to monitor a project's status and update the watchlist
const monitorProject = async (projectId) => {

  const statusArray = ['complete', 'failed', 'aborted',''];
  let currentStatus = await currentProjectStatus(projectId);

    // Get the project type from the notificationList
    const projectType = notificationList.find(proj => proj.id === projectId)?.type;
    
    // Update the project status in the projectWatchlist
    const existingProjectIndex = projectWatchlist.findIndex(project => project.id.trim() === projectId);

    // Update the project status in the notificationList every 5 seconds
    const existingNotificationIndex = notificationList.findIndex(proj => proj.id === projectId);

  // Show toast when the project is started
  createToast(
    'info',
    'fa-solid fa-info-circle',
    'Info',
    `Project with name "${projectWatchlist.find(project => project.id === projectId).name}", id: "${projectId}"\nType: "${projectType}"\n has been started... \nCurrent Status is: ${currentStatus}`
  );


 //Check the Notification List Array if Project ID Exists.
  if (existingNotificationIndex !== -1) {

  notificationList[existingNotificationIndex].status = currentStatus;
}

// Call the function to find the rowIndex and statusCellIndex
findRowIndexAndStatusCellIndex(projectId, projectType);

// Call the function to update the status and apply classes
updateStatusAndApplyClasses(currentStatus);
// Use the selectedRowIndex and cellIndexToUpdate to update the cell content

  createNotification(notificationList); 

  while (!statusArray.includes(currentStatus)) {

    await new Promise(resolve => setTimeout(resolve, 10000));

    currentStatus = await currentProjectStatus(projectId);

      if (existingProjectIndex !== -1) {

        projectWatchlist[existingProjectIndex].status = currentStatus;

        console.log(`Project with ID ${projectId} status is: ${currentStatus}`);

            // Show toast when the project is complete, aborted, or failed
            if (currentStatus === 'aborted' || currentStatus === 'failed' || currentStatus === '') {

              createToast(
                currentStatus === 'complete' ? 'success' : 'warning',
                currentStatus === 'complete' ? 'fa-solid fa-check-circle' : 'fa-solid fa-exclamation-triangle',
                currentStatus === 'complete' ? 'Success' : 'Warning',
                `Project with name "${projectWatchlist.find(project => project.id === projectId).name}", id: "${projectId}", type: "${projectType}" has been ${currentStatus} on SEO App.`
              );
                // Remove the completed project from the watchlist
              projectWatchlist.splice(existingProjectIndex, 1);
              return
            }
      } 

      //If abortin... Update the User with Status.
    if (currentStatus === 'aborting...') {
      // Show warning toast when the project is aborting
      createToast(
        'warning',
        'fa-solid fa-exclamation-triangle',
        'Warning',
        `Project with name "${projectWatchlist.find(project => project.id === projectId).name}", id: "${projectId}", type: "${projectType}" has been ${currentStatus} on SEO App.`
      );
    }   

  //Check the Notification List Array if Project ID Exists.
  if (existingNotificationIndex !== -1) {

    notificationList[existingNotificationIndex].status = currentStatus;
  
    // Call the function to find the rowIndex and statusCellIndex
    findRowIndexAndStatusCellIndex(projectId, projectType);

    // Call the function to update the status and apply classes
    updateStatusAndApplyClasses(currentStatus);
    // Use the selectedRowIndex and cellIndexToUpdate to update the cell content
    createNotification(notificationList); 
  }
  
}
        
 // Show toast when the project is complete
if (currentStatus === 'complete' &&  projectType === 'article creator') {

    //Check the Notification List Array if Project ID Exists.
    if (existingNotificationIndex !== -1) {
      notificationList[existingNotificationIndex].status = currentStatus;
    }

      // Call the function to find the rowIndex and statusCellIndex
      findRowIndexAndStatusCellIndex(projectId, projectType);
      // Call the function to update the status and apply classes
      updateStatusAndApplyClasses(currentStatus);

      createNotification(notificationList); 

      createToast(
        currentStatus === 'complete' ? 'success' : 'warning',
        currentStatus === 'complete' ? 'fa-solid fa-check-circle' : 'fa-solid fa-exclamation-triangle',
        currentStatus === 'complete' ? 'Success' : 'Warning',
        `Project with name "${projectWatchlist.find(project => project.id === projectId).name}", id: "${projectId}", type: "${projectType}" has been ${currentStatus} on SEO App.`
      );    

    // Remove the completed project from the watchlist
    projectWatchlist.splice(existingProjectIndex, 1);

    const response = await fetch(`${apiurl}/data/${projectId}`);
    const data = await response.json();
    const postUploaderId = data.result.chainJobId;

    if (postUploaderId) {
      let tries = 0;
      let postUploaderStatus = await currentProjectStatus(postUploaderId);

      while (postUploaderStatus !== 'running' && tries < 3) {
        await new Promise(resolve => setTimeout(resolve, 10000));
       const success= await runProject(postUploaderId);
        tries++;

        postUploaderStatus = await currentProjectStatus(postUploaderId);

      }
      
      if (postUploaderStatus === 'running') {

         // Get the status, name, and type of the post uploader project using the getProjectStatus API call
         const postUploaderData = await getProjectStatus(postUploaderId);
        const postUploaderName = postUploaderData.name;
        const postUploaderType = postUploaderData.type;
        const postUploaderStatus = postUploaderData.status;
     
          // Add the project to the watchlist with status 'waiting'
          projectWatchlist.push({
            id: postUploaderId,
            name: postUploaderName,
            type: postUploaderType,
            status: postUploaderStatus,
          });
        
          // Add the project to the watchlist with status 'waiting'
        notificationList.push({
          id: postUploaderId,
          name: postUploaderName,
          type: postUploaderType,
          status: postUploaderStatus,
        });

          //Check the Notification List Array if Project ID Exists.
        if (existingNotificationIndex !== -1) {
          notificationList[existingNotificationIndex].status = currentStatus;
       
            // Call the function to find the rowIndex and statusCellIndex
            findRowIndexAndStatusCellIndex(projectId, projectType);

            // Call the function to update the status and apply classes
            updateStatusAndApplyClasses(currentStatus);
          }
            createToast(
              currentStatus === 'complete' ? 'success' : 'warning',
              currentStatus === 'complete' ? 'fa-solid fa-check-circle' : 'fa-solid fa-exclamation-triangle',
              currentStatus === 'complete' ? 'Success' : 'Warning',
              `Project with name "${projectWatchlist.find(project => project.id === postUploaderId).name}", id: "${postUploaderId}", type: "${projectType}" has been ${currentStatus} on SEO App.`
            );
         
        createNotification(notificationList); 

        monitorProject(postUploaderId);

      } else {
        createToast('error', 'fa-solid fa-times-circle', 'Error', 'Post uploader project failed to start.');
      }
    } else {
      createToast('error', 'fa-solid fa-times-circle', 'Error', 'Chain job ID not found for the Post Uploader project.');
    }

}  else if (currentStatus === 'complete' &&  projectType !== 'article creator') {
  //If project is not article Creator
  createToast(
    currentStatus === 'complete' ? 'success' : 'warning',
    currentStatus === 'complete' ? 'fa-solid fa-check-circle' : 'fa-solid fa-exclamation-triangle',
    currentStatus === 'complete' ? 'Success' : 'Warning',
    `Project with name "${projectWatchlist.find(project => project.id === projectId).name}", id: "${projectId}", type: "${projectType}" has been ${currentStatus} on SEO App.`
  );

}

  

  //Check the Notification List Array if Project ID Exists.
  if (existingNotificationIndex !== -1) {
  notificationList[existingNotificationIndex].status = currentStatus;
}

 // Call the function to find the rowIndex and statusCellIndex
 findRowIndexAndStatusCellIndex(projectId, projectType);

 // Call the function to update the status and apply classes
 updateStatusAndApplyClasses(currentStatus);

  createNotification(notificationList);

     // Remove the completed project from the watchlist
  projectWatchlist.splice(existingProjectIndex, 1);

  return currentStatus;

  }
 
// Function to continuously monitor projects and update notifications
const monitorAllProjectsAndCreateNotification = async () => {
  const { runningProjects, waitingProjects } = await fetchAllProjectData();
  const allProjectData = [...runningProjects, ...waitingProjects];

  allProjectData.forEach(projectData => {
    // Trim the project ID to remove any extra spaces
    const projectId = projectData.id.trim();

    let existingProject = projectWatchlist.find(project => project.id === projectId);

    if (!existingProject) {
      // If the project doesn't exist in the watchlist, add it to both arrays
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

  // Iterate through the projectWatchlist and monitor each project
  projectWatchlist.forEach(async (project) => {
    const { id, status } = project;

        // Trim the project ID to remove any extra spaces
        const projectId = id.trim();

    if (status === 'complete' || status === 'aborted' || status === 'failed') {
      // If the project status is complete, aborted, or failed, remove it from the watchlist
      const existingProjectIndex = projectWatchlist.findIndex(proj => proj.id === projectId);
      projectWatchlist.splice(existingProjectIndex, 1);
    } else if (status === 'running' || status === 'waiting') {
      // If the project status is running, waiting, or aborting, monitor the project
      const currentStatus = await monitorProject(projectId);

      // Update the project status in the projectWatchlist and notificationList
      const existingProjectIndex = projectWatchlist.findIndex(proj => proj.id === projectId);
      if (existingProjectIndex !== -1) {
        projectWatchlist[existingProjectIndex].status = currentStatus;
      }

      const existingNotificationIndex = notificationList.findIndex(proj => proj.id === projectId);
      if (existingNotificationIndex !== -1) {
        notificationList[existingNotificationIndex].status = currentStatus;
      }

      // Show toast when the project is complete, aborted, or failed
      if (currentStatus === 'complete' || currentStatus === 'aborted' || currentStatus === 'failed') {
        createToast(
          currentStatus === 'complete' ? 'success' : 'warning',
          currentStatus === 'complete' ? 'fa-solid fa-check-circle' : 'fa-solid fa-exclamation-triangle',
          currentStatus === 'complete' ? 'Success' : 'Warning',
          `Project with name "${project.name}", id: "${projectId}", type: "${project.type}" has been ${currentStatus} on SEO App.`
        );

        // Remove the completed project from the watchlist
        projectWatchlist.splice(existingProjectIndex, 1);
      }
    }
  });

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


// 3. Converting HTML table to PDF
const table_rows = document.querySelectorAll('tbody tr');
const table_headings = document.querySelectorAll('thead th');

const customers_table = document.querySelector('.table__body');
const tabletoExport = document.querySelector('#main');

// Converting HTML table to JSON, CSV, Excel, and PDF files

// Function to convert HTML table to JSON
const toJSON = function(table) {
  const table_data = [];
  const t_headings = table.querySelectorAll('th');
  const t_rows = table.querySelectorAll('tbody tr');

  const headings = [...t_headings].map(head => {
    let actual_head = head.textContent.trim().split(' ');
    return actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase();
  });

  t_rows.forEach(row => {
    const row_object = {};
    const t_cells = row.querySelectorAll('td');

    t_cells.forEach((t_cell, cell_index) => {
      const img = t_cell.querySelector('img');
      if (img) {
        row_object['customer image'] = decodeURIComponent(img.src);
      }
      row_object[headings[cell_index]] = t_cell.textContent.trim();
    });

    table_data.push(row_object);
  });

  return table_data;
};




// Function to convert HTML table to CSV
const toCSV = function(table) {
  const t_heads = table.querySelectorAll('th');
  const tbody_rows = table.querySelectorAll('tbody tr');

  const headings = [...t_heads].map(head => {
    let actual_head = head.textContent.trim().split(' ');
    return actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase();
  });

  const table_data = [...tbody_rows].map(row => {
    const cells = row.querySelectorAll('td');
    const img = row.querySelector('img');
    const imgSrc = img ? decodeURIComponent(img.src) : '';
    const data_without_img = [...cells].map(cell => cell.textContent.replace(/,/g, ".").trim());

    if (imgSrc !== '') {
      data_without_img.push(imgSrc);
    }

    return data_without_img;
  });

  const csvData = [headings].concat(table_data);

  return csvData;
};


// Function to convert HTML table to Excel
const toExcel = function(table, includeImages = false) {
  const t_heads = table.querySelectorAll('th');
  const tbody_rows = table.querySelectorAll('tbody tr');

  const headings = [...t_heads].map(head => {
    const text = head.textContent.trim();
    const cleanText = text.slice(0, -1); // Remove last character from the text
    const capitalizedText = cleanText.replace(/\b\w/g, (match) => match.toUpperCase()); // Capitalize first letter of each word
    return capitalizedText;
  });

  const hasImages = includeImages && table.querySelector('img') !== null;

  const table_data = [...tbody_rows].map(row => {
    const cells = row.querySelectorAll('td');

    if (hasImages) {
      const img = row.querySelector('img').src;
      const linkFormula = `=HYPERLINK("${img.replace(/\\/g, '/')}", "View Image")`; // Create hyperlink formula
      return [...cells].map(cell => cell.textContent.trim()).concat(linkFormula);
    } else {
      return [...cells].map(cell => cell.textContent.trim());
    }
  });

  if (hasImages) {
    headings.push('Image Link'); // Add "Image Link" header
  }

  const workbook = XLSX.utils.book_new(); // Create a new workbook
  const worksheet = XLSX.utils.aoa_to_sheet([headings].concat(table_data)); // Convert the data to worksheet format
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1'); // Add the worksheet to the workbook

  const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }); // Generate Excel data

  return excelData;
};


// Function to convert HTML table to PDF
const toPDF = function(table) {
  const html_code = `
    <link rel="stylesheet" href="tablecss.css">
    <main class="table">${table.innerHTML}</main>
  `;

  const new_window = window.open();
  new_window.document.write(html_code);

  setTimeout(() => {
    new_window.print();
    new_window.close();
  }, 500);
};

// Function to download file
const downloadFile = function(data, fileType, fileName = '') {
  const a = document.createElement('a');
  a.download = fileName;
  const mime_types = {
    json: 'application/json',
    csv: 'text/csv',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  const fileData =
    fileType === 'json' ? JSON.stringify(data, null, 4) :
    fileType === 'csv' ? data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n') :
    data;

  const blob = new Blob([fileData], { type: mime_types[fileType] });
  a.href = URL.createObjectURL(blob);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Bind click event for JSON button
const json_btn = document.querySelector('#jsonBtn');
json_btn.onclick = () => {
  const tableData = toJSON(customers_table);
  downloadFile(tableData, 'json', 'customer_orders.json');
};

// Bind click event for CSV button
const csv_btn = document.querySelector('#csvBtn');
csv_btn.onclick = () => {
  const tableData = toCSV(customers_table);
  downloadFile(tableData, 'csv', 'customer_orders.csv');
};

// Bind click event for Excel button
const excel_btn = document.querySelector('#excelBtn');
excel_btn.onclick = () => {
  const includeImages = false; // Set this to true if you want to include image links, false or omit for a simple table
  const tableData = toExcel(tabletoExport, includeImages);
  downloadFile(tableData, 'excel', 'customer_orders.xlsx');
};

// Bind click event for PDF button
const pdf_btn = document.querySelector('#pdfBtn');
pdf_btn.onclick = () => {
  toPDF(customers_table);
};


