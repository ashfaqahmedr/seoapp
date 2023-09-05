


const seourl ='https://script.google.com/macros/s/AKfycbxgyT3rHw0zc7xeF_HWP3fxiy9VjaBcwzE18b6eA7HzFejEvCQEJewrJSzDFkeaUa4m/exec'
const apiurl = `${seourl}/?`

const appurl ='http://localhost:3000'


window.onload = async () =>{
  // showAdminPanel()

  }


  function showAdminPanel() {
    
    const sidebar = document.getElementById("sidebar");
    const closeBtn = document.querySelector("#btn");
    // Logic to show the sidebar and tooltip on mouse over
  function showSidebar() {
    sidebar.classList.add("open");
    // tooltip.classList.remove('open');
  }
  
  // Logic to hide the sidebar and tooltip on mouse out
  function hideSidebar() {
    sidebar.classList.remove("open");
    // tooltip.classList.add('open');
  }
  
  sidebar.addEventListener('mouseover', showSidebar);
  sidebar.addEventListener('mouseout', hideSidebar);

  // // Loop through all the elements with the class 'sidebar-link' and add event listeners
  // link.forEach(linkElement => {
  //   linkElement.addEventListener('mouseover', showSidebar);
  //   linkElement.addEventListener('mouseout', hideSidebar);
  // });
  
    closeBtn.addEventListener("click", function(){
        sidebar.classList.toggle("open");
        // tooltip.classList.toggle('open');
        menuBtnChange();
  
    });
  

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
  hideLoader();
  // startMonitoring();
  
  }

  // Function to toggle the visibility of the notification panel
const toggleNotificationPanel = () => {
  const dialogpopupContainer = document.getElementById('popupContainer');
  if (dialogpopupContainer.style.display === 'none') {
    // Show the notification panel
    dialogpopupContainer.style.display = 'block';
  } else {
    // Hide the notification panel
    dialogpopupContainer.style.display = 'none';
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
        } else if (isISODate(value)) { // Check if value is in ISO date format
          const formattedDate = formatDate(value); // Format ISO date to user-friendly format
          td.textContent = formattedDate;
        } else {
          td.textContent = value !== undefined ? value : '';
        }
        
        td.setAttribute('data-label', header); // Add data-label attribute

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

  const customSelect = document.getElementById('table-filter');
  const selectedOption = customSelect.querySelector('.selected-option');
  const optionsContainer = customSelect.querySelector('.options');
  const options = customSelect.querySelectorAll('.option');
  
  options.forEach(option => {
    option.addEventListener('click', () => {
      selectedOption.innerHTML = option.innerHTML;
      optionsContainer.style.display = 'none';
      const selectedValue = option.getAttribute('data-value');
      searchTable(selectedValue);
    });
  });
  
  customSelect.addEventListener('mouseenter', () => {
    optionsContainer.style.display = 'block';
  });
  
  customSelect.addEventListener('mouseleave', () => {
    optionsContainer.style.display = 'none';
  });
  

  function searchTable(searchData) {
    let visibleCount = 0; // Variable to store the count of visible records
    
    tableRows.forEach((row, i) => {
      let tableData = row.textContent.toLowerCase();
    
      const isRowVisible = tableData.indexOf(searchData) >= 0;
      row.classList.toggle('hidden', !isRowVisible);
      // row.style.setProperty('--delay', isRowVisible ? visibleCount / 25 + 's' : '0s'); // Delay animation only for visible rows
      
      // Hide empty rows
      if (!isRowVisible) {
        const rowText = row.textContent.trim().toLowerCase();
        if (rowText === '') {
          row.classList.add('hidden');
        }
      }
    
      if (isRowVisible) {
        visibleCount++;
      }
    });
    
    const showingText = `Showing ${visibleCount} of ${totalRecords} record(s)`;
    recordCountElement.textContent = showingText;
    
    document.querySelectorAll('tbody tr:not(.hidden)').forEach((visibleRow, i) => {
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

  //Update the Custom Right Click Based on the table Data.
  updateMenuItems(apiCalltoMake);

  
  hideLoader();


  console.log("Inside the Table Scrope: "+ totalRecords)
 
}

// Function to check if a value is in ISO date format
function isISODate(value) {
  return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/.test(value);
}


// Function to format ISO date to user-friendly format
function formatDate(isoDate) {
  const date = new Date(isoDate);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  return date.toLocaleString('en-US', options);
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

      // // Apply border radius to cells
      // cell.style.borderRadius = '5px';
      // cell.style.width = '100%';
    });
  }
}



//Loadoverlay Div
// Function to show the loader
function showLoader() {
  // alert('Loader')
  document.body.style.cursor = 'none';
  dialogloadingOverlay.style.display = 'block';
}

// Function to hide the loader
function hideLoader() {
  document.body.style.cursor = 'auto';
  dialogloadingOverlay.style.display = 'none';
}


// Get the table and context menu elements
const table = document.getElementById('main');
const contextMenu = document.querySelector('.menu');

const closeButton = document.getElementById('closeDialogButton');

const updateButton = document.getElementById('updateProjectData');
const addButtonText = document.getElementById('createProjectText');



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


