async function TestingFunctionsd() {
  const fs = require('fs');
const path = require('path');

  const PostUploaderIDPassed = '6520195bcfbd4c094805d3f9';

  const folderfilepath = "C:\\Users\\Hussaini Logistics\\AppData\\Roaming\\scm-next-plus\\content_cache\\6520195bcfbd4c094805d3f9\\articles"
  // const folderfilepath = ""


 const getfilePathResult=  await filePathUpdater(PostUploaderIDPassed, folderfilepath)

console.log("File Path Set to : "+ getfilePathResult)

}


// Function to upload images
async function uploadimagestoWordPress() {
  const fs = require('fs');
const path = require('path');


const istextFileUpdated = main();



if(istextFileUpdated) {

  createToast('WordpressToastDiv', 'info', 'fa-solid fa-info-circle', 'Info', 'Image files  are Uploaded to Wordpress');

} else {

  createToast('WordpressToastDiv', 'warning','fa-solid fa-exclamation-triangle', 'Warning', 'Images not uploaded to Wordpress');

}

}


async function main() {

  const fs = require('fs');
const path = require('path');

  const siteUrl = 'https://0k7j.com';
const username = 'admin37109';
const password = 'v8rof4IstewRavoqahls';


const newArticleCreatorID = '6520195bcfbd4c094805d3f9'; // Replace with the article creator ID

//  console.log('C:\Users\haier\AppData\Roaming\scm-next-plus\content_cache\650fb3b02c477518dc2cf63a\articles')

// Step 5: Get SEO Path to Pass to Folderpath
const response4 = await fetch(`${appurl}/SEOFolderPath`);
const data4 = await response4.json();
const soefolder = data4.folderPath;

const textFilesDirectory = await getArticleCreatorPath(newArticleCreatorID);
const imagesDirectory = `${textFilesDirectory}\\images`;

console.log("Text Folder Path" + textFilesDirectory)
console.log("Image Folder Path: " + imagesDirectory)


createToast('bodyToastDiv', 'info', 'fa-solid fa-info-circle', 'Info', 'Images are uploading from Folder: '+ imagesDirectory +"<br>\n Articles Path: "+ textFilesDirectory);


const outputFileName = 'Images_UploadedLog.txt';
let stages;
  try {
    

    // Step 1: Find the images in text files and create an array of image file names
    const ImagesandTextFileNames = await findImagesInTextFiles(textFilesDirectory, imagesDirectory);

    console.table(ImagesandTextFileNames);
    console.log('Images names to be uploaded to WordPress: ' + ImagesandTextFileNames.imageFile + ' Founded in text files: ' + ImagesandTextFileNames.textFile);
    

    stages="Step 1 Find Images that are in text files passed "
    // Step 2: Confirm and upload images to WordPress

      const uploadedImages = await uploadImagesToWordPressBatch(imagesDirectory, ImagesandTextFileNames.imageFile, siteUrl, username, password );
      console.log('Images uploaded to WordPress:', uploadedImages);
   
    
    stages=" Step 2 Upload Files to Wordpress Passed "

//     // Step 3: Confirm and update text files with WordPress image URLs

  const updatedTextFiles = await updateTextFilesWithImageURLs(textFilesDirectory, outputFileName, uploadedImages);
  console.log('Text files updated with WordPress image URLs:', updatedTextFiles);

  stages=" Step 3 replaced Upload Files to Wordpress urls in files "
 
    // Step 4: Log the final result
    console.log('Process completed.');

    return true
  } catch (error) {
    console.error('Error: when procesing the from main Passed : STEPS ' + stages, error.message);
    return false
  }
}

