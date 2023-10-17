const express = require('express');
// const cors = require('cors');
const bodyParser = require('body-parser');
// const fs = require('fs') //.promises; // dont use App does not work 
const fs = require('fs');

const fsPromises = require('fs').promises;

const app = express();
const os = require('os');
const path = require('path');
// const { ok } = require('assert');

// Determine the app data directory based on the OS
let appDataDir;
if (os.platform() === 'win32') {
  appDataDir = path.join(os.homedir(), 'AppData', 'Roaming', 'scm-next-plus');
} else {
  appDataDir = path.join(os.homedir(), '.scm-next-plus');
}

function ensureLogDirectoryExists(logDirectory) {
  const fs = require('fs');
    const path = require('path');
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating log directory:', err);
      }
    });
  }
}

// Construct file paths using the dynamic appDataDir
const SEOfolderPath = path.join(appDataDir, 'content_cache');

const filePath = path.join(appDataDir, 'blog-settings.json');

ensureLogDirectoryExists(appDataDir)


// blog-settings backup
const hourlyBackupDir = path.join(appDataDir, 'Backups', 'hourly-backups');
const requestBackupDir = path.join(appDataDir, 'Backups', 'request-backups');


async function createTimestampedBackup(filePath, backupDir) {
  try {
    // Ensure that the backup directory exists, create it if it doesn't
    await fsPromises.mkdir(backupDir, { recursive: true });

    // Check if the file exists before creating a backup
    const fileExists = await fsPromises.access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      console.error(`File not found: ${filePath}`);
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '_');
    const backupFileName = `${timestamp}_${path.basename(filePath)}`;
    const backupFilePath = path.join(backupDir, backupFileName);

    // Create a backup
    await fsPromises.copyFile(filePath, backupFilePath);
    console.log(`Backup created: ${backupFilePath}`);

    // Clean up old backups if more than two exist
    const backupFiles = await fsPromises.readdir(backupDir);
    if (backupFiles.length > 2) {
      // Sort backups by filename (which includes timestamps)
      backupFiles.sort();

      // Delete the oldest backup(s)
      for (let i = 0; i < backupFiles.length - 2; i++) {
        const oldBackupPath = path.join(backupDir, backupFiles[i]);
        await fsPromises.unlink(oldBackupPath);
        console.log(`Deleted old backup: ${oldBackupPath}`);
      }
    }
  } catch (error) {
    console.error('Error creating backup:', error);
  }
}

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.static('.')); // Use for App to be only Run Locally not in Browser.
// app.use(cors());

// Define API endpoint for SEO folder path
app.get('/SEOFolderPath', (req, res) => {
  // Replace this with your logic to retrieve the SEO folder path
  // Send the folder path as a response
  res.json({ folderPath: SEOfolderPath });
});


// Custom Settings Section
const settingDirectory = 'App Settings';
const filePathsetting = path.join(settingDirectory, 'custom-settings.json');

ensureLogDirectoryExists(settingDirectory)


const initialData =   {
      "SheetID": "2d46b73e-7acf-455a-b71e-329372a4ecd2",
      "ListofContentFilter": "suche, search, results, Ergebniss, .com, com, org, .org, .net, net, for, .tw, .co, co, You, Sie, gesucht, p*rn",
      "URLsDownloadResultLimits": 5,
      "ArticleCount": 5,
      "InsertNoofImagesFROM": 5,
      "InsertNoofImagesTO": 10,
      "jobcronString" : "0 0 * * 7",
      "articleUseCategoryInsert": true,
      "UseImages": true,
      "InsertType": "local",
      "InsertAtStartOfBody": true,
      "UseBingImages": true,
      "UseYoutubeThumbnails": true,
      "UseCreativeCommonsImages": true,
      "UseBingCCImages": true,
      "postUseToday": true,
      "PostsperDay": 3,
      "PostIntervaldaysFROM": 1,
      "PostIntervaldaysTO": 5,
      "postarticleTitle": "Use filename",
      "SEOStatus": "complete"
  }