async function fetchDataAndHandle(selectedRowId, method) {
  
  
  const ProjectIDInput = document.getElementById('ProjectID');
  const articleProjectNameInput = document.getElementById('articleProjectName');
  const articleKeywordsFileInput = document.getElementById('articleKeywordsFile');
  const articleCategoriesInput = document.getElementById('articleCategories');
  const ProjectStatusinput = document.getElementById('ProjectStatus');

  const PostUploaderIdInput = document.getElementById('PostUploaderId');
  const postJobNameInput = document.getElementById('postJobName');
  const PostUploaderStatusInput = document.getElementById('PostUploaderStatus');


  const BlogIdInput = document.getElementById('BlogId');
  const blogUserNameInput = document.getElementById('blogUserName');
  const blogPasswordInput = document.getElementById('blogPassword');
  const blogUrlInput = document.getElementById('blogUrl');
  const blogGroupInput = document.getElementById('blogGroup');
  const SEOStatusInput = document.getElementById('SEOStatus');

 

    if (method.toUpperCase() === 'GETDATA') {

    const responsePromise = fetch(seourl, {
      method: 'POST',
      body: JSON.stringify({ action: 'getProjects', dataId: selectedRowId, username: LoggedUsername }), // Include the action
    });
  
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        hideLoader();
        reject(new Error(createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error)));
      }, 30000);
    });
  
    try {
      const response = await Promise.race([responsePromise, timeoutPromise])

    const data = await response.json();

    console.table(data);

      cnsarticleCreatorTitle.textContent = `Article Creator Details of ID: ${selectedRowId}`;

          ProjectIDInput.value = data[0].ProjectID;
          articleProjectNameInput.value = data[0].ProjectName;
          ProjectStatusinput.value = data[0].ProjectStatus;
          articleKeywordsFileInput.value = data[0].ProjectKeyowrds;
          articleCategoriesInput.value = data[0].ProjectCatagories;

          cnspostUploaderTitle.textContent = `Post Uploader Details of ID: ${data[0].PostUploaderId}`;

          // // Fill in the Post Uploader section
          PostUploaderIdInput.value = data[0].PostUploaderId;
          postJobNameInput.value = data[0].PostUploaderName;
          PostUploaderStatusInput.value = data[0].PostUploaderStatus;

    // Extract the date part and format it as "YY-MM-DD"
    const postStartDate = new Date(data[0].PostStartDate);
    postStartDate.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC

    // Add one day to the date to account for time zone differences
    postStartDate.setDate(postStartDate.getDate() + 1);

    const formattedPostStartDate = postStartDate.toISOString().split('T')[0];

    // Assign the formatted date to the input value
    postDateInput.value = formattedPostStartDate;


          cnsblogSettingTitle.textContent = `Blog Setting details of ID: ${data[0].BlogId} SEO Status ${data[0].SEOStatus}`;

          // // Fill in the Blog Setting section
          BlogIdInput.value = data[0].BlogId;
          blogUserNameInput.value = data[0].username;
          blogPasswordInput.value = data[0].password;
          blogUrlInput.value = data[0].url;
          blogGroupInput.value = data[0].group;
          SEOStatusInput.value = data[0].SEOStatus;

          dialogProjectsDialog.style.display="flex";

          dialogProjectsDialog.showModal();

        } catch (error) {
          createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error.message);
          hideLoader();
        }

    } else if (method.toUpperCase() === 'UPDATEDATA') {
     
         const jsonData = {
        action: 'updateProjectsData',
        username: LoggedUsername,
        dataItems: [
          {
            SheetID: selectedRowId,
            ProjectID: ProjectIDInput.value,
            ProjectName: articleProjectNameInput.value,
            ProjectStatus: ProjectStatusinput.value, // Use corresponding input element
            ProjectKeyowrds: articleKeywordsFileInput.value,
            ProjectCatagories: articleCategoriesInput.value,
            PostUploaderId: PostUploaderIdInput.value,
            PostUploaderName: postJobNameInput.value,
            PostUploaderStatus: PostUploaderStatusInput.value , // Use corresponding input element
            PostStartDate: postDateInput.value,
            BlogId: BlogIdInput.value,
            username: blogUserNameInput.value,
            password: blogPasswordInput.value,
            url: blogUrlInput.value,
            group: blogGroupInput.value,
            SEOStatus: SEOStatus.value, // Use corresponding input element
          },
        ],
      };

      console.table(jsonData)
    

      const responsePromise = fetch(seourl, {
        method: 'POST',
        body: JSON.stringify( jsonData ), // Include the action
      });
    
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          hideLoader();
          reject(new Error(createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error)));
        }, 30000);
      });
    
      try {
        const response = await Promise.race([responsePromise, timeoutPromise])

      const Resdata = await response.json();

      console.table(Resdata);

        const success = Resdata[0].success;
        const id = Resdata[0].SheetID;
        const message = Resdata[0].message;

        createToast('success', 'fa-solid fa-circle-check', 'Success', "Success: " + success + " ID: "+ id + ' Message: '+ message);
        dialogProjectsDialog.style.display="none";
        dialogProjectsDialog.close()
  if (success) {
          // Assuming you have the row index stored in selectedRowIndex
  const table = document.getElementById('main');
  const row = table.rows[selectedRowIndex];

  if (row) {
    // Update each cell based on its corresponding input field value
    // row.cells[2].textContent = ProjectIDInput.value;
    row.cells[2].textContent = articleProjectNameInput.value;


  // Update ProjectStatus span element
  const projectStatusSpan = row.cells[3].querySelector('span.status-pill');
  const cleanedProjectStatus = removeTrailingDots(ProjectStatusinput.value);
  projectStatusSpan.textContent = ProjectStatusinput.value;
  projectStatusSpan.className = 'status-pill'; // Remove all classes and set to 'status-pill'
  projectStatusSpan.classList.add(`status-${cleanedProjectStatus.toLowerCase()}`);

    // row.cells[4].textContent = articleKeywordsFileInput.value;
    // row.cells[5].textContent = articleCategoriesInput.value;
    // row.cells[6].textContent = PostUploaderIdInput.value;
    row.cells[4].textContent = postJobNameInput.value;

  // Update PostUploaderStatus span element
  const postUploaderStatusSpan = row.cells[5].querySelector('span.status-pill');
  const cleanedPostUploaderStatus = removeTrailingDots(PostUploaderStatusInput.value);
  postUploaderStatusSpan.textContent = PostUploaderStatusInput.value;
  postUploaderStatusSpan.className = 'status-pill'; // Remove all classes and set to 'status-pill'
  postUploaderStatusSpan.classList.add(`status-${cleanedPostUploaderStatus.toLowerCase()}`);

    row.cells[6].textContent = postDateInput.value;
    // row.cells[10].textContent = BlogIdInput.value;
    // row.cells[11].textContent = blogUserNameInput.value;
    // row.cells[12].textContent = blogPasswordInput.value;
    // row.cells[13].textContent = blogUrlInput.value;
    // row.cells[14].textContent = blogGroupInput.value;
    
  // Update SEOStatus span element
    const seoStatusSpan = row.cells[7].querySelector('span.status-pill');
    const cleanedSEOStatus = removeTrailingDots(SEOStatusInput.value);
    seoStatusSpan.textContent = SEOStatusInput.value;
    seoStatusSpan.className = 'status-pill'; // Remove all classes and set to 'status-pill'
    seoStatusSpan.classList.add(`status-${cleanedSEOStatus.toLowerCase()}`);
    }
    hideLoader();
  }
 } catch (error) {
    createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error.message);
    hideLoader();
  }
}

 else if (method.toUpperCase() === 'ADDDATA') {
   
 
const jsonData = {
        action: 'addProjectData',
        username: "ASHFAQ",
        dataItems: [
          {
            ProjectID: "",
            ProjectName: articleProjectNameInput.value,
            ProjectStatus: "draft", // Use corresponding input element
            ProjectKeyowrds: articleKeywordsFileInput.value,
            ProjectCatagories: articleCategoriesInput.value,
            PostUploaderId: "",
            PostUploaderName: postJobNameInput.value,
            PostUploaderStatus: "draft" , // Use corresponding input element
            PostStartDate: postDateInput.value,
            BlogId: "",
            username: blogUserNameInput.value,
            password: blogPasswordInput.value,
            url: blogUrlInput.value,
            group: blogGroupInput.value,
            SEOStatus: "pending", // Use corresponding input element
          },
        ],
      };

console.table(jsonData)

const responsePromise = fetch(seourl, {
  method: 'POST',
  body: JSON.stringify( jsonData ), // Include the action
});

const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => {
    hideLoader();
    reject(new Error(createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error)));
  }, 30000);
});

