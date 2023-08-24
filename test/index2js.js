
// Fetch all users and projects data and create tables for them
const tableElement = document.getElementById('responseTableContainer');
const getAllUsersBtn = document.getElementById('getAllUsersBtn')
const getAllProjectsBtn = document.getElementById('getAllProjectsBtn');


const addUsersDialog =document.getElementById("addUsersDialog")
const addUsersBtn = document.getElementById("addUsersBtn");
addUsersBtn.addEventListener("click", () => {
  addUsersDialog.showModal();
});


const addUsersForm = document.getElementById("addUsersForm");
const addDataToGSheet = document.getElementById("addData");
const closeuserform = document.getElementById("closeAddUsersDialog");

closeuserform.addEventListener("click", () => {
  addUsersDialog.close();
})


// Set form values when the dialog opens

const addProjectDialog =document.getElementById("createProjectDialog")
const createProjectBtn = document.getElementById("createProjectBtn");
const addProjectsForm = document.getElementById("createProjectForm");
const addProjectToGSheet = document.getElementById("addProjectData");
const closeprojectDialog = document.getElementById("closeProjectDialog");

createProjectBtn.addEventListener("click", () => {
  addProjectDialog.showModal();
  });
  
closeprojectDialog.addEventListener("click", () => {
  addProjectDialog.close();
})


// Function to handle form submission and make POST request
const handleAddUsersSubmit = (url, dialog, form) => {
  const submitHandler = (event) => {
    event.preventDefault(); // Prevent default form submission

    form.removeEventListener("submit", submitHandler); // Remove the event listener to prevent multiple submissions

    const formData = new FormData(form);

    // Convert form data to JSON
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Create the JSON object
    const jsonData = {
      dataItems: [data]
    };

    // Make a POST request to add data to the Google Sheet using fetch
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(jsonData)
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);

        const success = res[0].success;
        const id = res[0].SheetID;
        const message = res[0].Message;

        showMessageDialog("Success", "Success: " + success + " ID: " + id + " Message: " + message, true);

        form.reset();
        dialog.close();
      })
      .catch((error) => {
        showMessageDialog("Error", "Error: " + error.message, false);
        console.error("Error:", error);
      });
  };

  form.addEventListener("submit", submitHandler); // Add the event listener for form submission
};

//Event Handler for Users Form
addDataToGSheet.addEventListener("click", () => {
  handleAddUsersSubmit(
    "https://script.google.com/macros/s/AKfycbxgyT3rHw0zc7xeF_HWP3fxiy9VjaBcwzE18b6eA7HzFejEvCQEJewrJSzDFkeaUa4m/exec?action=addData&sheetName=Users",
    addUsersDialog,
    addUsersForm
  );
});


//Event Handler for Projects Form
addProjectToGSheet.addEventListener("click", () => {
  handleAddUsersSubmit(
    "https://script.google.com/macros/s/AKfycbxgyT3rHw0zc7xeF_HWP3fxiy9VjaBcwzE18b6eA7HzFejEvCQEJewrJSzDFkeaUa4m/exec?action=addData&sheetName=Projects",
    addProjectDialog,
    addProjectsForm
  );
});


const showMessageDialog = (title, message, isSuccess = true) => {
  const dialog = document.createElement('dialog');
  dialog.classList.add('message-dialog');
  const icon = document.createElement('span');
  icon.classList.add('icon');

  if (isSuccess) {
    icon.textContent = '✅'; // Success icon
    icon.classList.add('success-icon');
  } else {
    icon.textContent = '❌'; // Failure icon
    icon.classList.add('error-icon');
  }

  const content = document.createElement('div');
  content.classList.add('content');
  content.innerHTML = `<h3>${title}</h3><p>${message}</p>`;
  
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.addEventListener('click', () => dialog.close());

  dialog.appendChild(icon);
  dialog.appendChild(content);
  dialog.appendChild(closeButton);

  document.body.appendChild(dialog);
  dialog.showModal();
};

  
// Event listener for 'Get All Users' button
getAllUsersBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbxgyT3rHw0zc7xeF_HWP3fxiy9VjaBcwzE18b6eA7HzFejEvCQEJewrJSzDFkeaUa4m/exec?action=getData&sheetName=Users');
      
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      else {
  
      const responseData = await response.json();
      showMessageDialog('Success', `All Users fetched successfully.`, true);
    // Assuming 'responseData' contains the response data from the server
    createResponseTable(responseData, tableElement);
  }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Show error message
      showMessageDialog('Error', 'An error occurred while saving data.', false);
 
    }
  });
  

// Event listener for 'Get All Projects' button
getAllProjectsBtn.addEventListener('click', async () => {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxgyT3rHw0zc7xeF_HWP3fxiy9VjaBcwzE18b6eA7HzFejEvCQEJewrJSzDFkeaUa4m/exec?action=getData&sheetName=Projects');
      const responseData = await response.json();

    showMessageDialog('Success', `All Projects fetched successfully.`, true);
   // Assuming 'responseData' contains the response data from the server
     createResponseTable(responseData, tableElement);

  } catch (error) {
    console.error('Error fetching projects data:', error);
    // Show error message
    showMessageDialog('Error', 'An error occurred while saving data.', false);
  }
});


const createResponseTable = (responseData, containerElement) => {
  // Clear any existing content inside the container
  containerElement.innerHTML = '';

  const table = document.createElement('table');
  table.classList.add('response-table');

  // Create the table header row
  const headerRow = document.createElement('tr');
  for (const key in responseData[0]) {
    const th = document.createElement('th');
    th.textContent = key;
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  // Create the table data rows
  for (const dataItem of responseData) {
    const dataRow = document.createElement('tr');
    for (const key in dataItem) {
      const td = document.createElement('td');
      td.textContent = dataItem[key];
      dataRow.appendChild(td);
    }
    table.appendChild(dataRow);
  }

  // Append the table to the container element
  containerElement.appendChild(table);
};


const data = {
  "dataItems": [
    {
      "id": "1",
      "Username": "Ashfaq",
      "Password": "Ahmed",
      "Type": "Admin"
    },
    {
      "id": "2",
      "Username": "John",
      "Password": "Doe",
      "Type": "User"
    },
    {
      "id": "3",
      "Username": "Jane",
      "Password": "Smith",
      "Type": "User"
    },
    {
      "id": "4",
      "Username": "Michael",
      "Password": "Johnson",
      "Type": "User"
    },
    {
      "id": "5",
      "Username": "Emily",
      "Password": "Brown",
      "Type": "User"
    },
    {
      "id": "6",
      "Username": "William",
      "Password": "Wilson",
      "Type": "User"
    },
    {
      "id": "7",
      "Username": "David",
      "Password": "Miller",
      "Type": "User"
    },
    {
      "id": "8",
      "Username": "Sophia",
      "Password": "Brown",
      "Type": "User"
    },
    {
      "id": "9",
      "Username": "Olivia",
      "Password": "Wilson",
      "Type": "User"
    },
    {
      "id": "10",
      "Username": "Liam",
      "Password": "Smith",
      "Type": "User"
    }
  ]
}


