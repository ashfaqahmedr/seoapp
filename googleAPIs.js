//Google API to make get All Projects data   request 
async function getAllProjectDataGAPI() {
  const constJSON = {
    action: "getAllProjects",
    username: LoggedUsername,
    dataItems: [
      {
        columnsToReturn: [
          "SheetID",
          "createdOn",
          "ProjectID",
          "ProjectName",
          "ProjectCreatorStatus",
          "PostUploaderId",
          "PostUploaderName",
          "PostUploaderStatus",
          "PostStartDate",
          "BlogId",
          "url",
          "SEOStatus",
        ],
      },
    ],
  };

  const responseData = await handleApiCall(
    googleurl,
    constJSON,
    30000,
    'All Projects data fetched successfully.',
    'An error occurred while fetching All projects Data.',  true, false
    
  );

  if (responseData.success) {
    tableData = responseData.data;
    console.log("getAllProjects Log")
    console.table(tableData);


    createTableFromData(tableData, false ,'main', true);  // Add checkboxes and use dashboard elements
   
  } else {
    console.error('Error fetching projects data:');
  }
}


//Function to Uppdate Dashboard Counts of projects 
//Google Api to make A Request to Uppdate  Dashboard Counts of projects  from Google Server  
async function updateSidebarCountsGAPI() {

  const responseData = await handleApiCall(
    googleurl,
    { action: 'getProjectCounts', username: LoggedUsername },
    30000,
    'ID count data fetched successfully from Google Server.',
    'Error fetching ID count from Google Server', false, false
  );

  console.log("Project Counts:" + responseData.data);

  // Update Counts
  updateDashboardCounts(responseData.data); // Assuming `statusCounts` is available in the scope where this function is called.
}


 //Function to show Aricle Creator Projects from Google Server
async function fetchArticleCreatorGAPI() {

  const constJSON = {
    action: "getCreatorProjects",
    username: LoggedUsername,
    dataItems: [
      {
        columnsToReturn: [
          "SheetID",
          "createdOn",
          "ProjectID",
          "ProjectName",
          "ProjectCreatorStatus",
          "BlogId",
          "url",
          "SEOStatus",
        ],
      },
    ],
  };

  const responseData = await handleApiCall(
    googleurl,
    constJSON,
    30000,
    'Article Creator Projects data fetched successfully.',
    'An error occurred while fetching Article Creator projects.',  true, false
  );

  // Generate the table based on the final formattedData object
  const tableData = responseData.data;
  console.log("Fetch Article Log")
  console.table(tableData);

  createTableFromData(tableData, true, 'popupCommonTable', false, 1);

  fetchDomainsAndShowCoDialog(true);

}

 //Function to show Post Uploader Projects from Google Server
 async function fetchPostUploaderGAPI() {

  const constJSON = {
    action: "getPostProjects",
    username: LoggedUsername,
    dataItems: [
      {
        columnsToReturn: [
          "SheetID",
          "createdOn",
          "PostUploaderId",
          "PostUploaderName",
          "PostUploaderStatus",
          "PostStartDate",
          "BlogId",
          "url",
          "SEOStatus"
        ],
      },
    ],
  };

  const responseData = await handleApiCall(
    googleurl,
    constJSON,
    30000,
    'Post Uploader Projects data fetched successfully.',
    'An error occurred while fetching Post Uploader projects.',  true, false
  );

  // Generate the table based on the final formattedData object

  const tableData = responseData.data;
  console.log("Uploader Log")
  console.table(tableData);


  createTableFromData(tableData, true, 'popupCommonTable', false, 1);

  fetchDomainsAndShowCoDialog(true);


}


 //Function to show Aricle Creator Projects from Google Server
 async function fetchJSONGAPI() {

  const constJSON = {
    action: "getJSON",
    username: LoggedUsername,
    dataItems: [
      {
        columnsToReturn: [
          "SheetID",
          "createdOn",
          "ProjectName",
          "BlogId",
          "username",
          "password",
          "group",
          "url",
          "SEOStatus"
        ],
      },
    ],
  };

  const responseData = await handleApiCall(
    googleurl,
    constJSON,
    30000,
    'JSON data fetched successfully.',
    'An error occurred while fetching JSON Data.',  true, false
  );

  // Generate the table based on the final formattedData object

  const tableData = responseData.data;
  console.log("JSON Log")
  console.table(tableData);

 
  createTableFromData(tableData, true, 'popupCommonTable', false, 1);

  fetchDomainsAndShowCoDialog(true);



}

 //Function to show Project by Status  from Google Server
 async function fetchProjectByStatusGAPI(articleStatus) {

  const responseData = await handleApiCall(
    googleurl,
    { action: 'getStatus', status: articleStatus, username: LoggedUsername },
    30000,
    'Projects by ' + articleStatus + ' data fetched successfully.',
    'An error occurred while fetching projects by Status '  + articleStatus,  true, false
  );

  // Generate the table based on the final formattedData object

  const tableData = responseData.data;
  console.log("project by status Log")
  console.table(tableData);

  createTableFromData(tableData, true, 'popupCommonTable', false, 1);

  fetchDomainsAndShowCoDialog(true);


}