try {
  const response = await Promise.race([responsePromise, timeoutPromise])

const Resdata = await response.json();

console.table(Resdata);

 const success = Resdata[0].success;
 const id = Resdata[0].SheetID;
 const message = Resdata[0].message;

 createToast('success', 'fa-solid fa-circle-check', 'Success', "Success: " + success + " ID: "+ id + ' Message: '+ message);

 if (success) {
  hideLoader();


    // Add a new row at index 2 (third row)
    const table = document.getElementById('main');
    const newRow = table.insertRow(1);

    // Insert cells and set their content
    for (let i = 0; i < 8; i++) {
      const cell = newRow.insertCell(i);
      cell.textContent = '';
    }

    // Set specific cell values based on input fields and create status spans
    newRow.cells[0].textContent = id;

        const currentDate = new Date();
    const formatedDateMMDDYY = currentDate.toISOString().split('T')[0]; // Get the current date in "yyyy-mm-dd" format
    console.log(formatedDateMMDDYY)
    
    newRow.cells[1].textContent =formatedDateMMDDYY;
    // newRow.cells[1].textContent = ProjectIDInput.value;
    newRow.cells[2].textContent = articleProjectNameInput.value;

    const statusSpan1 = document.createElement('span');
    statusSpan1.className = 'status-pill status-draft';
    statusSpan1.textContent = 'draft';
    newRow.cells[3].appendChild(statusSpan1);

    // newRow.cells[4].textContent = articleKeywordsFileInput.value;
    // newRow.cells[5].textContent = articleCategoriesInput.value;
    // newRow.cells[6].textContent = PostUploaderIdInput.value;
    newRow.cells[4].textContent = postJobNameInput.value;

    const statusSpan2 = document.createElement('span');
    statusSpan2.className = 'status-pill status-draft';
    statusSpan2.textContent = 'draft';
    newRow.cells[5].appendChild(statusSpan2);

    newRow.cells[6].textContent = postDateInput.value;
    // newRow.cells[10].textContent = BlogIdInput.value;
    // newRow.cells[11].textContent = blogUserNameInput.value;
    // newRow.cells[12].textContent = blogPasswordInput.value;
    // newRow.cells[13].textContent = blogUrlInput.value;
    // newRow.cells[14].textContent = blogGroupInput.value;

    const statusSpan3 = document.createElement('span');
    statusSpan3.className = 'status-pill status-pending';
    statusSpan3.textContent = 'pending';
    newRow.cells[7].appendChild(statusSpan3);

    console.log('Article Creator Data has been saved!');
    dialogProjectsDialog.style.display="none";
    dialogProjectsDialog.close();
    hideLoader();
  }
} catch (error) {
  createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error.message);
  hideLoader();
   }
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
      // selectedRowId='ff7c9355-d9e0-4bba-90bd-4a020a19a03e'

    await fetchDataAndHandle(selectedRowId, 'GETDATA'); // Make GET request

      hasArticleCreatorData = true;
      hasPostUploaderData = true;
      hasBlogSettingData = true;

      DialogTitle.textContent = `Edit Project Data for ID: [ ${selectedRowId} ]`;

    }

