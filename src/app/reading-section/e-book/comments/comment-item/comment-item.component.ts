import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../../../../../shared/models/Comment';
import { EBookService } from '../../e-book.service';
import { UserServices } from '../../../../User/user.service';
import { User } from '../../../../../shared/models/User';
import { eBookItem } from '../../../../../shared/models/eBookItem';
import { Router } from '@angular/router';
import { EventService } from '../../../../../shared/services/EventService';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.css']
})
export class CommentItemComponent implements OnInit {
  @Input() comment!: Comment;
  @Input() userProfile!: User;
  @Input() eBook!: eBookItem;
  replies!: Comment[];
  isEditing: boolean = false;
  isAddingReply: boolean = false;

  constructor(private events: EventService, private eBookService: EBookService, private userService: UserServices, private router: Router) { }

  ngOnInit(): void {
    this.getReplies();
  }
  getReplies(): void {
    this.eBookService.get_comment_replies(this.comment.id.toString(), this.comment.ebook.id.toString()).subscribe(
      (data: any) => {
        this.replies = data;
        for (let i = 0; i < this.replies.length; i++) {
          this.userService.get_user_profile(this.replies[i].user.id.toString()).subscribe(
            (data: any) => {
              this.replies[i].user.avatar = data.profile_image;
            },
            (error: any) => {
              alert(error.message);
            }
          );
        }
      },
      (error: any) => {
        alert(error.message);
      }
    );
  }

  promptDeleteComment(): void {
    const modalWrp = document.querySelector('.modal-wrp') as HTMLElement;
    modalWrp.classList.remove('invisible');

    const yesButton = modalWrp.querySelector('.yes') as HTMLButtonElement;
    const noButton = modalWrp.querySelector('.no') as HTMLButtonElement;

    const yesClickListener = () => {
      this.deleteComment();
      modalWrp.classList.add('invisible');
      yesButton.removeEventListener('click', yesClickListener);
      noButton.removeEventListener('click', noClickListener);
    };

    const noClickListener = () => {
      modalWrp.classList.add('invisible');
      yesButton.removeEventListener('click', yesClickListener);
      noButton.removeEventListener('click', noClickListener);
    };

    yesButton.addEventListener('click', yesClickListener);
    noButton.addEventListener('click', noClickListener);
  }

  deleteComment(): void {
    this.eBookService.delete_comment(this.comment.id.toString()).subscribe(
      () => {
        window.location.reload();
      },
      (error: any) => {
        alert(error.message);
      }
    );
  }
  onContentChange(event: any): void {
    const newTextContent = event.target.textContent; // Trim any leading or trailing whitespace
    if (newTextContent.length > 4) {
      this.comment.content = newTextContent;
    }
  }
  toggleEditComment(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.saveComment();
    }
  }

  saveComment(): void {
    this.eBookService.edit_comment(this.comment).subscribe(
      () => {
      },
      (error: any) => {
        alert(error.message);
      }
    );
  }
  addReplyComment(): void {
    if (this.userProfile) {
      this.isAddingReply = !this.isAddingReply;
    } else {
      this.opensigninDialog();
    }
  }
  formatTime(timestamp: string): string {
    const currentDate = new Date();
    const commentDate = new Date(timestamp);

    const timeDifference = Math.abs(currentDate.getTime() - commentDate.getTime());
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) {
      return days === 1 ? "1 day ago" : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    } else {
      return "Just now";
    }
  }


  opensigninDialog(): void {
    const dialog = document.getElementById('signinDialog') as HTMLDialogElement;
    dialog.showModal();
    const okButton = dialog.querySelector('.ok') as HTMLButtonElement;
    okButton.addEventListener('click', () => {
      this.events.emit('openSigninDialog', '/reading/ebooks/' + this.comment.ebook.id);
      this.router.navigate(['/authentication']);
    });
  }

  closesigninDialog(): void {
    const dialog = document.getElementById('signinDialog') as HTMLDialogElement;
    dialog.close();
  }
}