// Function to populate values in Project Name from api call
// Function to fetch unique project data from the API and populate the dialog
async function populateDialogWithUniqueDataGAPI() {

  // const constJSON = {
  //   action: "getListofProjectsDomains",
  //   username: LoggedUsername,
  //   dataItems: [
  //     {
  //       "getData": false,
  //       "uniqueData": true,
  //      "columnPairs": [["ProjectName"], ["PostUploaderId", "PostUploaderName"], ["BlogId", "url", "username", "password", "group"]]
  //     }
  //   ]
  // };

  // const responseData = await handleApiCall(
  //   googleurl,
  //   constJSON,
  //   30000,
  //   'Uniquew Project Name(s) and JobID(s)  fetched successfully.',
  //   'An error occurred while fetching Uniquew Project Name(s) and JobID(s) Data ',  true, false
  // );

  // const projectNames = responseData.uniqueData;
  // console.log("get UniqueData Log")
  // console.table(projectNames);

  // Set Dialog Title
  DialogTitle.textContent="Add New Project to SEO"

      // Populate input elements in the dialog with the options obtained from the API response
  populateInputsFromUniqueData(false, "ADDDATA");
 
}

//Get Data from Selected Project ID for request
async function getSelectedProjectDataGAPI(selectedRowId) {

  console.log("Selected Row ID: " + selectedRowId)
  const constJSON = {
    action: "getProjects",
    username: LoggedUsername,
    dataItems: [
      {
        columntoFind: "SheetID",
        valueToFind: selectedRowId,
        columnsToReturn: [
          "SheetID",
          "createdOn",
          "ProjectID",
          "ProjectName",
          "ProjectCreatorStatus",
          "ProjectKeyowrds",
          "ProjectCatagories",
          "PostUploaderId",
          "PostUploaderName",
          "PostUploaderStatus",
          "PostStartDate",
          "BlogId",
          "url",
          "username",
          "password",
          "group",
          "JobCronString",
          "ImageType",
          "ImageStatus",
          "SEOStatus"
        ],
        "uniqueData": true,
       "columnPairs": [["ProjectName"], ["PostUploaderId", "PostUploaderName"], ["BlogId", "url", "username", "password", "group"]]
      }
    ]
  };


  const responseData = await handleApiCall(
    googleurl,
    constJSON,
    30000,
    'Project Data  by Sheet ID: ' + selectedRowId + ' fetched successfully.',
    'An error occurred while fetching Project Data for Sheet ID : '+ selectedRowId ,  true, false
  );

  const dataToParse = responseData.data[0];
  console.log("get Selected Project Log")
  console.table(dataToParse);



  const projectNames = responseData.uniqueData;
  console.log("get UniqueData Log")
  console.table(projectNames);

  // Fill Options for the Project Name, Post Project and Blog ID
  populateInputsFromUniqueData(projectNames, "GETDATA");

    // Populate Project Data
    populateProjectData(dataToParse);

  // createTableFromData(dataToParse);
  
}


