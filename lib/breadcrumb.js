//Code to set up the breadcrumb (file path at the top)

const path = require('path');

const buildBreadcrumb = pathname => {
    let pathElements = pathname.split('/');
    pathElements = pathElements.filter(element => element !== '');

    let breadcrumb = `<li class="breadcrumb-item"><a href="/">Home</a></li>`;
    let link = '/';

    pathElements.forEach((item, index) => {
        link = path.join(link, item);
        if(index !== pathElements.length - 1){
            breadcrumb += `<li class="breadcrumb-item"><a href="${link}">${item}</a></li>`;
        }else{
            breadcrumb += `<li class="breadcrumb-item active" aria-current="page">${item}</li>`;
        }
    });

    return breadcrumb;
}

module.exports = buildBreadcrumb;