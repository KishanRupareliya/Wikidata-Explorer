// search-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchStateService {
  private searchState = new BehaviorSubject<{
    query: string;
    results: any[];
  } | null>(null);

  currentState$ = this.searchState.asObservable();

  setState(query: string, results: any[]) {
    this.searchState.next({ query, results });
  }
}