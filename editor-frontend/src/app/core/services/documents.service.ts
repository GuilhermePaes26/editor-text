import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private http = inject(HttpClient);

  private api = 'http://localhost:3001';

  getDocuments() {
    return this.http.get<any[]>(`${this.api}/documents`);
  }

  createDocument(title: string) {
    return this.http.post<any>(`${this.api}/documents`, {
      title,
    });
  }
}