//  else if (sectiontoshow === 'articleCreator') {

//     //  Fetch data for Article Creator section
//     await fnarticleCreator(selectedRowId, 'GET'); // Make GET request
    
//     DialogTitle.textContent = `Article Creator Data for ID: [ ${selectedRowId} ]`;


//     hasArticleCreatorData = true;

//   } else if (sectiontoshow === 'postuploader') {
   
//      //  Fetch data for Article Creator section
//      await fnPostUploader(selectedRowId, 'GET'); // Make GET request
    
//      DialogTitle.textContent = `Post Uploader Data for ID: [ ${selectedRowId} ]`;

//           hasPostUploaderData = true;
//           // Handle the successful response data
     
//   } else if (sectiontoshow === 'jsondata') {
//      await JSONApi(selectedRowId, 'GET');

//      DialogTitle.textContent = `Json File Data for ID: [ ${selectedRowId} ]`;

//           hasBlogSettingData = true;
//           // Handle the successful response data
          
//     }
    
    if (sectiontoshow === 'AllDatatoshow') {
      // Show the "Update Data" button
      updateButton.style.display = 'flex';
      btncreateProjectData.style.display = 'flex'
      addButtonText.textContent="Duplicate"
    } else {
      // Hide the "Update Data" button
      updateButton.style.display = 'none';
      btncreateProjectData.style.display = 'none'
    }
    
  setSectionVisibility(hasArticleCreatorData, hasPostUploaderData, hasBlogSettingData);

  hideLoader();
  createToast('success', 'fa-solid fa-circle-check', 'Success', 'Data from SEO and custom API has been Retrieved!');

    } catch(error) {
      hideLoader();
      console.log(error)
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

// btncreateProjectData.style.display="none";

  //  Hide all inputs that not required for add projects.
  document.getElementById('DivProjectCreatoID').style.display = 'flex';
  document.getElementById('DivProjectCreatorStatus').style.display = 'flex';
  document.getElementById('DivProjectPosterrID').style.display = 'flex';
  document.getElementById('DivProjectPosterStatus').style.display = 'flex';
  document.getElementById('DivProjectBlogID').style.display = 'flex';
  document.getElementById('DivProjectSEOStatus').style.display = 'flex';
 

 btncreateProjectData.style.display="flex"; 
updateButton.style.display = 'flex';
 
await fetchDataAndHandle(selectedRowId, 'UPDATEDATA'); // Make GET request


    hideLoader();
    // fetchAPI();
   
  
  } catch(error) {
    
    createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is an error while savind data to files.');
   
    hideLoader();
  }
} 


  //Delete Selected Project
  async function deleteProjectData(selectedRowId) {
   
      showLoader();
      const jsonData = {
        action: 'deleteProjectsData',
        username: LoggedUsername,
        dataItems: [
          {
            SheetID: selectedRowId
          }
        ]
      };

      console.table(jsonData)
    

      const responsePromise = fetch(seourl, {
        method: 'POST',
        body: JSON.stringify( jsonData ), // Include the action
      });
    
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          hideLoader();
          reject(new Error(createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error)));
        }, 30000);
      });
    
      try {
        const response = await Promise.race([responsePromise, timeoutPromise]);

      const Resdata = await response.json();

      console.table(Resdata);

        const success = Resdata[0].success;
        const id = selectedRowId;
        const message = Resdata[0].message;

      // Assuming you have the row index stored in selectedRowIndex
      const table = document.getElementById('main');

      if (selectedRowIndex >= 0) {
        table.deleteRow(selectedRowIndex);
      }
      createToast('success', 'fa-solid fa-circle-check', 'Success', "Success: " + success + " ID: "+ id + ' Message: '+ message);


      hideLoader();
  
    } catch (error) {

      createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is some Error while deleting the Selected Project');
      hideLoader();
      
      // alert('Error deleting data:', error.message);
    }
  }
  
  

  //Function to call Delete functions with related IDs
  async function deleteUsingAPI(){
   
 
    const confirmDialogUse = await openConfrimDialog('confrimDialog', 'Delete Selected Project ID: ?' + selectedRowId, 'Do you want to DELETE Selected Project?');
  
    if (confirmDialogUse) { 
      showLoader();
      deleteProjectData(selectedRowId);    
    }
  
  }
  
  
  
const DialogTitle =  document.getElementById('dialogTitle')
    
