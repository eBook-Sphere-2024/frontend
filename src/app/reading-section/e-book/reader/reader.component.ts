import { Component, OnInit, OnDestroy } from '@angular/core';
import { EBookService } from '../e-book.service';
import { EventService } from '../../../../shared/services/EventService';
import { User } from '../../../../shared/models/User';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServices } from '../../../User/user.service';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css']
})
export class ReaderComponent implements OnInit, OnDestroy {
  user!: User;
  pdfSrc!: string;
  ebookId: string | null = null;
  totalPages: number = 0;
  currentPage: number = 1;
  highest_progress: number = 1;
  showDialog: boolean = true; // Control variable for showing the dialog
  showSignDialog: boolean = false;

  constructor(private route: ActivatedRoute, private ebookService: EBookService, private router: Router,
    private events: EventService, private userService: UserServices) {
    this.ebookId = this.route.snapshot.paramMap.get('contentId');
    this.loadEbookContent();
  }

  ngOnDestroy(): void {
    if (this.user != null) {
      if (this.currentPage > this.highest_progress)
        this.highest_progress = this.currentPage;

      let dataPatch = {
        "currentPgae": this.currentPage,
        "highest_progress": this.highest_progress,
        "totalPages": this.totalPages
      };

      let dataPost = {
        "user": this.user.id,
        "ebook": this.ebookId,
        "currentPgae": this.currentPage,
        "highest_progress": this.highest_progress,
        "totalPages": this.totalPages
      };

      this.userService.updateReaderAnalysis(this.user.id, this.ebookId!, dataPost, dataPatch).subscribe(
        (data: any) => {
          console.log(data);
        },
        (error: any) => console.log(error)
      );

      console.log("done");
    }
  }

  ngOnInit(): void {
    this.events.listen('pdfVieweruser', (data: User) => {
      this.user = data;
      this.events.listen('currentPage', (data: number) => {
        this.currentPage = data;
      });
    });
  }

  loadEbookContent(): void {
    if (this.user == null) {
      const token = sessionStorage.getItem('Token');
      if (token) {
        this.userService.userProfile(token).subscribe(
          (data: any) => {
            this.user = data;
            this.showDialog = true; // Show dialog when loading content
            if (this.ebookId) {
              this.ebookService.getEbookContent(this.ebookId).subscribe(
                (res: any) => {
                  const blob = new Blob([res], { type: 'application/pdf' });
                  this.pdfSrc = URL.createObjectURL(blob);
                  console.log(this.pdfSrc);
                  this.showDialog = false; // Hide dialog when content is loaded
                },
                (error: any) => {
                  this.router.navigate(['**'])
                  console.log(error);
                }
              );
            }
          },
          (error: any) => {
            console.log(error.message);
          }
        );
      } else {
        this.showDialog = false;
        this.showSignDialog = true;
      }
    } else {
      this.showDialog = true; // Show dialog when loading content
      if (this.ebookId) {
        this.ebookService.getEbookContent(this.ebookId).subscribe(
          (res: any) => {
            const blob = new Blob([res], { type: 'application/pdf' });
            this.pdfSrc = URL.createObjectURL(blob);
            console.log(this.pdfSrc);
            this.showDialog = false; // Hide dialog when content is loaded
          },
          (error: any) => {
            this.router.navigate(['**'])
            console.log(error);
          }
        );
      }
    }
  }

  onPagesLoaded(event: any): void {
    this.totalPages = event.pagesCount;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    console.log('ebookId', this.ebookId);
    console.log('User ', this.user);
    console.log('Current Page:', this.currentPage);
    console.log('Highest Progress: ', this.highest_progress);
    console.log('Total pages: ', this.totalPages);

    if (this.currentPage > this.highest_progress) {
      this.highest_progress = this.currentPage;
    }
  }
  goToSign() {
    this.router.navigate(['/authentication']);
  }
}