//Google Api to make Upadate selected Project Request
async function updateSelectedProjectDataGAPI(selectedRowId, jsonData, isRunProjectRequired, isSyncCall=false) {
  
  let LocalSEOStatus;
  let columntoFind;
  // If call is Local or Web App


  if (isWebApp && !isRunProjectRequired) {
    columntoFind="SheetID"
    LocalSEOStatus="Edit"

  } 

  if (isWebApp && isRunProjectRequired) {
    columntoFind="SheetID"
    LocalSEOStatus="EditRun"

  } 

  if (isSyncCall && GAPIRequired) {
    columntoFind="SheetID"
    LocalSEOStatus="Updated"
  }
  
  const constJSON = {
    action: 'updateProjectsData',
    username: LoggedUsername,
    dataItems: [
      {
      columntoFind: columntoFind,
      valueToFind: selectedRowId,
      ...jsonData, // Include the base setting data
      SEOStatus: LocalSEOStatus,
      EditedBy : LoggedFullName
    }
  ]
};

console.log("Update Settings Log")
console.table(constJSON)

const isSuccess = await handleApiCall(
  googleurl,
  constJSON,
  30000,
  'Selected Project Data has been Updated successfully.',
  'An error occurred while Updating selected Project data',  false, true
);

if (isSuccess) {

  // Assuming you have the row index stored in selectedRowIndex

  const table = document.getElementById('main');
  const row = table.rows[selectedRowIndex];

    if (row) {

      row.cells[3].textContent = articleProjectNameInput.value;
  
    // Update ProjectStatus span element
    const projectStatusSpan = row.cells[4].querySelector('span.status-pill');
    const cleanedProjectStatus = removeTrailingDots(ProjectStatusinput.value);
    projectStatusSpan.textContent = ProjectStatusinput.value;
    projectStatusSpan.className = 'status-pill'; // Remove all classes and set to 'status-pill'
    projectStatusSpan.classList.add(`status-${cleanedProjectStatus.toLowerCase()}`);
      row.cells[6].textContent = postJobNameInput.value;
  
    // Update PostUploaderStatus span element
    const postUploaderStatusSpan = row.cells[7].querySelector('span.status-pill');
    const cleanedPostUploaderStatus = removeTrailingDots(PostUploaderStatusInput.value);
    postUploaderStatusSpan.textContent = PostUploaderStatusInput.value;
    postUploaderStatusSpan.className = 'status-pill'; // Remove all classes and set to 'status-pill'
    postUploaderStatusSpan.classList.add(`status-${cleanedPostUploaderStatus.toLowerCase()}`);
  
      row.cells[8].textContent = postDateInput.value;
      row.cells[10].textContent = blogUrlInput.value;

  
      const seoStatusSpan = row.cells[11].querySelector('span.status-pill');
      const cleanedSEOStatus = removeTrailingDots(LocalSEOStatus);
      seoStatusSpan.textContent = LocalSEOStatus;
      seoStatusSpan.className = 'status-pill'; // Remove all classes and set to 'status-pill'
      seoStatusSpan.classList.add(`status-${cleanedSEOStatus.toLowerCase()}`);

      dialogProjectsDialog.close()
      dialogProjectsDialog.style.display="none";



      // // Update data based on ProjectID
      const formattedDate = formatDate(jsonData.PostStartDate, true);

      modifyTableData('update', {
        SheetID: selectedRowId,
        ProjectID: ProjectIDInput.value,
        ProjectName: jsonData.ProjectName,
        ProjectCreatorStatus: ProjectStatusinput.value,
        PostUploaderId: jsonData.PostUploaderId,
        PostUploaderName: jsonData.PostUploaderName,
        PostUploaderStatus: PostUploaderStatusInput.value,
        PostStartDate: formattedDate,
        BlogId: jsonData.BlogId,
        url:  jsonData.url,
        SEOStatus: SEOStatusInput.value
      },'SheetID');

      createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', 'Project Data has been Updated!');

    
  }
}     
}

