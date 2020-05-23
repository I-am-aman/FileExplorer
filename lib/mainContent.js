//Code to build and load the files/directories in the table which constitute the main content 

const fs = require('fs');
const path = require('path');

const calculateDirSize = require('./calculateDirSize.js');
const calculateFileSize = require('./calculateFileSize.js');


const buildMainContent = (staticFullPath, pathname) => {
    let mainContent = '';
    let dirItems, link;

    try {
        dirItems = fs.readdirSync(staticFullPath);
    } catch (err) {
        console.log(`readdirSync Error: ${err}`);
        return `<div class="alert alert-danger">Internal Server Error</div>`
    }

    dirItems = dirItems.filter(element => element !== '.DS_Store');
    if(pathname === '/')
        dirItems = dirItems.filter(element => element !== 'project_files');

    dirItems.forEach(item => {
        let itemDetails = {};
        itemDetails.name = item;
        
        link = path.join(pathname, itemDetails.name);

        const itemFullStaticPath = path.join(staticFullPath, itemDetails.name);
        try {
            itemDetails.stats = fs.statSync(itemFullStaticPath);
        } catch (err) {
            console.log(`statSync Error: ${err}`);
            return `<div class="alert alert-danger">Internal Server Error</div>`
        }

        if(itemDetails.stats.isDirectory()){
            itemDetails.icon = '<ion-icon name="folder"></ion-icon>';

            [itemDetails.size, itemDetails.sizeBytes] = calculateDirSize(itemFullStaticPath);
        }else if(itemDetails.stats.isFile()){
            itemDetails.icon = '<ion-icon name="document"></ion-icon>';

            [itemDetails.size, itemDetails.sizeBytes] = calculateFileSize(itemDetails.stats);
        }

        itemDetails.timeStamp = parseInt(itemDetails.stats.mtimeMs);
        itemDetails.date = new Date(itemDetails.timeStamp);
        itemDetails.date = itemDetails.date.toLocaleString();

        mainContent += 
        `<tr data-name="${itemDetails.name}" data-size="${itemDetails.sizeBytes}" data-time="${itemDetails.timeStamp}">
            <td>${itemDetails.icon}<a href="${link}" target='${itemDetails.stats.isFile()? "_blank": ""}'>${itemDetails.name}</a></td>
            <td>${itemDetails.size}</td>
            <td>${itemDetails.date}</td>
        </tr>`;
    });

    return mainContent;
};

module.exports = buildMainContent;