async function findImagesInTextFiles(textFilesDirectory, imagesDirectory) {

  const fs = require('fs');
const path = require('path');


  try {
  const ImagesandTextFileNames = {
    imageFile: [],
    textFile: []
  };

  const textFiles = fs.readdirSync(textFilesDirectory).filter((file) => file.endsWith('.txt'));
  const imageFiles = fs.readdirSync(imagesDirectory).filter(file => /\.(jpeg|jpg|png|gif)$/i.test(file));

  for (const textFile of textFiles) {
    const textFilePath = path.join(textFilesDirectory, textFile);
    const content = fs.readFileSync(textFilePath, 'utf-8');

    for (const imageFile of imageFiles) {
      const imageReference = ` src="/images/${imageFile}"`;

      if (content.includes(imageReference)) {
        console.log(`Image '${imageFile}' found in '${textFile}'`);

        ImagesandTextFileNames.imageFile.push(imageFile);
        ImagesandTextFileNames.textFile.push(textFile); // Use Set to store unique text file names
 
      }
    }
  }

  return ImagesandTextFileNames;

} catch(error) {
      console.error('Error while image names in the article Files', error.message);
  return false
    }
}


async function uploadImagesToWordPress(imagesDirectory, imageFileNames, siteUrl, username, password) {
  const fs = require('fs');
const path = require('path');

    
createToast('bodyToastDiv', 'info', 'fa-solid fa-info-circle', 'Info', 'Images Started Uploading: '+ imagesDirectory);

try {
  const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
  const uploadedImages = {}; // Object to store uploaded images

  for (const imageFile of imageFileNames) {
    const imagePath = path.join(imagesDirectory, imageFile);
    const imageUniqueID = uuidv4();
    const imageData = fs.readFileSync(imagePath);

    const headers = {
      'Content-Disposition': `attachment; filename=${imageUniqueID}${path.extname(imageFile)}`,
      'Content-Type': 'image/jpeg',
      'Authorization': `Basic ${token}`,
    };

    try {
      const response = await fetch(`${siteUrl}/wp-json/wp/v2/media`, {
        method: 'POST',
        headers: headers,
        body: imageData,
      });

      if (response.ok) {
        const data = await response.json();
        uploadedImages[imageUniqueID] = {
          uploadedFileName: `${imageUniqueID}${path.extname(imageFile)}`,
          wordpressImageUrl: data.guid.rendered,
          timestamp: new Date().toLocaleString(),
          filename: imageFile,
        };

        console.log(`Image '${imageFile}' uploaded successfully:`, data);
      } else {
        console.error(`Failed to upload image '${imageFile}'. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error uploading image '${imageFile}':`, error.message);
    }

  }

  return uploadedImages; // Moved outside of the loop

  } catch(error) {

    console.error(`Error uploading images to Wordpress`, error.message);
    
  }
}


// Batch Uploader Function
async function uploadImagesToWordPressBatch(imagesDirectory, imageFileNames, siteUrl, username, password) {
  const fs = require('fs');
const path = require('path');

  try {
  const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
  const uploadedImages = {}; // Object to store uploaded images

  const uploadPromises = imageFileNames.map(async (imageFile) => {
    try {
      const imagePath = path.join(imagesDirectory, imageFile);
      const imageUniqueID = uuidv4();
      const imageData = fs.readFileSync(imagePath);

      const headers = {
        'Content-Disposition': `attachment; filename=${imageUniqueID}${path.extname(imageFile)}`,
        'Content-Type': 'image/jpeg',
        'Authorization': `Basic ${token}`,
      };

      const response = await fetch(`${siteUrl}/wp-json/wp/v2/media`, {
        method: 'POST',
        headers: headers,
        body: imageData,
      });

      if (response.ok) {
        const data = await response.json();
        uploadedImages[imageFile] = {
          uploadedFileName: `${imageUniqueID}${path.extname(imageFile)}`,
          wordpressImageUrl: data.guid.rendered,
          timestamp: new Date().toLocaleString(),
          filename: imageFile,
        };

        console.log(`Image '${imageFile}' uploaded successfully:`, data);
      } else {
        console.error(`Failed to upload image '${imageFile}'. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error uploading image '${imageFile}':`, error.message);
    }
  });

  await Promise.all(uploadPromises);

  return uploadedImages;

  } catch(error) {

    console.error(`Error uploading images to Wordpress`, error.message);
    
  }

}

async function updateTextFilesWithImageURLs(textFilesDirectory, outputFileName, uploadedImages) {
  const fs = require('fs');
const path = require('path');

  try{
  const matchingImageNames = [];
  const textFiles = fs.readdirSync(textFilesDirectory).filter((file) => file.endsWith('.txt'));

  for (const textFile of textFiles) {
    const textFilePath = path.join(textFilesDirectory, textFile);

    try {
      let content = fs.readFileSync(textFilePath, 'utf-8');

      // Iterate through uploaded images to find and replace image references
      for (const imageUniqueID in uploadedImages) {
        if (uploadedImages.hasOwnProperty(imageUniqueID)) {
          const imageInfo = uploadedImages[imageUniqueID];
          const imageReferenceString = ` src="/images/${imageInfo.filename}"`;
          const newSrc = ` src="${imageInfo.wordpressImageUrl}"`;

          if (content.includes(imageReferenceString)) {
            content = content.replace(imageReferenceString, newSrc);
            console.log("Image Reference: " + imageReferenceString + " New Path  " + newSrc + " Text File " + textFile);

            matchingImageNames.push(textFile);
            matchingImageNames.push(imageReferenceString);
            matchingImageNames.push(newSrc);
          }
        }
      }

      fs.writeFileSync(textFilePath, content, 'utf-8'); // Update the text file with the new content
    } catch (error) {
      console.error(`Error updating text file '${textFile}':`, error.message);
    }
  }

  const outputPath = path.join(path.dirname(textFilesDirectory), outputFileName);
  fs.writeFileSync(outputPath, matchingImageNames.join('\t'));

  return matchingImageNames;

  } catch (error) {
    console.error(`Error updating article creator text files, replacing image names with Wordpress url`, error.message);
  }

}


async function uploadImagetoWordPressText(siteUrl, username, password, imagesDirectory, textFilesDirectory, isDeleteImages = false) {
  const fs = require('fs');
  const path = require('path');
  
let success;

const outputFileName = 'Uploaded Images Log.txt';

let stages;

  try {
    

    // Step 1: Find the images in text files and create an array of image file names
    const ImagesandTextFileNames = await findImagesInTextFiles(textFilesDirectory, imagesDirectory);

    console.table(ImagesandTextFileNames);
    console.log('Images names to be uploaded to WordPress: ' + ImagesandTextFileNames.imageFile + ' Founded in text files: ' + ImagesandTextFileNames.textFile);
    
    success=true
    stages="Step 1 Find Images that are in text files passed "
    // Step 2: Confirm and upload images to WordPress

    // Batch Uploader Function
    // const uploadedImages = await uploadImagesToWordPressBatch(imagesDirectory, ImagesandTextFileNames.imageFile, siteUrl, username, password );

    //Single Image Function 
            const uploadedImages = await uploadImagesToWordPress(imagesDirectory, ImagesandTextFileNames.imageFile, siteUrl, username, password );
      console.log('Images uploaded to WordPress:', uploadedImages);
      success=true
    
    stages=" Step 2 Upload Files to Wordpress Passed "

//     // Step 3: Confirm and update text files with WordPress image URLs

  const updatedTextFiles = await updateTextFilesWithImageURLs(textFilesDirectory, outputFileName, uploadedImages);
  console.log('Text files updated with WordPress image URLs:', updatedTextFiles);

  stages=" Step 3 replaced Upload Files to Wordpress urls in files "
  success=true

  // Delete the images folder if requested
  if (isDeleteImages) {
    fs.rmdirSync(folderPath, { recursive: true });
    console.log(`Deleted images folder: ${folderPath}`);
    stages=" Step 4 Delete Images Folder After uploading. "
  }
  success=true
    // Step 5: Log the final result
    console.log('Process completed.');

  createToast('bodyToastDiv',  'success', 'fa-solid fa-circle-check', 'Success', 'Images are Uploaded and Updated to Article Files Successfully');

  return true;

  } catch (error) {
    
    createToast(
      'bodyToastDiv',
      'warning',
      'fa-solid fa-exclamation-triangle',
      'Warning',
      `There is error while Uploading Images to Wordpress. Error: ` + error);   
   
    console.error('Error: when procesing the from main Passed : STEPS ' + stages, error.message);
    return false;
  }

}


