import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WikidataService } from '../../services/wikidata.service';
import { SearchResult } from '../../models/search-result';
import { SearchStateService } from '../../services/search-state.service';

@Component({
  selector: 'app-entity-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.css']
})
export class EntityDetailsComponent {

  constructor(
    private router: Router,
    private searchState: SearchStateService
  ) {}
  private route = inject(ActivatedRoute);
  private wikidataService = inject(WikidataService);
  
  entity: SearchResult | null = null;
  details: any = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.wikidataService.getEntityDetails(id).subscribe({
        next: (details) => {
          this.entity = { id, label: details.label, description: details.description };
          this.details = details;
        },
        error: (err) => console.error('Failed to load entity details', err)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}