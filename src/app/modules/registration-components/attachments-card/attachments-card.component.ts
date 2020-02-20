import { Component, OnInit, Input } from '@angular/core';
import { UploadedFile } from 'src/app/models/form.model';
import { FileUtils } from 'src/app/util/file-utils';
import { UrlGenerator } from 'src/app/util/url-generator';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-attachments-card',
    templateUrl: './attachments-card.component.html',
    styleUrls: ['./attachments-card.component.scss']
})
export class AttachmentsCardComponent implements OnInit {

    @Input() files: Array<UploadedFile>;

    constructor(private authSvc: AuthService) { }

    ngOnInit() {
    }

    filetext(file: UploadedFile){
        return `${FileUtils.isolateFilenameFromExtension(file)} (${FileUtils.getFiletypeFromMime(file)} ${FileUtils.getFilesizeString(file)})`;
    }

    openFile(file: UploadedFile){
        let url = UrlGenerator.generateRegistrationFileUrl(this.authSvc.globalConfig.registrationServiceConnection, file.fileName);
        fetch(url).then((resp: Response) => resp.blob()).then((blob: Blob) => {
            let objUrl = window.URL.createObjectURL(blob);
            let anchor = document.createElement('a');
            anchor.download = file.originalName;
            anchor.href = objUrl;
            anchor.style.display = 'none';
            document.body.appendChild(anchor);
            anchor.click();
            window.URL.revokeObjectURL(objUrl);
        }).catch((err) => {console.log(err);});
    }
}
