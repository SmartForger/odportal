import { UploadedFile } from "../models/form.model";

export interface GenericFile{
    filename?: string;
    fileName?: string;
    filetype?: string;
    mimetype?: string;
    name?: string;
    originalname?: string;
    originalName?: string;
    size?: number;
    type?: string;
}

export class FileUtils{
    public static getFilesizeString(file: GenericFile): string{
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

    public static getFiletypeFromMime(file: GenericFile): string{
        let mime = file.type || file.mimetype;
        const filetypeSplit = mime.split('/');
        let filetype: string = filetypeSplit[filetypeSplit.length - 1].toUpperCase();
        return filetype;
    }

    public static isolateFilenameFromExtension(file: GenericFile): string{
        let name = file.name || file.originalname || file.originalName || file.filename || file.fileName;
        let dotSplit = name.split('.');
        if(dotSplit.length > 1){
            dotSplit.splice(dotSplit.length - 1, 1);
        }
        return dotSplit.join('');
    }
}