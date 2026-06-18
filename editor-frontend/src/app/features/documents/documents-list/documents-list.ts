import { Component, inject, OnInit } from '@angular/core';
import { DocumentsService } from '../../../core/services/documents.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-documents',
  templateUrl: './documents-list.html',
  imports: [RouterLink],
  styleUrl: './documents-list.scss',
})
export class Documents implements OnInit {
  private documentsService = inject(DocumentsService);
  private router = inject(Router);

  documents: any[] = [];

  menuOpen = false;

  userEmail = localStorage.getItem('userEmail') ?? '';

  userName = this.userEmail.split('@')[0];

  userInitials = this.userName ? this.userName.charAt(0).toUpperCase() : 'U';
  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.documentsService.getDocuments().subscribe({
      next: (docs) => {
        this.documents = docs;
      },
    });
  }

  createDocument() {
    this.documentsService.createDocument('Novo Documento').subscribe({
      next: (doc) => {
        this.router.navigate(['/editor', doc.id]);
      },
    });
  }

  openDocument(id: string) {
    this.router.navigate(['/editor', id]);
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');

    this.router.navigate(['/login']);
  }
}
