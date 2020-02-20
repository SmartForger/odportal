import { UploadedFile } from "../models/form.model";

export class FileUtils{

    public static getFilesizeString(file: File | Express.Multer.File | UploadedFile): string{
        let format = new Intl.NumberFormat('en-US', {style: 'decimal', maximumFractionDigits: 1});
        let size = file.size;
        let filesize: string;
        if(size / 1000 <= 1){
            filesize = `${format.format(size)} bytes`;
        }
        else{
            size = size / 1000;
            if(size / 1000 <= 1){
                filesize = `${format.format(size)} kB`;
            }
            else{
                size = size / 1000;
                if(size / 1000 <= 1){
                    filesize = `${format.format(size)} MB`;
                }
                else{
                    size = size / 1000;
                    filesize = `${format.format(size)} GB`;
                }
            }
        }
        return filesize;
    }

    public static getFiletypeFromMime(file: File | Express.Multer.File | UploadedFile): string{
        let mime = file['type'] || file['mimetype'];
        const filetypeSplit = mime.split('/');
        let filetype: string = filetypeSplit[filetypeSplit.length - 1].toUpperCase();
        return filetype;
    }

    public static isolateFilenameFromExtension(file: File | Express.Multer.File | UploadedFile): string{
        console.log(file);
        let name = file['name'] || file['originalname'] || file['originalName'] || file['filename'] || file['fileName'];
        console.log(name);
        let dotSplit = name.split('.');
        if(dotSplit.length > 1){
            dotSplit.splice(dotSplit.length - 1, 1);
        }
        return dotSplit.join('');
    }

}