;

// GET custom settings
app.get('/custom-settings', async (req, res) => {
  try {
    if (!fs.existsSync(filePathsetting)) {
      // File doesn't exist, create a new file with initial data
      fs.writeFileSync(filePathsetting, JSON.stringify(initialData, null, 2), 'utf8');
    }

    const data = await fs.promises.readFile(filePathsetting, 'utf8');
    const settings = JSON.parse(data);
    res.json(settings);
  } catch (error) {
    console.error('Error handling /custom-settings:', error);
    res.status(500).json({ error: 'An error occurred while handling /custom-settings' });
  }
});


// POST custom settings
app.post('/custom-settings', async (req, res) => {
  try {
    const updatedSettings = req.body;

    if (!fs.existsSync(filePathsetting)) {
      // File doesn't exist, create a new file with initial data
      fs.writeFileSync(filePathsetting, JSON.stringify(initialData, null, 2), 'utf8');
    }

    await fs.promises.writeFile(filePathsetting, JSON.stringify(updatedSettings, null, 2), 'utf8');
    res.json({ success: true, message: 'Custom settings saved successfully' });
  } catch (error) {
    console.error('Error handling POST /custom-settings:', error);
    res.status(500).json({ success: false, error: 'An error occurred while handling POST /custom-settings' });
  }
});


const filePathApplicationsetting = path.join(settingDirectory, 'AppSettings.json');


const initialProjectSettingData =   {
  "AppSettingID" :10100,
  "checkWebApp": false,
  "checkTesting": false,
  "checkUseGAPI": false,
  "checkSyncGoogle": false,
  "checkUseLocalData": false,
  "checkShowTestButtons": true,
  "checkWriteLogs": true,

  "GAPISyncTime": 5,
  "montiroingInterval": 5,
  "projectStatusInterval": 5,
  "logClearTimer": 5
}
;

// GET custom settings
app.get('/AppSettings', async (req, res) => {
try {
if (!fs.existsSync(filePathApplicationsetting)) {
  // File doesn't exist, create a new file with initial data
  fs.writeFileSync(filePathApplicationsetting, JSON.stringify(initialProjectSettingData, null, 2), 'utf8');
}

const data = await fs.promises.readFile(filePathApplicationsetting, 'utf8');
const settings = JSON.parse(data);
res.json(settings);
} catch (error) {
console.error('Error handling /Application Settings:', error);
res.status(500).json({ error: 'An error occurred while handling /Application Settings' });
}
});


// POST custom settings
// POST custom settings
app.post('/AppSettings', async (req, res) => {
  try {
    const updatedSettings = req.body;

    // Read the existing JSON data from the file
    const data = await fs.promises.readFile(filePathApplicationsetting, 'utf8');
    const currentSettings = JSON.parse(data);

    // Iterate through the keys in updatedSettings and update the corresponding keys in currentSettings
    for (const key in updatedSettings) {
      if (currentSettings.hasOwnProperty(key)) {
        currentSettings[key] = updatedSettings[key];
      }
    }

    // Write the updated object back to the file
    await fs.promises.writeFile(filePathApplicationsetting, JSON.stringify(currentSettings, null, 2), 'utf8');
    
    res.json({ success: true, message: 'Application settings saved successfully' });
  } catch (error) {
    console.error('Error handling POST /Application Settings:', error);
    res.status(500).json({ success: false, error: 'An error occurred while handling POST /Application Settings' });
  }
});



// Helper function to generate a new ID
function generateNewId(records) {
  const numericParts = records
    .filter(record => record.id && record.id.startsWith('blog'))
    .map(record => parseInt(record.id.slice(4), 10))
    .filter(numericPart => !isNaN(numericPart))
    .sort((a, b) => a - b);

  const newNumericPart = numericParts.length === 0 ? 1 : numericParts[numericParts.length - 1] + 1;
  const newId = 'blog' + String(newNumericPart).padStart(2, '0');
  return newId;
}



