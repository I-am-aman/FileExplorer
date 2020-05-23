//Code to calculate the file size

const calculateFileSize = stats => {
    const fileSizeBytes = stats.size;

    const units = "BKMGT";
    const index = Math.floor(Math.log10(fileSizeBytes)/3);
    const fileSizeMagnitute = (fileSizeBytes/Math.pow(1000, index)).toFixed(1);
    const fileSizeUnit = units[index];

    const fileSize = `${fileSizeMagnitute}${fileSizeUnit}`;

    return [fileSize, fileSizeBytes];
};

module.exports = calculateFileSize;