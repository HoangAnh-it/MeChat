function getExtension(filename) {
  var parts = filename.split('.');
  return parts[parts.length - 1];
}

export function isImage(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'png':
            return true;
        default: return false
    }
}

export function isVideo(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
        case 'm4v':
        case 'avi':
        case 'mpg':
        case 'mp4':
            return true;
        default:
            return false;
    }
}

export function getTypeFile(filename) {
    if (isVideo(filename)) return 'video';
    else if (isImage(filename)) return 'image';
    else return 'text';
}