const cnsarticleCreatorTitle = document.getElementById("articlecreator");
const cnsarticleCreatorSection = document.getElementById("articleCreatorSection")

const cnspostUploaderTitle = document.getElementById("postuploader");
const cnspostUploaderSection = document.getElementById("postUploaderSection");

const postDateInput = document.getElementById('postDate');

const currentDate = new Date();
const formatedDateMMDDYY = currentDate.toISOString().split('T')[0]; // Get the current date in "yyyy-mm-dd" format
console.log(formatedDateMMDDYY)


const cnsblogSettingTitle = document.getElementById('blogIdNo');
const cnsblogSettingSection = document.getElementById("blogSettingSection");

const btnupdateProjectData = document.getElementById("updateProjectData");

const btncreateProjectData = document.getElementById("createProjectData");

  
// Add New project or Duplicate Project
function createnewJobID() {

    showLoader();
   
    postDateInput.value = formatedDateMMDDYY;
  
    btncreateProjectData.style.display="flex";
    addButtonText.textContent="Add"
   updateButton.style.display = 'none';

   DialogTitle.textContent="Add New Project to Google Sheets"
   cnsarticleCreatorTitle.textContent="Add Article Creator Data here" 
   cnspostUploaderTitle.textContent="Add Post Uploader Data here"
   cnsblogSettingTitle.textContent="Add JSON Data here"


  //  Hide all inputs that not required for add projects.
 document.getElementById('DivProjectCreatoID').style.display = 'none';
 document.getElementById('DivProjectCreatorStatus').style.display = 'none';
 document.getElementById('DivProjectPosterrID').style.display = 'none';
 document.getElementById('DivProjectPosterStatus').style.display = 'none';
 document.getElementById('DivProjectBlogID').style.display = 'none';
 document.getElementById('DivProjectSEOStatus').style.display = 'none';


//  clear the Inputs before loading the dialog 
clearDialog(dialogProjectsDialog);

dialogProjectsDialog.style.display="flex";
dialogProjectsDialog.showModal();
  
   hideLoader();
  
  }
  
  // Function to complete all commands
  async function createProjects() {
      // alert('New Article Creator ID: ' + newArticleCreatorID + ' New Post Uploader ID: ' + newPostUploaderID + ' New Blog ID: ' + newBlogID);


  // Validate required fields and check if they are all filled
  const isValid = validateRequiredFields(dialogProjectsDialog);

  if (isValid) {
    showLoader();
    await fetchDataAndHandle(null, 'ADDDATA'); // Make GET request
  } else {
   createToast('info', 'fa-solid fa-info-circle', 'Info', 'No projects are currently running.');
  }
}
  
//Function to clear filled inputs of previous data.
function clearDialog(dialog) {
  const formElements = dialog.querySelectorAll('input, select, textarea');

  formElements.forEach((element) => {
    switch (element.type) {
      case 'checkbox':
        element.checked = false;
        break;
      case 'date':
        // Skip clearing date input and keep it as is
        break;
      case 'number':
        element.value = '1'; // Set to 1 for type "number"
        break;
      case 'text':
        element.value = ''; // Set to an empty string for type "text"
        break;
      // Add more cases for other input types if needed
    }
  });
}

// Function to validate required fields and return true if all are filled, false otherwise
function validateRequiredFields(dialog) {
  const formElements = dialog.querySelectorAll('[required]');

  let isValid = true;

  formElements.forEach((element) => {
    if (element.type === 'checkbox' && !element.checked) {
      isValid = false;
      element.style.border = '2px solid red';
      // element.style.backgroundColor = 'red';
    } else if (element.type !== 'checkbox' && element.value.trim() === '') {
      isValid = false;
      element.style.border = '2px solid red';
      // element.style.backgroundColor = 'red';
    } else {
      element.style.border = ''; // Clear the border style
      element.style.fontWeight = ''; // Clear the font weight
    }
  });

  return isValid;
}






function openSettingDialog() {
    // Show the dialogProjectsDialog
    showLoader();
 
    getandUpdateProjectSetting("GETDATA");
 
    }

  async function UpdateCustomSettig() {
    showLoader();
  await getandUpdateProjectSetting("UPDATEDATA"); 
  
  }


