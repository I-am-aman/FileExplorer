const url = require('url');
const path = require('path');
const fs = require('fs');

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
    }
}

module.exports = respond;