//Google Api to make Create Project Request
async function createSelectedProjectDataGAPI (jsonData, isRunProjectRequired=false, isDuplicated=false, isSyncCall=false) {

  console.log("Passed from createSelectedProjectDataGAPI")
  let SeoStatus;


  // For Add Run Prpject
  if (!isRunProjectRequired && !isDuplicated) {
    SeoStatus= "Add"
  }

  // For Run Prpject
  if (isRunProjectRequired) {
  SeoStatus= "AddRun"
}

// For Duplicate
  if (isDuplicated) {
    SeoStatus= "Duplicate"
  } 

  // For Add Run Prpject
  if (isRunProjectRequired && isDuplicated) {
    SeoStatus= "DuplicateRun"
  }


  const constJSON = {
    action: 'addProjectData',
    username: LoggedUsername,
    dataItems: [
      {
        ...jsonData,
        // ProjectID: "",
        ProjectCreatorStatus: "draft", // Use corresponding input element
        // PostUploaderId:  "",
        PostUploaderStatus: "draft" , // Use corresponding input element
        // BlogId: "",
        ImageStatus: "NA",
        SEOStatus: SeoStatus, // Use corresponding input element
        CreatedBy: LoggedFullName
      },
    ],
  };

  console.table(constJSON)
 

console.log("Create Selcted Log")
console.table(constJSON)

const isSuccess = await handleApiCall(
  googleurl,
  constJSON,
  30000,
  'Selected Project Data has been Updated successfully.',
  'An error occurred while Updating selected Project data',  false, true
);

    if (isSuccess) {
    // Make API Call to Update Projects Web API
      updateSidebarCountsGAPI() 

    // Add a new row at index 2 (third row)
    const table = document.getElementById('main');
    const newRow = table.insertRow(1);

    // Insert cells and set their content
    for (let i = 0; i < 12; i++) {
      const cell = newRow.insertCell(i);
      cell.textContent = '';
    }

    // Set specific cell values based on input fields and create status spans
    newRow.cells[0].textContent = GAPISheetID;

    const currentDate = new Date();

    const formattedDate = formatDate(currentDate, true);

    newRow.cells[1].textContent =formattedDate;


    newRow.cells[3].textContent = articleProjectNameInput.value;

    const statusSpan1 = document.createElement('span');
    statusSpan1.className = 'status-pill status-draft';
    statusSpan1.textContent = 'draft';
    newRow.cells[4].appendChild(statusSpan1);

    newRow.cells[6].textContent = postJobNameInput.value;

    const statusSpan2 = document.createElement('span');
    statusSpan2.className = 'status-pill status-draft';
    statusSpan2.textContent = 'draft';
    newRow.cells[7].appendChild(statusSpan2);

    newRow.cells[8].textContent = postDateInput.value;
    newRow.cells[9].textContent = BlogIdInput.value;


    newRow.cells[10].textContent = blogUrlInput.value;

    const statusSpan3 = document.createElement('span');
    statusSpan3.className = 'status-pill status-'+SeoStatus;
    statusSpan3.textContent = SeoStatus;
    newRow.cells[11].appendChild(statusSpan3);

    console.log('Article Creator Data has been saved!');
    dialogProjectsDialog.style.display="none";
    dialogProjectsDialog.close();

    
    modifyTableData('add', {
      SheetID: GAPISheetID,
      createdOn: formattedDate,
      ProjectID: '',
      ProjectName: constJSON.ProjectName,
      ProjectCreatorStatus: 'draft',
      PostUploaderId: '',
      PostUploaderName: constJSON.PostUploaderName,
      PostUploaderStatus: 'draft',
      PostStartDate: formattedDate,
      BlogId:'',
      url:  constJSON.url,
      SEOStatus:SeoStatus
    },'SheetID');
    
    }

    createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', 'Project Data has been Created!');

}

// Google Api to delete Project from Local App
async function  deleteSelectedProjectfromSEOLOCAL(selectedRowId) {

  const constJSON = {
    action: 'deleteProjectsData',
    username: LoggedUsername,
    dataItems: [
      {
      columntoFind: "sheetID",
      valueToFind: selectedRowId,
    }
  ]
};

console.log("Delete Project Log")
console.table(constJSON)

const isSuccess = await handleApiCall(
  googleurl,
  constJSON,
  30000,
  'Selected Project Data has been DELETED successfully.',
  'An error occurred while DELETING selected Project data',  false, true
);

if (isSuccess) {

  createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', 'Selected Project and its related Data has been Deleted! <br> Project ID :' + selectedRowId);
  
  }
      
}