// Function to populate the dialog with retrieved settings data
async function getandUpdateProjectSetting(METHOD) {
  

  let settingSheetId = null;

  //custom settings 
const sheetIDInput = document.getElementById('CustomDialogsheetID');
const listofContentFilterInput = document.getElementById('listofContentFilter');
const urlsDownloadResultLimitsInput = document.getElementById('urlsDownloadResultLimits');
const articleCountInput = document.getElementById('articleCount');
const insertNoofImagesFROMInput = document.getElementById('insertNoofImagesFROM');
const insertNoofImagesTOInput = document.getElementById('insertNoofImagesTO');
const articleUseCategoryInsertInput = document.getElementById('articleUseCategoryInsert');
const useImagesInput = document.getElementById('useImages');
const imageInserTypeInput = document.getElementById('imageInserType');
const InsertAtStartOfBodyInput = document.getElementById('InsertAtStartOfBody');
const useBingImagesInput = document.getElementById('useBingImages');
const useYoutubeThumbnailsInput = document.getElementById('useYoutubeThumbnails');
const useCreativeCommonsImagesInput = document.getElementById('useCreativeCommonsImages');
const useBingCCImagesInput = document.getElementById('useBingCCImages');
const postUseTodayInput = document.getElementById('postUseToday');
const postsperDayInput = document.getElementById('postsperDay');
const postIntervaldaysFROMInput = document.getElementById('postIntervaldaysFROM');
const postIntervaldaysTOInput = document.getElementById('postIntervaldaysTO');
const postarticleTitleInput = document.getElementById('postarticleTitle');
const seoStatusInput = document.getElementById('seoStatus');


  if (METHOD==="GETDATA") {
   
    const responsePromise = fetch(seourl, {
      method: 'POST',
      body: JSON.stringify({ action: 'getProjectSettings', username: LoggedUsername }), // Include the action
    });
  
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        hideLoader();
        reject(new Error(createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error)));
      }, 30000);
    });
  
    try {
      const response = await Promise.race([responsePromise, timeoutPromise]);

      

    if (response.ok) {
      const data = await response.json();

      settingSheetId = data[0].sheetID;

      // Populate the input elements with the retrieved values
      sheetIDInput.value = settingSheetId;
      listofContentFilterInput.value = data[0].ListofContentFilter;
      urlsDownloadResultLimitsInput.value = data[0].URLsDownloadResultLimits;
      articleCountInput.value = data[0].ArticleCount;
      insertNoofImagesFROMInput.value = data[0].InsertNoofImagesFROM;
      insertNoofImagesTOInput.value = data[0].InsertNoofImagesTO;
      articleUseCategoryInsertInput.checked = data[0].articleUseCategoryInsert;
      useImagesInput.checked = data[0].UseImages;
      imageInserTypeInput.value = data[0].InsertType;
      InsertAtStartOfBodyInput.checked = data[0].InsertAtStartOfBody;
      useBingImagesInput.checked = data[0].UseBingImages;
      useYoutubeThumbnailsInput.checked = data[0].UseYoutubeThumbnails;
      useCreativeCommonsImagesInput.checked = data[0].UseCreativeCommonsImages;
      useBingCCImagesInput.checked = data[0].UseBingCCImages;
      postUseTodayInput.checked = data[0].postUseToday;
      postsperDayInput.value = data[0].PostsperDay;
      postIntervaldaysFROMInput.value = data[0].PostIntervaldaysFROM;
      postIntervaldaysTOInput.value = data[0].PostIntervaldaysTO;
      postarticleTitleInput.value = data[0].postarticleTitle;
      seoStatusInput.value = data[0].SEOStatus;
 
      hideLoader();
      createToast('success', 'fa-solid fa-circle-check', 'Success', 'Settings has been loaded!');
      sheetIDInput.style.display="flex";
      customSettingDialog.style.display="flex";
      customSettingDialog.showModal();
    
        }  else {
          console.error('Error retrieving settings:');
          hideLoader();
         
          createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'Error retrieving settings: ' + error);
      }
        } catch (error) {
          console.error('Error retrieving settings:', error);
          createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'Error retrieving settings: ' + error);
          hideLoader();
        }
      }

  if (METHOD==="UPDATEDATA") {

    const jsonData = {
      action: 'updatesettingData',
      username: LoggedUsername,
      dataItems: [
        {
         "SheetID": sheetIDInput.value,
        "ListofContentFilter": listofContentFilterInput.value,
        "URLsDownloadResultLimits": parseInt(urlsDownloadResultLimitsInput.value),
        "ArticleCount": parseInt(urlsDownloadResultLimitsInput.value),
        "InsertNoofImagesFROM":  parseInt(insertNoofImagesFROMInput.value),
        "InsertNoofImagesTO": parseInt(insertNoofImagesTOInput.value),
        "articleUseCategoryInsert":articleUseCategoryInsertInput.checked,
        "UseImages": useImagesInput.checked,
        "InsertType": imageInserTypeInput.value,
        "InsertAtStartOfBody": InsertAtStartOfBodyInput.checked,
        "UseBingImages": useImagesInput.checked,
        "UseYoutubeThumbnails": useYoutubeThumbnailsInput.checked,
        "UseCreativeCommonsImages": useCreativeCommonsImagesInput.checked,
        "UseBingCCImages": useBingCCImagesInput.checked,
        "postUseToday": postUseTodayInput.checked,
        "PostsperDay": parseInt(postsperDayInput.value),
        "PostIntervaldaysFROM": parseInt(postIntervaldaysFROMInput.value),
        "PostIntervaldaysTO": parseInt(postIntervaldaysTOInput.value),
        "postarticleTitle": postarticleTitleInput.value,
        "SEOStatus": "pending"
      }
    ]
  };

  console.table(jsonData)


    const responsePromise = fetch(seourl, {
      method: 'POST',
      body: JSON.stringify(jsonData), // Include the action
    });
  
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        hideLoader();
        reject(new Error(createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error)));
      }, 30000);
    });
  
    try {
      const response = await Promise.race([responsePromise, timeoutPromise]);

      
    if (response.ok) {

      const Resdata = await response.json();

      console.table(Resdata);

        const success = Resdata[0].success;
        const id =  Resdata[0].SheetID;
        const message = Resdata[0].message;

      createToast('success', 'fa-solid fa-circle-check', 'Success', "Success: " + success + " <br> ID: "+ id + ' <br> Message: '+ message);
      customSettingDialog.style.display="none";
      customSettingDialog.close()
      hideLoader();
    }
  }
 
     catch (error) {

      createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is some Error while Updating the Project Setting' +error);
      hideLoader();
      customSettingDialog.style.display="none";
      customSettingDialog.close()
    } 
  }
}


