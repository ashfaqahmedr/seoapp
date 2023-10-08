//Show the Whole App UI including Tables and Dashboards

  function showAdminPanel() {

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
  
  //Add Siderbar Listeners to Auto Open and Close Sidebar on Mouse hover
  sidebar.addEventListener('mouseover', showSidebar);
  sidebar.addEventListener('mouseout', hideSidebar);

    closeBtn.addEventListener("click", function(){
        sidebar.classList.toggle("open");
        // tooltip.classList.toggle('open');
        menuBtnChange();
    });
  
  
  //Call Dashboard to be loaded
  getAllProjectsDataDashBoard();


   // Activate the "Dashboard" link on page load
  
   dashboardLink.classList.add('active');

  
  //Call Active Element Click
  ActivateElementClick();

   // Function to starting monitoring on loading of the page


  // 


  }

//Function to Update Menu Icon
  function menuBtnChange() {
    const btnElement = document.querySelector(".sidebar .logo_details #btn");
    btnElement.classList.toggle("open", sidebar.classList.contains("open"));
  }
  

  // Function to toggle the visibility of the notification panel
const toggleNotificationPanel = () => {
 
  if (dialogpopupContainer.style.display === 'none') {
    // Show the notification panel
    dialogpopupContainer.style.display = 'flex';

    btntoggleNotificationbtn.querySelector('i').className = 'fas fa-eye-slash';
    btntoggleNotificationbtn.setAttribute("data-tooltip", "Hide Notification");
    btnTogglenotiTexttext.textContent = "Hide Notification";


  } else {
    // Hide the notification panel
    dialogpopupContainer.style.display = 'none';

    btntoggleNotificationbtn.querySelector('i').className = 'fa fa-eye';
    btntoggleNotificationbtn.setAttribute("data-tooltip", "Show Notification");
    btnTogglenotiTexttext.textContent = "Show Notification";

  }
};



// Show Application Setting Dialog.

 // Function to Show User Dialog GOOGLE SERVER
 async function showProjSettDialog() {

defaultLoaderId='dialogLoader';

toggleLoader(defaultLoaderId, "popupCommonDialog")

showLoader();


    try {

      // Retrieve the file content from the API
   const response = await fetch(`${appurl}/AppSettings`, {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json'
     }
   });
  
   if (response.ok) {
   
     const data = await response.json();
  
   // Fill values in the Custom Setting Dialog
    //  clear the Inputs before loading the dialog 
  clearDialog(AppSettingDialog);
  
  console.log("Fill App Inputs : " + data)
  // Populate the input elements with the retrieved values

  checkWebApp.checked = data.checkWebApp;
  checkTesting.checked = data.checkTesting;
  checkUseGAPI.checked = data.checkUseGAPI;
  checkSyncGoogle.checked = data.checkSyncGoogle;
  checkUseLocalData.checked = data.checkUseLocalData;
  checkShowTestButtons.checked = data.checkShowTestButtons;
  checkWriteLogs.checked = data.checkWriteLogs;

  GAPISyncTime.value = data.GAPISyncTime;
  montiroingInterval.value = data.montiroingInterval;
  projectStatusInterval.value = data.projectStatusInterval;
  logClearTimer.value = data.logClearTimer;
 
  AppSettingDialog.style.display = 'flex';
  AppSettingDialog.showModal();

  hideLoader();

   }
  
     } catch (error) {
       console.error('Error retrieving settings:', error);
       createToast('SettingsToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Error retrieving settings from Local Server: ' + error);
       hideLoader();
     }

  
  }


  async function LoadAsWebApp() {

  showLoader();
    try {
  
   const  settingJSONData = {
        "checkWebApp": togglewebAppCheckBox.checked,
      }
  
      const response = await fetch(`${appurl}/AppSettings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settingJSONData)
  
      });
  
   if (response.ok) {
        // Try to hide when not called from AutoSync Function
  
    createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', 'Application will be Loaded as Web App within 3 Seconds!');
     hideLoader();

     // Reload Application after 3 Seconds.
     setTimeout(() => {
      location.reload();
          }, 3000);
  
   }
  } catch (error) {
    console.error('Error retrieving settings:', error);
    createToast('bodyToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Error Error while Updating Application Settings to Server: ' + error);
    hideLoader();
  }
  
   }  

   

 async function UpdateAppSettings() {

  try {
showLoader()
 const  settingJSONData = {

      "checkWebApp": checkWebApp.checked,
      "checkTesting": checkTesting.checked,
      "checkUseGAPI": checkUseGAPI.checked,
      "checkSyncGoogle":  checkSyncGoogle.checked ,
      "checkUseLocalData": checkUseLocalData.checked ,
      "checkShowTestButtons":  checkShowTestButtons.checked,
      "checkWriteLogs":  checkWriteLogs.checked ,
    
      "GAPISyncTime": parseInt( GAPISyncTime.value),
      "montiroingInterval": parseInt( montiroingInterval.value),
      "projectStatusInterval": parseInt( projectStatusInterval.value ),
      "logClearTimer": parseInt(logClearTimer.value),
  
  
    }

    const response = await fetch(`${appurl}/AppSettings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settingJSONData)

    });

 if (response.ok) {

      // Try to hide when not called from AutoSync Function

  createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', 'Application Settings has been Updated !');
  AppSettingDialog.close()
  AppSettingDialog.style.display="none";

   hideLoader();

 }
} catch (error) {
  console.error('Error retrieving settings:', error);
  createToast('bodyToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', 'Error Error while Updating Application Settings to Server: ' + error);
  hideLoader();
}

 }  