// Function to Mark RUN or DELETE
// Function to perform an action (run or delete)
async function performAction(selectedRowId, action, userConfirmation) {
  

  const constJSON = {
    action: action === 'Run' ? 'runProjectFromWebApp' : 'deleteProjectFromWebApp',
    username: LoggedUsername,
    dataItems: [
      {
        columnToFind: "SheetID",
        valueToFind: selectedRowId,
        action: action,
        userConfirmation: userConfirmation,
        EditedBy: LoggedFullName
      }
    ]
  };

  
  const responseData = await handleApiCall(
    googleurl,
    constJSON,
    30000,
    'Selected Project Data has been Marked as ' + action + ' successfully.',
    'An error occurred while DELETING selected Project data',true,true
  );


    console.log("API Response from Function Delete:");
    
    console.table(responseData);

    const sheetID = responseData[0].SheetID;
    const APImessage = responseData[0].message;
    const status = responseData[0].status || null; // Get the status if it exists;
    const confirm = responseData[0].confirm || false; // Get the confirm flag if it exists

    console.log('Message from API:', APImessage);

    let isSuccess;
    if (confirm) {
      // Ask for user confirmation before making the action
      const userConfirmation = await openConfrimDialog('Confirm Action <br>', APImessage);

      if (userConfirmation) {
        // If the user confirms, recall the API with userConfirmation set to true
        isSuccess=  performAction(selectedRowId, action, true);
      } else {

        // User canceled the confirmation
        return;
      }
    }

    if (isSuccess) {
      // Show success toast


      createToast('ProjectToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', `Success: ${isSuccess}<br>ID: ${sheetID}<br>Message: ${APImessage}`);
    
  // delete from Table
if (action==='Run') {

  const table = document.getElementById('main');
  const row = table.rows[selectedRowIndex];

  if (row) {

  const seoStatusSpan = row.cells[11].querySelector('span.status-pill');
      const cleanedSEOStatus = removeTrailingDots(action);
      seoStatusSpan.textContent = action;
      seoStatusSpan.className = 'status-pill'; // Remove all classes and set to 'status-pill'
      seoStatusSpan.classList.add(`status-${cleanedSEOStatus.toLowerCase()}`);

  }


 } else {


  deleteRowsFromTableAndArray('main', 0, selectedRowId)
  // Remove from Object
modifyTableData('remove', { SheetID: selectedRowId }, 'SheetID');

 }

     
    } else {

      if (status === 'info') {
        // Show info toast for actions already set in SEOStatus
        createToast('ProjectToastDiv', 'info', 'fa-solid fa-info-circle', 'Info', `Info: ${status}<br>ID: ${sheetID}<br>Message: ${APImessage}`);
      } else {
        // Show error toast for other unsuccessful actions
        createToast('ProjectToastDiv', 'error', 'fa-solid fa-circle-exclamation', 'Error', `Error: ${isSuccess}<br>ID: ${sheetID}<br>Message: ${APImessage}`);
      }
    }
  
}



//Google Api to make A Update Current Project Status on Google Server  Request
async function UpdateSelectedProjectStatusGAPI(IdToUpdate, projectType, currentStatus) {

  let columntoFind;
  let ProjectCreatorStatus;
  let PostUploaderStatus;
  let SEOStatus;

  if (currentStatus === 'complete' && projectType === 'article creator') {

    columntoFind = "ProjectID";
    ProjectCreatorStatus =currentStatus;
    PostUploaderStatus = 'waiting';
    SEOStatus = 'running';

  } else if (currentStatus === 'complete' && projectType !== 'article creator') {
    columntoFind = "PostUploaderId";
    ProjectCreatorStatus = "complete";
    PostUploaderStatus = currentStatus;
    SEOStatus = 'complete';
  } else if (currentStatus === 'failed' || currentStatus === 'aborted' || currentStatus === '') {
    if (projectType === 'article creator') {
      columntoFind = "ProjectID";
      ProjectCreatorStatus = currentStatus;
      PostUploaderStatus = 'failed';
      SEOStatus = 'failed';
    } else {
      columntoFind = "PostUploaderId";
      ProjectCreatorStatus = "complete";
      PostUploaderStatus = currentStatus;
      SEOStatus = 'failed';
    }
  }

  const constJSON = {
    action: 'updateProjectsData',
    username: LoggedUsername,
    dataItems: [
      {
        columntoFind: columntoFind,
        valueToFind: IdToUpdate,
        ProjectCreatorStatus,
        PostUploaderStatus,
        SEOStatus,
      }
    ]
  };

  console.table(constJSON);

  console.log("Update Settings Log")
  console.table(constJSON)
  
const success=  await handleApiCall(
    googleurl,
    constJSON,
    30000,
    'Selected Project Data has been Updated successfully.',
    'An error occurred while Updating selected Project data',  false, true
  );
  
  if (success) {


    modifyTableData('update', {
      SheetID: IdToUpdate,
      ProjectCreatorStatus: ProjectCreatorStatus,
      PostUploaderStatus: PostUploaderStatus,
      SEOStatus: SEOStatus
    },'SheetID');

  
  }
}


//Google API to get Project Settings request projects  from  Google Server  
async function getProjectSettingGAPI() {
  // Make Google API Call
  const getJSON = {
    action: 'getProjectSettings',
    username: LoggedUsername,
    dataItems: [{}],
  };

    const responseData = await handleApiCall(
      googleurl,
      getJSON,
      30000,
      'Settings have been loaded!',
      'Error retrieving settings from GOOGLE SERVER:',  true, false
    );

    // Populate the input elements for GOOGLE SERVER Data
    const dataToParse = responseData.data[0];
    console.log("project by status Log")
    console.table(dataToParse);

   
    // Fill values from data to Dialog
    fillCustomSettingDialogValues(dataToParse);
  
}

  //Google API to make Update Project Settings request
