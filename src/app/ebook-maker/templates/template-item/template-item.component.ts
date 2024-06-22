import { Component, Input, OnInit } from '@angular/core';
import { Template } from '../../../../shared/models/Template';
import { EventService } from '../../../../shared/services/EventService';
import { Router } from '@angular/router';
import { User } from '../../../../shared/models/User';
import { UserServices } from '../../../User/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-template-item',
  templateUrl: './template-item.component.html',
  styleUrls: ['./template-item.component.css']
})
export class TemplateItemComponent implements OnInit {
  @Input() template!: Template;
  userProfile!: User;
  pdfUrl!: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer, private events: EventService, private router: Router, private userService: UserServices) { }

  ngOnInit(): void {
    let token = sessionStorage.getItem('Token');
    if (token) {
      this.userService.userProfile(token).subscribe(
        (data: any) => {
          this.userProfile = data;
        }
      );
    }
    console.log(this.template)
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.template.previewurl);
  }
  editTemplate() {
    if (this.userProfile) {
      this.events.emit('editTemplate', this.template);
      this.router.navigate(['/maker/editor']);
    }
    else {
      this.opensigninDialog();
    }
  }
  previewTemplate() {
    const previewDialog = document.getElementById('previewDialog') as HTMLDialogElement;
    const previewIframe = document.getElementById('previewIframe') as HTMLIFrameElement;
    if (previewIframe && this.pdfUrl) {
      previewIframe.src = this.template.previewurl;
      previewDialog.showModal();
    } else {
      console.error('Preview iframe or pdfUrl is not available.');
    }
    previewDialog.showModal();
  }

  closePreviewDialog(): void {
    const previewDialog = document.getElementById('previewDialog') as HTMLDialogElement;
    previewDialog.close();
  }
  opensigninDialog(): void {
    const dialog = document.getElementById('signinDialog') as HTMLDialogElement;
    dialog.showModal();
    const okButton = dialog.querySelector('.ok') as HTMLButtonElement;
    okButton.addEventListener('click', () => {
      this.events.emit('openSigninDialog', '/maker/templates');
      this.router.navigate(['/authentication']);
    });
  }

  closesigninDialog(): void {
    const dialog = document.getElementById('signinDialog') as HTMLDialogElement;
    dialog.close();
  }
}
