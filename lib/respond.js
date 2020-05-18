const url = require('url');
const path = require('path');
const fs = require('fs');

const buildBreadcrumb = require('./breadcrumb.js');
const buildMainContent = require('./mainContent.js');
const getMimeType = require('./getMimeType.js');

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
        return response.end();
    }

    if(!stats.isFile()){
        response.statusCode = 401;
        response.write('401: Access Denied!');
        console.log("Neither a file nor a directory!");
        return response.end();
    }

    let fileDetails = {};
    fileDetails.extname = path.extname(staticFullPath);

    let stat;
    try{
        stat = fs.statSync(staticFullPath);
    }catch(err){
        console.log(`Error: ${err}`);
    }
    fileDetails.size = stat.size;

    getMimeType(fileDetails.extname)
    .then(mime => {
        let head = {}, options = {};
        let statusCode = 200;

        head['Content-Type'] = mime;

        if(fileDetails.extname === '.pdf')
            head['Content-Disposition'] = 'inline';
        
        if(RegExp('audio').test(mime) || RegExp('video').test(mime)){
            head['Accept-Ranges'] = 'bytes';

            const range = request.headers.range;
            if(range){
                const start_end = range.replace(/bytes=/, "").split('-');
                const start = parseInt(start_end[0]);
                const end = start_end[1]? parseInt(start_end[1]): fileDetails.size-1;

                head['Content-Range'] = `bytes ${start}-${end}/${fileDetails.size}`;
                head['Content-Length'] = end - start + 1;
                statusCode = 206;

                options = {start, end};
            }
        }

        // fs.promises.readFile(staticFullPath, 'utf-8')
        // .then(data => {
        //     response.writeHead(statusCode, head);
        //     response.write(data);
        //     return response.end();
        // })
        // .catch(error => {
        //     console.log(error);
        //     response.statusCode = 404;
        //     response.write('404: File reading error!');
        //     return response.end();
        // });

        const fileStream = fs.createReadStream(staticFullPath, options);

        response.writeHead(statusCode, head);
        fileStream.pipe(response);

        fileStream.on('close', () => {
            return response.end();
        });
        fileStream.on('error', error => {
            console.log(error.code);
            response.statusCode = 404;
            response.write('404: File reading error!');
            return response.end();
        });
    })
    .catch(err => {
        response.statusCode = 500;
        response.write('500: Internal Server Error!');
        console.log(`Promise Error: ${err}`);
        return response.end();
    });
}

module.exports = respond;