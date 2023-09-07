const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const os = require('os');
const path = require('path');
const SEOfolderPath = path.join(os.homedir(), 'AppData', 'Roaming', 'scm-next-plus', 'content_cache');

const filePathsetting = path.join(os.homedir(), 'AppData', 'Roaming', 'scm-next-plus', 'custom-settings.json');


const filePath = path.join(os.homedir(), 'AppData', 'Roaming', 'scm-next-plus', 'blog-settings.json');


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('.'));


// Define API endpoint for SEO folder path
app.get('/SEOFolderPath', (req, res) => {
  // Replace this with your logic to retrieve the SEO folder path
  // Send the folder path as a response
  res.json({ folderPath: SEOfolderPath });
});


const initialData =   {
      "ListofContentFilter": "suche, search, results, Ergebniss, .com, com, org, .org, .net, net, for, .tw, .co, co, You, Sie, gesucht, p*rn",
      "URLsDownloadResultLimits": 5,
      "ArticleCount": 5,
      "InsertNoofImagesFROM": 5,
      "InsertNoofImagesTO": 10,
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
      "postarticleTitle": "Use filename"
  }
;

// GET custom settings
app.get('/custom-settings', (req, res) => {
  if (!fs.existsSync(filePathsetting)) {
    // File doesn't exist, create new file with initial data
    fs.writeFileSync(filePathsetting, JSON.stringify(initialData, null, 2), 'utf8');
  }

  fs.readFile(filePathsetting, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading custom settings file:', err);
      res.status(500).json({ error: 'Error reading custom settings file' });
    } else {
      try {
        const settings = JSON.parse(data);
        res.json(settings);
      } catch (parseError) {
        console.error('Error parsing custom settings file:', parseError);
        res.status(500).json({ error: 'Error parsing custom settings file' });
      }
    }
  });
});

// POST custom settings
app.post('/custom-settings', (req, res) => {
  const updatedSettings = req.body;
 if (!fs.existsSync(filePathsetting)) {
    // File doesn't exist, create new file with initial data
    fs.writeFileSync(filePathsetting, JSON.stringify(initialData, null, 2), 'utf8');
  }
  fs.writeFile(filePathsetting, JSON.stringify(updatedSettings, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error writing custom settings file:', err);
      res.status(500).json({ error: 'Error writing custom settings file' });
    } else {
      res.json({ message: 'Custom settings saved successfully' });
    }
  });
});


// Helper function to generate a new ID
function generateNewId(records) {
  if (records.length === 0) {
    return 'blog01';
  } else {
    const lastId = records[records.length - 1].id;
    const numericPart = parseInt(lastId.slice(-2), 10);
    const newNumericPart = numericPart + 1;
    const newId = 'blog' + String(newNumericPart).padStart(2, '0');
    return newId;
  }
}

// Read all data or data by ID
app.get('/data/:id?', (req, res) => {
  const { id } = req.params;
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      res.status(500).json({ error: 'Error reading data' });
    } else {
      const jsonData = JSON.parse(data);
      if (id) {
        const selectedData = jsonData.find(entry => entry.id === id);
        if (selectedData) {
          res.json(selectedData);
        } else {
          res.status(404).json({ error: 'Data with the specified ID not found' });
        }
      } else {
        res.json(jsonData);
      }
    }
  });
});

// Update data
app.put('/data/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      res.status(500).json({ error: 'Error reading data' });
    } else {
      const jsonData = JSON.parse(data);
      const entry = jsonData.find(entry => entry.id === id);
      if (entry) {
        Object.assign(entry, updatedData);
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), err => {
          if (err) {
            console.error('Error updating data:', err);
            res.status(500).json({ error: 'Error updating data' });
          } else {
            res.json({ message: 'Data updated successfully' });
          }
        });
      } else {
        res.status(404).json({ error: 'Data with the specified ID not found' });
      }
    }
  });
});

// Delete data or create new data
app.delete('/data/:id', (req, res) => {
  const { id } = req.params;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      res.status(500).json({ error: 'Error reading data' });
    } else {
      const jsonData = JSON.parse(data);
      const index = jsonData.findIndex(entry => entry.id === id);
      if (index !== -1) {
        jsonData.splice(index, 1);
        const updatedDataJSON = JSON.stringify(jsonData, null, 2);
        fs.writeFile(filePath, updatedDataJSON, err => {
          if (err) {
            console.error('Error deleting data:', err);
            res.status(500).json({ error: 'Error deleting data' });
          } else {
            res.json({ message: 'Data deleted successfully' });
          }
        });
      } else {
        res.status(404).json({ error: 'Data with the specified ID not found' });
      }
    }
  });
});

// Create new data
app.post('/data', (req, res) => {
  const { id, username, password, url, group } = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Error reading data:', err);
      res.status(500).json({ error: 'Error reading data' });
    } else {
      const jsonData = data ? JSON.parse(data) : [];

      const newRecord = {
        id: id || generateNewId(jsonData),
        username: username || '',
        password: password || '',
        url: url || '',
        group: group || ''
      };

      jsonData.push(newRecord);

      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), err => {
        if (err) {
          console.error('Error saving data:', err);
          res.status(500).json({ error: 'Error saving data' });
        } else {
          res.json({ message: 'Data saved successfully', id: newRecord.id });
        }
      });
    }
  });
});





module.exports = app;
