import { Component, ViewChild } from '@angular/core';
import { DocumentEditorContainerComponent, toolbarClickEvent } from "@syncfusion/ej2-angular-documenteditor";
import { ItemModel, MenuEventArgs, ClickEventArgs  } from '@syncfusion/ej2-splitbuttons';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'GraduationProject';
  @ViewChild('documentEditor') editorObj!: DocumentEditorContainerComponent;

  public onSave1() {
    this.editorObj.documentEditor.save('sampleDocument', 'Docx');
  }
  public onSave2() {
    this.editorObj.documentEditor.save('sampleDocument', 'Html');
  }
  public onSave3() {
    this.editorObj.documentEditor.save('sampleDocument', 'Sfdt');
  }
  public onSave4() {
    this.editorObj.documentEditor.save('sampleDocument', 'Txt');
  }
  public onPrint() {
    this.editorObj.documentEditor.print();
  }

  public items: ItemModel[] = [
    {
      text: 'Docx',
      id: 'docx',
    },
    {
      text: 'HTML',
      id: 'HTML',
    },
    {
      text: 'TXT',
      id: 'TXT',
    },
  ];
  public itemBeforeEvent(args: MenuEventArgs) {
    args.element.style.height = '105px';
  }
}
