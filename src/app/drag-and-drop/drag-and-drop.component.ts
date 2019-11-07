import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Buffer } from 'buffer';
// import { UrlObject } from 'url';

@Component({
    selector: 'app-drag-and-drop',
    templateUrl: './drag-and-drop.component.html',
    styleUrls: ['./drag-and-drop.component.scss']
})

export class DragAndDropComponent implements OnInit {

    @Input() availableExtensions: string[];
    @Input() initialFile: any;
    @Output() outputDocumentFile = new EventEmitter();
    @Output() outputImageFile = new EventEmitter();

    imageChangedEvent: any = '';
    croppedImage: any = '';
    isUpload = false;

    // fileURLObject: any;
    public files: NgxFileDropEntry[] = [];

    ngOnInit() {
        if (this.initialFile && (this.initialFile.extension.toLowerCase() === 'pdf' ||
            this.initialFile.extension.toLowerCase() === 'png' || this.initialFile.extension.toLowerCase() === 'jpeg')) {
            this.isUpload = true;
            const buffer = new Buffer(this.initialFile.stream, 'base64');
            const type = (this.initialFile.extension.toLowerCase() === 'pdf') ? 'application/pdf' :
                         (this.initialFile.extensiontoLowerCase() === 'png') ? 'image/png' : 'image/jpeg';
            const file = new File([buffer], 'file', {type});
            document.getElementById('viewer').setAttribute('src', URL.createObjectURL(file));
        }
    }

    public dropped(files: NgxFileDropEntry[]) {
        // let self = this;
        this.isUpload = true;
        this.files = files;
        for (const droppedFile of files) {
            // Is it a file?
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {
                    // window.open(URL.createObjectURL(file));
                    // this.fileURLObject = URL.createObjectURL(file);
                    let isFileExtensionPermitted = true;
                    // Si manda el array de extensiones permitidos controlas acá antes this.availableExtensions.length
                    if (this.availableExtensions.length !== 0) {
                        // controlo haciendo una function que devuelve true o false
                        isFileExtensionPermitted = this.verifiedTypeFile(this.availableExtensions, file.type);
                    }

                    if (isFileExtensionPermitted && file.size < 16000000) {
                        document.getElementById('viewer').setAttribute('src', URL.createObjectURL(file));
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = (event: any) => this.outputDocumentFile.emit(event.target.result);
                    } else {
                        console.log('No se permite este tipo de archivo o el tamaño es mayor a 2MB');
                    }
                });
            } else {
                // It was a directory (empty directories are added, otherwise only files)
                const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
            }
        }
    }

    private verifiedTypeFile(data: any, file: any) {
        const splitType = file.split('/');
        if (data.includes(splitType[1])) {
            return true;
        } else {
            return false;
        }
    }

    public fileOver(event) {
        console.log(event);
    }

    public fileLeave(event) {
        console.log(event);
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        this.outputDocumentFile.emit(this.croppedImage);
    }

    imageLoaded() {
        // show cropper
    }

    cropperReady() {
        // cropper ready
    }

    loadImageFailed() {
        // show message
    }
}