async function UpdateProjectSettingGAPI(jsonData, sheetId=false) {

  let LocalSEOStatus;
  // If call is Local or Web App
  if (!isWebApp) {
    LocalSEOStatus="complete"
  } else {
    LocalSEOStatus="edit"
  }

let  constJSON
 if (!GAPIRequired) { 
      constJSON = {
        action: 'updatesettingData',
        username: LoggedUsername,
        dataItems: [
          {
          columntoFind: "SheetID",
          valueToFind: sheetIDInput.value,
          ...jsonData, // Include the base setting data
          "SEOStatus": LocalSEOStatus
        }
      ]
    };

} 

if (GAPIRequired && sheetId){

  constJSON = {
    action: 'updatesettingData',
    username: LoggedUsername,
    dataItems: [
      {
      columntoFind: "SheetID",
      valueToFind: sheetId,
      "SEOStatus": LocalSEOStatus
    }
  ]
};

}

console.log("Update Settings Log")
console.table(constJSON)

const isSuccess = await handleApiCall(
  googleurl,
  constJSON,
  30000,
  'Project Settings has been Updated successfully to GAPI Server.',
  'An error occurred while Updating the Project Settings',  GAPIRequired , true
);

if (isSuccess && !GAPIRequired) {
    customSettingDialog.close()
    customSettingDialog.style.display="none";
    createToast( 'SettingsToastDiv', 'success', 'fa-solid fa-check', 'Success', 'Custom Settings has been Saved to Google Server');

  }
}


//Function to show All Users data from Google Server
async function fetchUsersGAPI() {

  
  const constJSON = {
    action: "getUsers",
    username: LoggedUsername,
    dataItems: [
      {
        columnsToReturn: [
          "SheetID",
          "timestamp",
          "FullName",
          "userName",
          "UserType",
          "TimeOutMinute",
          "SEOStatus"
      ]
      },
    ],
  };

  const responseData = await handleApiCall(
    googleurl, 
    constJSON,
    30000,
    'Users data fetched successfully.',
    'An error occurred while fetching users.',  true, false
  );

  // Generate the table based on the final formattedData object

  const tableData = responseData.data;
  console.log("Get All Users Log")
  console.table(tableData);

  createTableFromData(tableData, true, 'popupCommonTable', false, 1);

  fetchDomainsAndShowCoDialog(true);

}


//Function to show selected User Data from Google Server
async function fetchSelectedUsersGAPI(selectedRowId) {

  const constJSON = {
    action: "getUsers",
    username: LoggedUsername,
    dataItems: [
      {
        columntoFind: "SheetID",
        valueToFind: selectedRowId,
        columnsToReturn: [
          "SheetID",
          "FullName",
          "userName",
          "UserType",
          "TimeOutMinute",
          "SEOStatus"
        ]
       
      }
    ]
  };


  const responseData = await handleApiCall(
    googleurl,
    constJSON,
    30000,
    'User Data  by Sheet ID: ' + selectedRowId + ' fetched successfully.',
    'An error occurred while fetching User Data for Sheet ID : '+ selectedRowId ,  true, false
  );

  const dataToParse = responseData.data[0];
  console.log("get Selected User Log")
  console.table(dataToParse);

  fillUserDataDialog(dataToParse)

}


//Function to Add User Data to Google Server
async function addUsersDataGAPI(jsonData, isWebApp) {

  let LocalSEOStatus;
  // If call is Local or Web App
  // if (isLocal) {
    LocalSEOStatus="complete"
  // } else {
    // LocalSEOStatus="edit"
  // }

  const constJSON = {
    action: 'addUsersData',
    username: LoggedUsername,
    dataItems: [
      {
      ...jsonData, // Include the base jsonData data
      SEOStatus: LocalSEOStatus,
      Salt: ""
    }
  ]
};


console.log("Update Settings Log")
console.table(constJSON)

const isSuccess = await handleApiCall(
  googleurl,
  constJSON,
  30000,
  'Project Settings has been Updated successfully.',
  'An error occurred while Updating the Project Settings',  false, true
);

if (isSuccess) {

  // Only Add this Row if Current Visible Data is User Data
  if  (isWebApp) {
  // In future Add Row to Table also

  dialoguserDialog.close()
  dialoguserDialog.style.display="none";

  createToast( 'bodyToastDiv', 'success', 'fa-solid fa-check', 'Success', 'User Data has been Added');

  }
}
}


