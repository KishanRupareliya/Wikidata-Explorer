import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchResult } from '../models/search-result';
import { EntityDetails } from '../models/entity-details';

@Injectable({
  providedIn: 'root'
})
export class WikidataService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  search(query: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`${this.apiUrl}/search`, {
      params: { query }
    });
  }

  getEntityDetails(id: string): Observable<EntityDetails> {
    return this.http.get<EntityDetails>(`${this.apiUrl}/entity/${id}`);
  }
}