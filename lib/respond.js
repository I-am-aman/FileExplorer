const url = require('url');
const path = require('path');
const fs = require('fs');

const buildBreadcrumb = require('./breadcrumb.js');
const buildMainContent = require('./mainContent.js');

const staticBasePath = path.join(__dirname, '..', 'static'); 

const respond = (request, response) => {

    let pathname = url.parse(request.url, true).pathname;

    if(pathname === '/favicon.ico')
        return false;

    pathname = decodeURIComponent(pathname);
    const staticFullPath = path.join(staticBasePath, pathname);

    if(!fs.existsSync(staticFullPath)){
        console.log(`${staticFullPath} doesn't exists`);
        response.write('404. File Not Found!');
        response.end();
        return false;
    }

    let stats;
    try {
        stats = fs.lstatSync(staticFullPath);
    } catch (err) {
        console.log(`lstatSync Error: ${err}`);
    }

    if(stats.isDirectory()){
        let data = fs.readFileSync(path.join(staticBasePath, 'project_files/index.html'), 'utf-8');

        let pathElements = pathname.split('/').reverse();
        pathElements = pathElements.filter(element => element !== '');
        data = data.replace('Page Title', pathElements[0]);

        const breadcrumb = buildBreadcrumb(pathname);
        data = data.replace('pathname', breadcrumb);

        const mainContent = buildMainContent(staticFullPath, pathname);
        data = data.replace('mainContent', mainContent);

        response.statusCode = 200;
        response.write(data);
        response.end();
    }
}

module.exports = respond;