//Function to update User Data to Google Server
async function updateSelectedUsersDataGAPI(selectedRowId, jsonData, isLocal) {

  
    let LocalSEOStatus;
    // If call is Local or Web App
    // if (isLocal) {
      LocalSEOStatus="complete"
    // } else {
      // LocalSEOStatus="edit"
    // }
  
    const constJSON = {
      action: 'updateUsersData',
      username: LoggedUsername,
      dataItems: [
        {
        columntoFind: "SheetID",
        valueToFind: selectedRowId,
        ...jsonData, // Include the base setting data
        SEOStatus: LocalSEOStatus,
      }
    ]
  };
  
  
  console.log("Update User Log")
  console.table(constJSON)
  
  const isSuccess = await handleApiCall(
    googleurl,
    constJSON,
    30000,
    'Selected Project Data has been Updated successfully.',
    'An error occurred while Updating selected Project data',  false, true
  );
  
  if (isSuccess) {
  
    dialoguserDialog.close()
    dialoguserDialog.style.display="none";
 
    createToast( 'bodyToastDiv', 'success', 'fa-solid fa-check', 'Success', 'User Data has been Updated');

    }
        
  
  
}

//Function to update User Data to Google Server
async function deleteSelectedUsersDataGAPI(selectedRowId, isLocal=true) {

  
  let LocalSEOStatus;
  // Not available in Local App
  if (isLocal) {
    LocalSEOStatus="complete"
  } else {
    LocalSEOStatus="edit"
  }

  const constJSON = {
    action: 'deleteUsersData',
    username: LoggedUsername,
    dataItems: [
      {
      columntoFind: "SheetID",
      valueToFind: selectedRowId,
    }
  ]
};


console.log("Delete User Log")
console.table(constJSON)

const isSuccess = await handleApiCall(
  googleurl,
  constJSON,
  30000,
  'Selected User Data has been DELETED  successfully.',
  'An error occurred while DELETING selected User data',  false, true
);

if (isSuccess) {

  dialoguserDialog.close()
  dialoguserDialog.style.display="none";
  
  createToast( 'bodyToastDiv', 'success', 'fa-solid fa-check', 'Success', 'User Data has been Deleted');
   
  }
      


}

// Function to Get All data from GAPI
async function getProjectsfromGAPI() {

 
const constJSON = {
    action: "getListofActionsSEOLOCAL",
    
username: LoggedUsername
  };

  
  const responseData = await handleApiCall(
    googleurl,
    constJSON,
    30000,
    'All Projects data fetched successfully.',
    'An error occurred while fetching All projects Data.',  true, false
    
  );



    console.table(responseData);

  // Assuming you have already fetched the API response and stored it in responseData
const success = responseData.success;

if (success) {

  //Show Toast after table Loading
  createToast('bodyToastDiv', 'success', 'fa-solid fa-circle-check', 'Success', ' Data Fetched and Table creation completed successfully.');


  const data = responseData.data;



  console.log("API Data:");
  console.table(data);

  // Process ProjectsSettings
  const projectsSettings = data.ProjectsSettings;
  if (projectsSettings) {
    console.log("Projects Settings:");
    console.table(projectsSettings);
  }

  // Process DomainsInfoAdd
  const domainsInfoAdd = data.DomainsInfoAdd;
  if (domainsInfoAdd) {
    console.log("Domains Info Add:");
    console.table(domainsInfoAdd);
  }

  // Process ProjectsInfoAdd
  const projectsInfoAdd = data.ProjectsInfoAdd;
  if (projectsInfoAdd) {
    console.log("Projects Info Add:");
    console.table(projectsInfoAdd);
  }

  // Process ProjectsInfoEdit
  const projectsInfoEdit = data.ProjectsInfoEdit;
  if (projectsInfoEdit) {
    console.log("Projects Info Edit:");
    console.table(projectsInfoEdit);
  }

  // Process ProjectsInfoRun
  const projectsInfoRun = data.ProjectsInfoRun;
  if (projectsInfoRun) {
    console.log("Projects Info Run:");
    console.table(projectsInfoRun);
  }

  // Process ProjectsInfoDelete
  const projectsInfoDelete = data.ProjectsInfoDelete;
  if (projectsInfoDelete) {
    console.log("Projects Info Delete:");
    console.table(projectsInfoDelete);
  }
} else {

  
  createToast('bodyToastDiv', 'info', 'fa-solid fa-info-circle', 'Info', 'There are no data to be  Updated  on SEO App from Google Server.');

  // Handle the case where success is false
  const errorMessage = responseData.message;
  console.error("API Error:", errorMessage);
}


}