//Show Active Clicked Item in Sidebar
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
    
        dashboardLink.classList.add('active');
        // Add active class to the clicked link
        // this.classList.add('active');
      });

    });
    }


// Fiunction to Change Class of Menu Icon on toggle 
  function menuBtnChange(){

  }
  
// Function Create Table

function createTableFromData(data, createCheckboxes, tableId, isDashBoardTable, cellsToCapture=1) {
  
  const table = document.getElementById(tableId);

  if (!data || typeof data !== 'object'  && !table)  {
    hideLoader();
    console.error('Invalid data. Cannot create table.');
    // Call createToast function after error
    let type = 'error';
    let icon = 'fa-solid fa-circle-exclamation';
    let title = 'Error';
    let text = 'Invalid data. Cannot create table.';
    createToast('bodyToastDiv', type, icon, title, text);
    return;
  } else {
    table.innerHTML=''
  }

  // Create the table header
  const headers = Object.keys(data[Object.keys(data)[0]]);
  const tableHeader = document.createElement('thead');
  const headerRow = document.createElement('tr');


  if (createCheckboxes) {
    // Create a checkbox for "Select All" in the header
    const thCheckbox = document.createElement('th');
    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.id = 'selectAllCheckboxes';
    thCheckbox.appendChild(selectAllCheckbox);
    headerRow.appendChild(thCheckbox);

  }

  headers.forEach((header) => {
    const th = document.createElement('th');
    const ColHeaderspan = document.createElement('span');
    th.textContent = header.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    ColHeaderspan.classList.add('icon-arrow');
    ColHeaderspan.innerHTML = '&UpArrow;';
    th.appendChild(ColHeaderspan);
    headerRow.appendChild(th);
  });

  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);