//Add Users Sheet Dialog
const usersheetIDInput = document.getElementById('usersheetID');
const userFullInputInput = document.getElementById('userFullInput');
const usernameInputInput = document.getElementById('usernameInput');
const userpasswordInput = document.getElementById('passwordInput');
const usertimeCountInput = document.getElementById('timeCount');
const userTypeInput = document.getElementById('userType');
const userseoStatusinput = document.getElementById('seoStatusinput');


const btnudateUserInfo = document.getElementById('udateUserInfo');
const btnaddUserInfo = document.getElementById('addUserInfo');
const btnUsercloseDialog = document.getElementById('UsercloseDialog');

btnaddUserInfo.style.display="none";
btnudateUserInfo.style.display = 'none';


function showAddUserDialog() {

  showLoader();

userDialogTitle.innerText="Add New User's to Google Sheet"
userDialogSubTitle.innerText="Add User's Info"

  UserDialogsheetID.style.display = 'none';
  UserDialogSeoStatus.style.display = 'none';

  btnaddUserInfo.style.display="flex";
  btnudateUserInfo.style.display = 'none';


//  clear the Inputs before loading the dialog 
clearDialog(dialoguserDialog);

  dialoguserDialog.style.display="flex";

  dialoguserDialog.showModal();

  hideLoader();

}


// Add Users Info
async function AddUserInfo() {

  // Validate required fields and check if they are all filled
  const isValid = validateRequiredFields(dialoguserDialog);

  if (isValid) {
    showLoader();
await getandAddUsers("ADDUSERDATA"); 
  } else {
   createToast('info', 'fa-solid fa-info-circle', 'Info', 'No projects are currently running.');
  }


}

// Update Users Info
async function updateSelectedUserData() {

  showLoader();

  btnaddUserInfo.style.display="none";
  btnudateUserInfo.style.display = 'flex';


  userDialogTitle.innerText="Update User's to Google Sheet"
userDialogSubTitle.innerText="Update the Required User's Info"


  showLoader();

  getandAddUsers("GETUSERDATA", selectedRowId);


}

async function updateUserDatabtnclk() {
  showLoader();
await getandAddUsers("UPDATEUSERDATA", selectedRowId); 

}


async function deleteSelectedUserData() {
 
  const confirmDialogUse = await openConfrimDialog('confrimDialog', 'Delete Selected User ID: ?' + selectedRowId, 'Do you want to DELETE Selected User?');

  if (confirmDialogUse) { 
    showLoader();
    await getandAddUsers("DELETEUSERDATA", selectedRowId); 
  }

}