// Testing for the Server
async function GAPICommandsForSEOServer() {
  try {

    const constJSON = {
      action: "getListofActionsSEOLOCAL",
      username: LoggedUsername,
    };


    const responseData = await handleApiCall(
      googleurl,
      constJSON,
      30000,
      'All Projects data fetched successfully.',
      'An error occurred while fetching All projects Data.',  true, false
      
    );
  
    if (responseData.success) {
      tableData = responseData.data;
      console.log("getAllProjects Log")
      console.table(tableData);
  
      const data = responseData.data;
      console.log("API Data:");
      console.table(data);

      // Process ProjectsSettings
      const projectsSettings = data.ProjectsSettings;
      if (projectsSettings) {
        console.log("Projects Settings:");
        console.table(projectsSettings);
        // Process each project setting
        for (const settingData of projectsSettings) {
          if (settingData.success) {
            // Call your function to update project settings locally
        

            for (const settingData of projectsSettings) {
              if (settingData.success) {

                const isSettingsUpdated =   await updateProjectSettingsLocal(settingData.SheetID, true);

                if (isSettingsUpdated) {

                  UpdateProjectSettingGAPI(null, settingData.SheetID)
      
                }


              }
            }


          }
        }
      }



      // Process DomainsInfoAdd                 Complete
      const domainsInfoAdd = data.DomainsInfoAdd;
      if (domainsInfoAdd) {
        console.log("Domains Info Add:");
        console.table(domainsInfoAdd);

        for (const domainData of domainsInfoAdd) {
          if (domainData.success) {
            createNewBlogID(domainData.Data);
          }
        }
        }
      

      // Process ProjectsInfoAdd            Create Project and Local Function Update Back to server
      const projectsInfoAdd = data.ProjectsInfoAdd;

      if (projectsInfoAdd) {
        for (const projectData of projectsInfoAdd) {
          if (projectData.success) {
            const action = projectData.action;

            if (action === 'Add') {

              createProjectsONSEO(projectData, false, false, true)
             
            } else if (action === 'AddRun') {

              createProjectsONSEO(projectData, true, false, true)
              
            }
          }
        }


         // Process ProjectsInfoDuplicate
         const projectsInfoDuplicate = data.ProjectsInfoDuplicate;
         if (projectsInfoDuplicate) {
          console.log("Projects Info Duplicatate:");
          console.table(projectsInfoDuplicate);

           for (const duplicateData of projectsInfoDuplicate) {
             if (duplicateData.success) {
               const action = duplicateData.action;
   
               if (action === 'Duplicate') {

                createProjectsONSEO(duplicateData, false, true, true)
               

               } else if (action === 'DuplicateRun') {
                
                createProjectsONSEO(duplicateData, true, true, true)
               
               }
             }
           }
         }

      // Process ProjectsInfoEdit
       // Process ProjectsInfoEdit
       const projectsInfoEdit = data.ProjectsInfoEdit;
       if (projectsInfoEdit) {

        console.log("Projects Info Edit:");
        console.table(projectsInfoEdit);

         for (const editData of projectsInfoEdit) {
           if (editData.success) {
             const action = editData.action;
             const ProjectID = editData.ProjectID;
             const PostUploaderId = editData.PostUploaderId;
             const BlogId = editData.BlogId;
            
             if (action === 'Edit') {
               updateDatatoSEO(ProjectID, PostUploaderId, BlogId, editData, false, true);
                  
             } else if (action === 'EditRun') {
               updateDatatoSEO(ProjectID, PostUploaderId, BlogId, editData, true, true);
             }
           }
         }
       }
 
      // Process ProjectsInfoRun
      const projectsInfoRun = data.ProjectsInfoRun;
      if (projectsInfoRun) {
        console.log("Projects Info Run:");
        console.table(projectsInfoRun);
        // Process each project info run

        for (const runData of projectsInfoRun) {
          if (runData.success) {

            runSelectedProjectSEO(runData.ProjectID, false);

          }
        }
      }

      // Process ProjectsInfoDelete
      const projectsInfoDelete = data.ProjectsInfoDelete;
      if (projectsInfoDelete) {
        console.log("Projects Info Delete:");
        console.table(projectsInfoDelete);
        for (const deleteData of projectsInfoDelete) {
          if (deleteData.success && deleteData.Data.action === 'Delete') {
            deleteProjectDatafromSEO( deleteData.ProjectID,true, deleteData.SheetID);
         
          }
        }
      }
    } else {
      // Handle the case where success is false
      const errorMessage = responseData.message;
      console.error("API Error:", errorMessage);
    }
  }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

