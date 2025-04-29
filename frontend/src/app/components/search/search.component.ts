import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchResult } from '../../models/search-result';
import { WikidataService } from '../../services/wikidata.service';
import { Router, NavigationStart } from '@angular/router';
import { SearchStateService } from '../../services/search-state.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent {
  @Output() entitySelected = new EventEmitter<SearchResult>();
  query = '';
  results: SearchResult[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private wikidataService: WikidataService, 
              private router: Router, 
              private searchState: SearchStateService,) { }

  ngOnInit() {
    this.searchState.currentState$.subscribe(state => {
      if (state) {
        this.query = state.query;
        this.results = state.results;
      }
    });
  }

  search() {
    // Clear previous results and errors
    this.results = [];
    this.errorMessage = null;

    // Validate input
    if (!this.query.trim()) {
      this.errorMessage = 'Please enter a search term';
      return;
    }

    if (/[^a-zA-Z0-9\s]/.test(this.query)) {
      this.errorMessage = 'Only letters, numbers and spaces allowed';
      return;
    }

    this.isLoading = true;
    
    this.wikidataService.search(this.query).subscribe({
      next: (results) => {
        this.isLoading = false;
        if (results.length === 0) {
          this.errorMessage = 'No results found for "' + this.query + '"';
        } else {
          this.wikidataService.search(this.query).subscribe(results => {
            this.results = results;
            this.searchState.setState(this.query, this.results);
     });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Search failed. Please try again later.';
        console.error('Search error:', err);
      }
    });
  }

  // viewDetails(entity: SearchResult): void {
  //   this.router.navigate(['/entity', entity.id]);
  // }

  viewDetails(entity: SearchResult) {
    this.router.navigate(['/entity', entity.id], {
      state: {
        searchQuery: this.query,
        searchResults: this.results
      }
    });
  }

}