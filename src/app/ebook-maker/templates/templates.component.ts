import { Component, OnInit } from '@angular/core';
import { Template } from '../../../shared/models/Template';
import { EbookMakerService } from '../ebook-maker.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.css'
})
export class TemplatesComponent implements OnInit {
  templates: Template[] = [];
  constructor(private ebookMakerService: EbookMakerService) { }
  ngOnInit(): void {
    this.ebookMakerService.getTemplates().subscribe((data: any) => {
      this.templates = data;
    },
      (error: any) => {
        alert(error.message);
      })
  }
}