// Function to populate the dialog with retrieved settings data
async function getandAddUsers(METHOD, selectedUserId) {


    if (METHOD==="GETUSERDATA") {
 
  const responsePromise = fetch(seourl, {
    method: 'POST',
    body: JSON.stringify({ action: 'getUsers', dataId: selectedUserId, username: LoggedUsername }), // Include the action
  });

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      hideLoader();
      reject(new Error(createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error)));
    }, 30000);
  });

  try {
    const response = await Promise.race([responsePromise, timeoutPromise]);


  if (response.ok) {
    const data = await response.json();


    // Populate the input elements with the retrieved values
    usersheetIDInput.value = data[0].SheetID;
    userFullInputInput.value = data[0].FullName;
    usernameInputInput.value = data[0].userName;
    userpasswordInput.value = data[0].Password;
    usertimeCountInput.value = data[0].TimeOutMinute;
    userTypeInput.value = data[0].Type;
    userseoStatusinput.value = data[0].seoStatus;

    hideLoader();
    createToast('success', 'fa-solid fa-circle-check', 'Success', 'Settings has been loaded!');

    UserDialogsheetID.style.display = 'flex';
    UserDialogSeoStatus.style.display = 'flex';

    dialoguserDialog.style.display="flex";
    dialoguserDialog.showModal();
  
      }  else {
        console.error('Error retrieving settings:');
        hideLoader();
        createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is some Error while Getting User Data: ' + error);
    }
      } catch (error) {
        console.error('Error retrieving settings:', error);
        createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is some Error while Getting User Data : ' + error);
        hideLoader();
      }
    }

    if (METHOD==="ADDUSERDATA") {


        const jsonData = {
          action: 'addUsersData',
          username: LoggedUsername,
          dataItems: [
            {
            "Type": userTypeInput.value,
            "TimeOutMinute": parseInt(usertimeCountInput.value),
            "userName": usernameInputInput.value,
            "Password":  userpasswordInput.value,
            "FullName":  userFullInputInput.value,
            "SEOStatus": "pending"
          }
        ]
      };
      
      console.table(jsonData)
      
      
        const responsePromise = fetch(seourl, {
          method: 'POST',
          body: JSON.stringify(jsonData), // Include the action
        });

      
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error(createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error)));
          }, 30000);
        });
      
        try {
          const response = await Promise.race([responsePromise, timeoutPromise]);

          

        if (response.ok) {
      
          const Resdata = await response.json();
      
          console.table(Resdata);
      
            const success = Resdata[0].success;
            const id =  Resdata[0].SheetID;
            const message = Resdata[0].message;
      
          createToast('success', 'fa-solid fa-circle-check', 'Success', "Success: " + success + " <br> ID: "+ id + ' <br> Message: '+ message);
          dialoguserDialog.style.display="none";
          dialoguserDialog.close()
          hideLoader();
        }
      }
      
         catch (error) {
      
          createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is some Error while Adding User Data' +error);
          hideLoader();
          dialoguserDialog.style.display="none";
          dialoguserDialog.close()
        } 
    }

    if (METHOD==="UPDATEUSERDATA") {

        
        const jsonData = {
          action: 'updateUsersData',
          username: LoggedUsername,
          dataItems: [
            {
            "SheetID": selectedUserId,
            "Type": userTypeInput.value,
            "TimeOutMinute": parseInt(usertimeCountInput.value),
            "userName": usernameInputInput.value,
            "Password":  userpasswordInput.value,
            "FullName":  userFullInputInput.value,
            "SEOStatus": "pending"
          }
        ]
      };

      console.table(jsonData)


        const responsePromise = fetch(seourl, {
          method: 'POST',
          body: JSON.stringify(jsonData), // Include the action
        });
      
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error(createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error)));
          }, 30000);
        });
      
        try {
          const response = await Promise.race([responsePromise, timeoutPromise]);


        if (response.ok) {

          const Resdata = await response.json();

          console.table(Resdata);

            const success = Resdata[0].success;
            const id =  Resdata[0].SheetID;
            const message = Resdata[0].message;

          createToast('success', 'fa-solid fa-circle-check', 'Success', "Success: " + success + " <br> ID: "+ id + ' <br> Message: '+ message);
          dialoguserDialog.close()
          dialoguserDialog.style.display="none";
          hideLoader();
        }

      }  catch (error) {

          createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is some Error while Updating User Data' +error);
          hideLoader();
          dialoguserDialog.style.display="none";
          dialoguserDialog.close()
        } 


    }

      //Delete Data
    if (METHOD==="DELETEUSERDATA") {
          
          const jsonData = {
            action: 'deleteUsersData',
            username: LoggedUsername,
            dataItems: [
              {
              "SheetID": selectedUserId
            }
          ]
        };
  
        console.table(jsonData)
  
          // Send the updated settings to the server
          const responsePromise = fetch(seourl, {
            method: 'POST',
            body: JSON.stringify(jsonData), // Include the action
          });
        
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error(createToast('error', 'fa-solid fa-circle-exclamation', 'Error', error)));
            }, 30000);
          });
        
          try {
            const response = await Promise.race([responsePromise, timeoutPromise])

  
          if (response.ok) {
  
            const Resdata = await response.json();
  
            console.table(Resdata);
  
              const success = Resdata[0].success;
              const id =  Resdata[0].SheetID;
              const message = Resdata[0].message;

                      // Assuming you have the row index stored in selectedRowIndex
            const table = document.getElementById('main');

            if (selectedRowIndex >= 0) {
              table.deleteRow(selectedRowIndex);
            }
  
            createToast('success', 'fa-solid fa-circle-check', 'Success', "Success: " + success + " <br> ID: "+ id + ' <br> Message: '+ message);
            dialoguserDialog.close()
            dialoguserDialog.style.display="none";
            hideLoader();
          }
        }
  
          catch (error) {
  
            createToast('error', 'fa-solid fa-circle-exclamation', 'Error', 'There is some Error while deleting User Data' +error);
            hideLoader();
            dialoguserDialog.close()
            dialoguserDialog.style.display="none";
          } 
    }

}
// Function to update the settings

// Function to close the dialog
function closeDialog(dialogname) {
  const fileDialog = document.getElementById(dialogname);
  fileDialog.style.display="none";
  fileDialog.close();
  hideLoader();
// Event listeners
}


const notificationTableBody = document.getElementById('notificationTableBody');


function createNotification(allProjectData) {
  toggleNotificationPanel();

  if (allProjectData.length === 0) {
    // If there is no data, hide the notification and remove the HTML elements
    // createToast('info', 'fa-solid fa-info-circle', 'Info', 'No projects are currently running.');
    dialogpopupContainer.style.display = 'none';
    notificationTableBody.innerHTML = '';
    return;
  } else {
    // Show the notification and update the table body with the new data
    dialogpopupContainer.style.display = 'block';

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

const SEOTable = document.querySelector('.table__body');
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
        row_object['user image'] = decodeURIComponent(img.src);
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
  const tableData = toJSON(SEOTable);
  downloadFile(tableData, 'json', 'SEO_Data.json');
};

// Bind click event for CSV button
const csv_btn = document.querySelector('#csvBtn');
csv_btn.onclick = () => {
  const tableData = toCSV(SEOTable);
  downloadFile(tableData, 'csv', 'SEO_Data.csv');
};

// Bind click event for Excel button
const excel_btn = document.querySelector('#excelBtn');
excel_btn.onclick = () => {
  const includeImages = false; // Set this to true if you want to include image links, false or omit for a simple table
  const tableData = toExcel(tabletoExport, includeImages);
  downloadFile(tableData, 'excel', 'SEO_Data.xlsx');
};

// Bind click event for PDF button
const pdf_btn = document.querySelector('#pdfBtn');
pdf_btn.onclick = () => {
  toPDF(SEOTable);
};


