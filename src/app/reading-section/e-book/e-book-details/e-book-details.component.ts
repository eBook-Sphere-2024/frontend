import { Component, OnInit } from '@angular/core';
import { eBookItem } from '../../../../shared/models/eBookItem';
import { EBookService } from '../e-book.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-e-book-details',
  templateUrl: './e-book-details.component.html',
  styleUrls: ['./e-book-details.component.css']
})

export class EBookDetailsComponent implements OnInit {
  eBookItem!: eBookItem;
  stars = [1, 2, 3, 4, 5];
  constructor(private route: ActivatedRoute, private eBookService: EBookService, private Router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.eBookService.getBookById(id).subscribe(
          (event: any) => {
            this.eBookItem = event;
          },
          (error: any) => {
            console.error('Error fetching eBook details:', error);
          }
        );
      }
    });
  }
  goBack() {
    //go to e-book component
    this.Router.navigate(['reading']);
  }
  readBook() {
    const EbookUrl = 'https://drive.google.com/file/d/' + this.eBookItem.content + '/view?usp=drive_open';
    window.open(EbookUrl, '_blank');
  }

  download() {
    //should be the path the user choose and the name of the file he chooses
    const file_name = "";
    //save file to local storage 
    this.eBookService.download_eBook("1H6lT3nfjxaS2tbcqvpOIhCBp2Tp9xPey", file_name).subscribe(
      (data: any) => {
        console.log(data)
      },
      (error: any) => {
        console.error('Error downloading eBook:', error);
      }
    );
  }
}