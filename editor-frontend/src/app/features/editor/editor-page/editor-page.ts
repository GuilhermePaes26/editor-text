import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { EditorSocketService } from '../../../core/services/editor-socket.service';
import { DocumentsService } from '../../../core/services/documents.service';

@Component({
  selector: 'app-editor-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './editor-page.html',
  styleUrl: './editor-page.scss',
})
export class EditorPageComponent implements OnInit, OnDestroy {
  docId = '';
  content = '';
  docTitle = '';
  constructor(
    private readonly route: ActivatedRoute,
    private readonly socketService: EditorSocketService,
    private readonly documentsService: DocumentsService,
  ) {}

  ngOnInit() {
    this.docId = this.route.snapshot.paramMap.get('id') ?? '';

    console.log('DOC ID:', this.docId);

    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    this.socketService.connect(token, () => {
      console.log('Entrando no documento', this.docId);

      this.socketService.joinDocument(this.docId);
    });

    this.socketService.onLoadDocument((documentLoad: any) => {
      this.content = documentLoad.content;
      this.docTitle = documentLoad.title;
    });

    this.socketService.onContentUpdated((document) => {
      this.content = document.content;
    });
  }
  onContentChange() {
    this.socketService.editContent(this.docId, this.content);
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }
  onTitleChange() {
    this.documentsService.updateTitle(this.docId, this.docTitle).subscribe();
  }
}