const tableBody = document.createElement('tbody');


  Object.values(data).forEach((rowData) => {
    const row = document.createElement('tr');

    if (createCheckboxes) {
      // Create a checkbox for each row
      const cellCheckbox = document.createElement('td');
      const rowCheckbox = document.createElement('input');
      rowCheckbox.type = 'checkbox';
      cellCheckbox.appendChild(rowCheckbox);
      row.appendChild(cellCheckbox);
    }

    headers.forEach((header) => {
      const cell = document.createElement('td');
      const value = rowData[header];

      if (Array.isArray(value)) {
        cell.textContent = value.join(', ');
      } else if (header === 'timestamp' || header === 'date' && isISODate(value)) {
        const formattedDate = formatDate(value, true);
        cell.textContent = formattedDate;
      } else if (isISODate(value)) {
        const formattedDate = formatDate(value, false);
        cell.textContent = formattedDate;
      }
        else if (header === "link" || header === "url"  && value) {
          const link = document.createElement("a");
          link.href = value;
          link.target = "_blank";
          link.textContent = value;
          cell.appendChild(link);
        
      } else {
        cell.textContent = value !== undefined ? value : '';
      }

      cell.setAttribute('data-label', header);
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
   
let  searchInputID;
let recordCountElement;
let columnToSort;

  if (isDashBoardTable) {
    // Custom Right Click Menu

    columnToSort=0;

    enableCustomContextMenu(`${'#'+tableId} tbody`, "wrapper",  columnToSort);

        // Update the Custom Right Click Based on the table Data.
    updateMenuItems(apiCalltoMake, "wrapper");
    

    defaultLoaderId = 'loadingOverlay';
   

    searchInputID= 'searchInput'
  
    recordCountElement = 'recordCount'

    customContextMenu.style.display = 'flex';
   

    const selectPopupActions = document.getElementById('table-filter')
  

    selectPopupActions.addEventListener('mouseenter', () => {
      optionsContainer.style.display = 'block';
    });
  
    selectPopupActions.addEventListener('mouseleave', () => {
      optionsContainer.style.display = 'none';
    });

    options.forEach(option => {
      option.addEventListener('click', () => {
        selectedOption.innerHTML = option.innerHTML;
        optionsContainer.style.display = 'none';
        const selectedValue = option.getAttribute('data-value');
        searchTable(selectedValue);
      });
    });
  

    // Apply conditional Formatting
    
  } else {

      searchInputID = 'popupsearchinput';
      recordCountElement = 'PoprecordCount';
      columnToSort = 1;
    
      // Clone the context menu for the popupCommonDialog
      const contextMenu = document.getElementById("wrapper");
      const clonedContextMenu = contextMenu.cloneNode(true);
      const dialogPlaceholder = document.getElementById("clonedContextMenu");
    
      // Assign a dynamic id to the cloned context menu based on the tableId
      clonedContextMenu.id = "ContextMenuPopupDialog";
     
      defaultLoaderId = 'dialogLoader';
    
      // Clear any previous context menus and append the cloned context menu
      dialogPlaceholder.innerHTML = '';
      dialogPlaceholder.appendChild(clonedContextMenu);
    
      // Enable the custom context menu for the popupCommonDialog
      enableCustomContextMenu(`${'#' + tableId} tbody`, "ContextMenuPopupDialog", columnToSort);
    
         // Update the Custom Right Click Based on the table Data.
    updateMenuItems(apiCalltoMake, "ContextMenuPopupDialog");
    
  }

  // Search Table Function call
  const searchInput = document.getElementById(searchInputID);

  searchInput.addEventListener('input', function () {
    searchTable(tableId, searchInputID, recordCountElement); // Update with your table ID and search input ID
  });

  // searchTable(tableId, searchInputID);
  

 
  // Update Table Rows Count
  updateTableRowCount(tableId, recordCountElement)



  // Function to Conditional formatting 
applyConditionalFormatting(tableId);

      // Example usage:
  sortTable(tableId, parseInt(columnToSort), false); // Sort the 'main' table by the first column in ascending order

let sortAsc = true; // Initial sorting order

const tableHeadings = table.querySelectorAll('thead th');
const tableRows = Array.from(tableBody.querySelectorAll('tr'));
tableHeadings.forEach((head, i) => {
  head.onclick = () => {
    // Clear existing active states
    tableHeadings.forEach((head) => head.classList.remove('active'));
    table.querySelectorAll('td').forEach((td) => td.classList.remove('active'));

    // Add active state to the clicked header
    head.classList.add('active');
    tableRows.forEach((row) => {
      row.querySelectorAll('td')[i].classList.add('active');
    });

    // Toggle sorting order
    sortAsc = !sortAsc;
    
    // Call the sortTable function with the current column and sorting order
    sortTable(tableId, i, sortAsc);
  };
});


if (createCheckboxes) {

  handleCheckboxes(tableId, 'selectAllCheckboxes', cellsToCapture);
    // Remove values from array after delete.
    cellValuesArray = [];

  
       defaultLoaderId = 'dialogLoader';
 

}
  //Show Toast after table Loading
  createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', ' Data Fetched and Table creation completed successfully.');

  hideLoader();

}

 // Function to Update Table Rows Count
 function updateTableRowCount(tableId,recordCountElement ) {
  const table = document.getElementById(tableId);
  
  if (table) {
      const tbody = table.querySelector('tbody');
      
      if (tbody) {
          const rowCount = tbody.rows.length;
          const recordCounts = document.getElementById(recordCountElement);
          recordCounts.textContent = `Showing ${rowCount} of ${rowCount} record(s)`;
          // console.log("Total Table Rows Found: " + rowCount)
      }
  }
}


// Function Search Table

function searchTable(tableId, searchInputId, recordCountElement) {
  const table = document.getElementById(tableId);
  const searchInput = document.getElementById(searchInputId);

  if (!table || !searchInput) {
    console.error('Invalid table or search input.');
    return;
  }

  const allRows = table.querySelectorAll('tbody tr'); // Adjust the selector based on your table structure

  const searchData = searchInput.value.toLowerCase();

  let visibleCount = 0;
  let shouldShowCount = false; // Flag to determine if the count should be shown

  allRows.forEach((row, i) => {
    let tablecontent = row.textContent.toLowerCase();
    const isRowVisible = tablecontent.indexOf(searchData) >= 0;

    let cells = row.querySelectorAll('td'); // Adjust the selector based on your table structure

    // Reset cell styles to their original state
    cells.forEach((cell) => {
      cell.style.backgroundColor = '';
      cell.style.border = '';
    });

    if (searchData) {
      cells.forEach((cell) => {
        let cellContent = cell.textContent.toLowerCase();

        if (cellContent.includes(searchData)) {
          cell.style.backgroundColor = 'yellow'; // Highlight color
          cell.style.border = '1px solid red'; // Border color
          visibleCount++;
          shouldShowCount = true; // At least one visible row, so show the count
        }
      });
    }

    row.classList.toggle('hidden', !isRowVisible);

    if (!isRowVisible) {
      const rowText = row.textContent.trim().toLowerCase();
      if (rowText === '') {
        row.classList.add('hidden');
      }
    }
  });

  // Always show the count if there are visible rows
  const recordCounts = document.getElementById(recordCountElement);
  if (shouldShowCount) {
    const showingText = `Showing ${visibleCount} of ${allRows.length} record(s)`;
    recordCounts.textContent = showingText;
  } else {
    const showingText = `Showing ${allRows.length} of ${allRows.length} record(s)`;
    recordCounts.textContent = showingText;

  }
}



// Function to sort the table
function sortTable(tableId, column) {

  const table = document.getElementById(tableId);
  const tableBody = table.querySelector('tbody');
  const tableRows = Array.from(tableBody.querySelectorAll('tr'));
  const tableHeadings = table.querySelectorAll('thead th');
  const currentSortOrder = tableHeadings[column].classList.contains('asc');

  // Check if the clicked column header contains a checkbox input
  const columnHeader = tableHeadings[column];
  const checkboxInput = columnHeader.querySelector('input[type="checkbox"]');
  
  if (checkboxInput) {
    return; // Do nothing if the column header contains a checkbox input
  }



  // Clear existing active states
  tableHeadings.forEach((head) => head.classList.remove('active'));
  tableBody.querySelectorAll('td').forEach((td) => td.classList.remove('active'));

  // Apply active state to the clicked header
  const tableHeader = tableHeadings[column];
  tableHeader.classList.add('active');
  tableBody.querySelectorAll('tr').forEach((row) => {
    row.querySelector('td:nth-child(' + (column + 1) + ')').classList.add('active');
  });

  tableRows.sort((a, b) => {
    let firstRow = a.querySelector('td:nth-child(' + (column + 1) + ')').textContent.toLowerCase();
    let secondRow = b.querySelector('td:nth-child(' + (column + 1) + ')').textContent.toLowerCase();

    return currentSortOrder ? (firstRow > secondRow ? 1 : -1) : firstRow > secondRow ? -1 : 1;
  });

  tableRows.forEach((row) => {
    tableBody.appendChild(row);
  });

  // Toggle sorting order
  tableHeader.classList.toggle('asc', !currentSortOrder);
}

// Function to check if a value is in ISO date format
function isISODate(value) {
  return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/.test(value);
}

// // Function to format date to the specified format
// function formatDate(dateString, isTimestamp) {
//   const date = new Date(dateString);
//   if (isTimestamp) {
//     const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
//     return date.toLocaleString('en-US', options);
//   } else {
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const day = date.getDate().toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${month}-${day}-${year}`;
//   }
// }

function formatDate(dateString, includeTime = false) {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };

  if (includeTime) {
    options.second = '2-digit';
  }

  const formatter = new Intl.DateTimeFormat('en-US', options);
  return formatter.format(date);
}
//Apply status Classes

function applyConditionalFormatting(tableid) {


  const tableToCreate = document.getElementById(tableid);
  const rowsData = tableToCreate.querySelectorAll('tr');
  const statusColumnIndices = [];
  const headerRow = rowsData[0]; // Header row is at index 0

  // Find all the column indices of the "Status" columns in the header row
  const headerCells = headerRow.querySelectorAll('thead th');
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
  for (let i = 1; i < rowsData.length; i++) { // Start from index 1 to ignore header row
    const cells = rowsData[i].querySelectorAll('td');

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


function deleteRowsFromTableAndArray(tableId, columnIndex, targetValues) {
  const table = document.getElementById(tableId);
  const rows = table.getElementsByTagName('tr');

  // Identify rows to delete without deleting them immediately
  for (let i = 1; i < rows.length; i++) { // Start from index 1 to skip the header row
    const cells = rows[i].getElementsByTagName('td');
    if (columnIndex < cells.length) {
      const cellValue = cells[columnIndex].textContent.trim();
      if (targetValues.includes(cellValue)) {
        // Delete the row
        table.deleteRow(i);

        // Decrement i to adjust for the removed row
        i--;
      }
    }
  }

  if (tableId === 'main') {
    updateTableRowCount(tableId, 'recordCount');
  } else {
    updateTableRowCount(tableId, 'PoprecordCount');
  }
  
}

//Loadoverlay Div
// Function to show the loader
function showLoader(loaderId=defaultLoaderId) {

  const loader = document.getElementById(loaderId);
  if (loader) {
    loader.style.display = 'block';

  }

}

// Function to hide the loader
function hideLoader(loaderId=defaultLoaderId) {

  const loader = document.getElementById(loaderId);

  if (loader) {
    loader.style.display = 'none';
  }

}


//custom Right Click Menu

function enableCustomContextMenu(tableSelector, menuSelector, cellIndex) {
  const contextMenu = document.getElementById(menuSelector);
  const table = document.querySelector(tableSelector);

  table.addEventListener("contextmenu", e => {
    const target = e.target;

    if (target.tagName === "TD") {
      e.preventDefault();

      const row = target.parentNode;
      selectedRowId = row.cells[cellIndex].textContent.trim(); // Get the cell value based on the provided cell index

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

      // Calculate submenu's position
      let submenuPosX = mousePosX;
      let submenuPosY = mousePosY;

      // Check if the submenu goes beyond the right edge of the screen
      if (submenuPosX + menuWidth > windowWidth) {
        submenuPosX = maxMenuPosX;
      }

      // Check if the submenu goes beyond the bottom edge of the screen
      if (submenuPosY + menuHeight > windowHeight) {
        submenuPosY = maxMenuPosY;
      }

      contextMenu.style.left = `${submenuPosX}px`;
      contextMenu.style.top = `${submenuPosY}px`;
      contextMenu.style.visibility = "visible";

    } else {
      contextMenu.style.visibility = "hidden";
    }
  });

  document.addEventListener("click", () => {
    contextMenu.style.visibility = "hidden";
  });
}



//Function to Show Project Data Dialog with selected Project ID

function updateMenuItems(apiCall, contextmenu) {

  const menuElement = document.getElementById(contextmenu);

  if (contextmenu ==='wrapper') {

   defaultLoaderId = 'loadingOverlay';

  } else {

    defaultLoaderId = 'dialogLoader';
  }

  // Update menu item text and onclick event based on the API call

  // Menu items
  const editItem = menuElement.querySelector('#customEditData');
  const deleteItem = menuElement.querySelector('#customDeleteData');
  const addItem = menuElement.querySelector('#customAddData');
  const runItem = menuElement.querySelector('#customRuneData');

  switch (apiCall) {
    case 'usersData':
      editItem.querySelector('span').textContent = 'Edit User Data';
      deleteItem.querySelector('span').textContent = 'Delete User Data';
      addItem.querySelector('span').textContent = 'Add User Data';
      runItem.style.display = 'none';

      editItem.querySelector('i').className = 'fas fa-user-edit';
      addItem.querySelector('i').className = 'fas fa-user-plus';
      deleteItem.querySelector('i').className = 'fas fa-user-times';

      editItem.onclick = updateSelectedUserData;
      deleteItem.onclick = deleteSelectedUserData;
      addItem.onclick = showAddUserDialog;
      break;

    case 'ProjectsData':
      editItem.querySelector('span').textContent = 'Edit Project Data';
      deleteItem.querySelector('span').textContent = 'Delete Project Data';
      addItem.querySelector('span').textContent = 'Add Project Data';
      runItem.style.display = 'flex';
      runItem.querySelector('span').textContent = 'Run Selected Project';

      editItem.querySelector('i').className = 'far fa-edit';
      addItem.querySelector('i').className = 'fas fa-plus';
      deleteItem.querySelector('i').className = 'fas fa-trash-alt';

      editItem.onclick = fetchAndPopulateDialog;
      deleteItem.onclick = deleteUsingAPI;
      runItem.onclick = runProjectById;
      addItem.onclick = createnewJobID;
      break;

      case 'jsonData':
      
        // Hide for Web App as not Enabled for Now
        if (isWebApp) {
          addItem.style.display = 'none';
          deleteItem.style.display = 'none';
        } else {

          addItem.style.display = 'flex';
          addItem.querySelector('span').textContent = 'Add Domain Data';
          addItem.onclick = OpenAddDomainDialog;
          addItem.querySelector('i').className = 'fas fa-globe';

          deleteItem.querySelector('span').textContent = 'Delete Domain Data';
          deleteItem.querySelector('i').className = 'fas fa-trash';
          deleteItem.onclick = deleteDomainInfo;

        }
       

        runItem.style.display = 'none';
        // runItem.querySelector('span').textContent = 'Run Selected Project';
  
        editItem.querySelector('span').textContent = 'Edit Domain Data';
        editItem.querySelector('i').className = 'far fa-edit';
        editItem.onclick = populateDomainInfo;
       
        // runItem.onclick = runProjectById;
       
        break;

    // Add cases for other API calls

    default:
      // Default case if apiCall doesn't match any known API calls
      break;
  }
}


async function fetchAndPopulateDialog() {

  defaultLoaderId='dialogLoader';

  toggleLoader(defaultLoaderId, dialogProjectsDialog)

// Show the dialog loader
showLoader();

  clearDialog(dialogProjectsDialog);
 
     fetchDataAndHandle(selectedRowId, 'GETDATA'); // Make GET request


}


  // Function to complete all commands
  async function createProjects(isRunProjectRequired, isDuplicated) {
    // alert('New Article Creator ID: ' + newArticleCreatorID + ' New Post Uploader ID: ' + newPostUploaderID + ' New Blog ID: ' + newBlogID);

// Validate required fields and check if they are all filled
const isValid = validateRequiredFields(dialogProjectsDialog);

if (isValid) {

  
  fetchDataAndHandle(null, 'ADDDATA', isRunProjectRequired, isDuplicated); // Make GET request
  console.log("Passed from Add Main Function")

} else {
 createToast('ProjectToastDiv', 'info', 'fa-solid fa-info-circle', 'Info', 'Fill all required Inputs.');
}
}

// Function to Show Add Project Dialog only
function createnewJobID() {
 
if (isWebApp) {

// Populate Create Project Dialog Project Name, Poster name and ID and JobiD and URL from Web Api. 
populateDialogWithUniqueDataGAPI()

} else {

// Populate Create Project Dialog Project Name, Poster name and ID and JobiD and URL from Local Api. 
  populateDialogWithUniqueDataSEO("ADDDATA")

}

}


// Function to call update Data based on App Type
async function updateDataToApi(isRunProject) {

  fetchDataAndHandle(selectedRowId, 'UPDATEDATA', isRunProject, isUpdateDomainInfo); // Make GET request
   
  } 

  
    //Function to call deleteProjectData(selectedRowId) function with selected from Local Server and Google Server and show confirm dialog
    async function deleteUsingAPI(){
   
      const confirmDialogUse = await openConfrimDialog('Delete Selected Project ID: ? <br>' + selectedRowId, 'Do you want to DELETE Selected Project?');
    
      if (confirmDialogUse) { 
  
      deleteProjectData(selectedRowId);    
  
      }
    
    }
  
// Function to run project by ID and show loader while running
async function runProjectById() {


  runPorojectSEO(selectedRowId);

 }

 
 // Function to Show User Dialog GOOGLE SERVER
function showAddUserDialog() {

defaultLoaderId='dialogLoader';

toggleLoader(defaultLoaderId, "popupCommonDialog")

showLoader();

  btnaddUserInfo.style.display="none";
  btnudateUserInfo.style.display = 'none';
  

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

// Add Users to Google Server usning WEB APP API call
async function AddUserInfo() {

  // Validate required fields and check if they are all filled
  const isValid = validateRequiredFields(dialoguserDialog);

  if (isValid) {
    
 getandAddUsers("ADDUSERDATA"); 
  } else {
   createToast('UserToastDiv',  'info', 'fa-solid fa-info-circle', 'Info', 'Please fill all Inputs');
  }


}

// Show User Edit Data Dialog Google Server usning WEB APP API call
async function updateSelectedUserData() {

  

  btnaddUserInfo.style.display="none";
  btnudateUserInfo.style.display = 'flex';


  userDialogTitle.innerText="Update User's to Google Sheet"
userDialogSubTitle.innerText="Update the Required User's Info"


  

  getandAddUsers("GETUSERDATA", selectedRowId);


}


//  Update Users to Google Server usning WEB APP API call
async function updateUserDatabtnclk() {
  
 getandAddUsers("UPDATEUSERDATA", selectedRowId); 

}

//  Delete User to Google Server usning WEB APP API call
async function deleteSelectedUserData() {
 
  const confirmDialogUse = await openConfrimDialog('Delete Selected User ID: ? <br>' + selectedRowId, 'Do you want to DELETE Selected User?');

  if (confirmDialogUse) { 
    
    getandAddUsers("DELETEUSERDATA", selectedRowId); 
  }

}

//  Function to remove trailing "..." from a status
const removeTrailingDots = (status) => {
  return status.replace(/\.\.\.$/, '');
};

//Testing of Showing confirm Dialog
async function testConfirm() { 

const confirmDialogUse = await openConfrimDialog('Confirm Re-Run the Project?', 'Do you want to Re-Run the Completed Project again?');

if (confirmDialogUse) { 

}
}

// Function to open the dialog for testing sub function to  testConfirm()
function openDialog() {

  openConfrimDialog('Confirm Re-Run the Project?','Do you want to Re-Run the Completed Project again?')
     
}

//Open the comfirm dialog to be open when called with required dialog type.
function openConfrimDialog(titleHeader, confirmMessage) {
  return new Promise((resolve, reject) => {

    dialogTitleelement.textContent = titleHeader;
    confirmMessageelement.innerHTML = confirmMessage;
    // confirmIcon.className = `fas ${confirmIconClass}`;
    
    // Event listener for the confirm button
    btnConfirmConfirmDialog.addEventListener('click', function() {
      resolve(true); // Resolve the promise with true when confirm button is clicked
      closeDialog("confrimDialog");
    });

    // Event listener for the cancel button
    btncancelConfirmDialog.addEventListener('click', function() {
      resolve(false); // Resolve the promise with false when cancel button is clicked
      closeDialog("confrimDialog");
    });

    dialogconfrimDialog.style.display = 'flex'
    dialogconfrimDialog.showModal();
    
  });
}


// Data Table Option Selector
customSelect.addEventListener('mouseenter', () => {
  optionsContainer.style.display = 'block';
});

customSelect.addEventListener('mouseleave', () => {
  optionsContainer.style.display = 'none';
});

options.forEach(option => {
  option.addEventListener('click', () => {
    selectedOption.textContent = option.textContent;
    optionsContainer.style.display = 'none';
  });
});

// Function to remove event Handler from elements to avoid adding multiple events of same element.
function removeAllEventListeners(elements, eventType, eventHandler) {
  elements.forEach((element) => {
    element.removeEventListener(eventType, eventHandler);
  });
}