// Read all data or data by ID
app.get('/data/:id?', async (req, res) => {


  try {
    const { id } = req.params;
    let jsonData = [];


    try {
      const data = await fsPromises.readFile(filePath, 'utf8');
      jsonData = JSON.parse(data);
    } catch (readFileError) {
      // Handle the case where the file does not exist or cannot be read
      console.error('Error reading data file:', readFileError);
    }

    if (id) {
      const selectedData = jsonData.find(entry => entry.id === id);
      if (selectedData) {
        res.json(selectedData);
      } else {
        res.status(404).json({ success: false, error: 'Data with the specified ID not found' });
      }
    } else {
      res.json(jsonData);
    }
  } catch (error) {
    console.error('Error handling GET /data:', error);
    res.status(500).json({ success: false, error: 'An error occurred while handling GET /data' });
  }
});

// Return unique List blogid and url
app.get('/uniqueBlogIDs', async (req, res) => {
  try {
    let jsonData = [];

    try {
      const data = await fsPromises.readFile(filePath, 'utf8');
      jsonData = JSON.parse(data);
    } catch (readFileError) {
      // Handle the case where the file does not exist or cannot be read
      console.error('Error reading data file:', readFileError);
    }

    const uniqueData = Array.from(
      new Set(jsonData.map(entry => ({ id: entry.id, url: entry.url })))
    );
    res.json(uniqueData);
  } catch (error) {
    console.error('Error handling GET /uniqueBlogIDs:', error);
    res.status(500).json({ success: false, error: 'An error occurred while handling GET /uniqueBlogIDs' });
  }
});


// Update data
app.put('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Create an hourly backup before updating
    await createTimestampedBackup(filePath, hourlyBackupDir);

    const data = await fsPromises.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    const entryIndex = jsonData.findIndex(entry => entry.id === id);
    if (entryIndex !== -1) {
      Object.assign(jsonData[entryIndex], updatedData);
      await fsPromises.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
      res.json({ success: true, message: 'Data updated successfully' });
    } else {
      res.status(404).json({ success: false, error: 'Data with the specified ID not found' });
    }
  } catch (error) {
    console.error('Error handling PUT /data/:id:', error);
    res.status(500).json({ success: false, error: 'An error occurred while handling PUT /data/:id' });
  }
});

// Delete data or create new data
app.delete('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Create a request-based backup before deleting
    await createTimestampedBackup(filePath, requestBackupDir);

    const data = await fsPromises.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    const index = jsonData.findIndex(entry => entry.id === id);
    if (index !== -1) {
      jsonData.splice(index, 1);
      const updatedDataJSON = JSON.stringify(jsonData, null, 2);

      await fsPromises.writeFile(filePath, updatedDataJSON, 'utf8');
      res.status(200).json({ success: true, message: 'Data deleted successfully' });
    } else {
      res.status(404).json({ success: false, error: 'Data with the specified ID not found' });
    }
  } catch (error) {
    console.error('Error handling DELETE /data/:id:', error);
    res.status(500).json({ success: false, error: 'An error occurred while handling DELETE /data/:id' });
  }
});

// Create new data
app.post('/data', async (req, res) => {
  try {
    const { id, username, password, url, group } = req.body;

    // Create a request-based backup before creating new data
    await createTimestampedBackup(filePath, requestBackupDir);

    const data = await fsPromises.readFile(filePath, 'utf8');
    const jsonData = data ? JSON.parse(data) : [];

    const newRecord = {
      id: id || generateNewId(jsonData),
      username: username || '', 
      password: password || '',
      url: url || '',
      group: group || ''
    };

    jsonData.push(newRecord);

    await fsPromises.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
    res.json({ success: true, id: newRecord.id, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error handling POST /data:', error);
    res.status(500).json({ success: false, error: 'An error occurred while handling POST /data' });
  }
});



module.exports = app;
