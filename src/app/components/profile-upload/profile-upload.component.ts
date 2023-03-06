import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-profile-upload',
  templateUrl: './profile-upload.component.html',
  styleUrls: ['./profile-upload.component.scss'],
})
export class ProfileUploadComponent implements OnInit {
  @ViewChild('modalContainer', { static: true }) modalContainer: ElementRef =
    {} as ElementRef;
  @ViewChild('fileInput', { static: false }) myFileInput: ElementRef =
    {} as ElementRef;

  @Output() actionEmitter: EventEmitter<boolean> = new EventEmitter();

  @Input()
  set modalOpenStatus(value: boolean) {
    this.toggleModal(value);
  }

  public ProfileToUpload: File = new File([], '');
  public imageUrl: any = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {}

  public toggleModal(status: boolean) {
    const element = this.modalContainer.nativeElement;

    this.actionEmitter.emit(status);

    if (status) {
      element.style.transform = 'scale(1) translate(-50%,-50%)';
    } else {
      element.style.transform = 'scale(0) translate(-50%,-50%)';
    }
  }

  public handleFileInput(event: any): void {
    const target = event as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file: File = (target.files as FileList)[0];
      this.ProfileToUpload = file;
    }
    console.log(this.ProfileToUpload, 'this.ProfileToUpload');
    this.getPreviewUrl();
  }

  public uploadFile() {
    const formData: FormData = new FormData();
    formData.append('photo', this.ProfileToUpload, this.ProfileToUpload.name);
    this.chatService.uploadFile(formData).subscribe(() => {
      this.chatService.refreshUser();
      this.ProfileToUpload = new File([], '');
      this.toggleModal(false);

      console.log('profile updated successfully');
    });
  }

  public clearFile() {
    this.ProfileToUpload = new File([], '');
  }

  public getPreviewUrl() {
    const file = this.ProfileToUpload;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        this.imageUrl = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
}
