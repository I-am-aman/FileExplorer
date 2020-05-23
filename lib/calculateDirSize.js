//Code to calculate the directory size

const {execSync} = require('child_process');

const calculateDirSize = itemFullStaticPath => {
    const itemFullStaticPathCleaned = itemFullStaticPath.replace(/\s/g, '\ ');

    const commandOutput = execSync(`du -sh "${itemFullStaticPathCleaned}"`).toString();
    
    let fileSize = commandOutput.replace(/\s/g, '').split('/');
    fileSize = fileSize[0];
    const fileSizeUnit = fileSize.replace(/\d|\./g, '');
    const fileSizeMagnitude = parseFloat(fileSize.replace(/[a-z]/i, ''));

    const units = "BKMGT";
    const fileSizeBytes = fileSizeMagnitude * Math.pow(1000, units.indexOf(fileSizeUnit));

    return [fileSize, fileSizeBytes];
};

module.exports = calculateDirSize;