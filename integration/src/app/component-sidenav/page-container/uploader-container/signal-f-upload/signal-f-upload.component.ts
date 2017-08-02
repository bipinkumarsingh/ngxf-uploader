import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { AlertConfirmService } from '@shared/components/alert-confirm';
import { PageHeaderService } from '../../page-header/page-header.service';
import { AutoDestory } from '@shared/base/auto.destory';
import { UploaderService } from '@shared/services/uploader.service';
import { FileError, UploadEvent, UploadStatus } from 'ngxf-uploader';

@Component({
  selector: 'app-signal-f-upload',
  templateUrl: './signal-f-upload.component.html',
  styleUrls: ['./signal-f-upload.component.scss']
})
export class SignalFUploadComponent extends AutoDestory implements OnInit {

  public myForm: FormGroup;
  public file: File;
  public filePreviewPath: SafeUrl;

  public present = 0;

  constructor(
    private Upload: UploaderService,
    private _alertConfirm: AlertConfirmService,
    private _ps: PageHeaderService) { super(); }


  ngOnInit() {
    this._ps.setTitle('Signal File Uploader');
  }

  // non-multiple, return File
  uploadFile(file: File | FileError): void {
    if (file instanceof File) {
      this.present = 0;
      this.file = file;
      this.Upload.createPreViewImg(this.file, (url) => { this.filePreviewPath = url; });
      return;
    }
    this.file = undefined;
    this.Upload.alertFileError(file);
  }

  startUpload() {
    this.Upload.upload({
      url: 'http://localhost:3000/file/upload',
      fields: {
        toUrl: 'device'
      },
      files: this.file,
      filesKey: 'MMSUploadFile',
      process: true
    })
      .takeUntil(this._destroy$)
      .subscribe(
      (event: UploadEvent) => {
        if (event.status === UploadStatus.Uploading) {
          this.present = event.percent;
        }
      },
      (err: any) => {
      },
      () => {
        this._alertConfirm.alert('upload success!');
      });

  }
}