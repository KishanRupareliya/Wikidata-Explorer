import { Component, Input, OnInit } from '@angular/core';
import { WikidataService } from '../../services/wikidata.service';
import { EntityDetails, SearchResult } from '../../models';
import { CommonModule } from '@angular/common';
import { PropertyListComponent } from '../property-list/property-list.component';

@Component({
    selector: 'app-entity-view',
    standalone: true,
    imports: [CommonModule, PropertyListComponent],
    templateUrl: './entity-view.component.html',
    styleUrls: ['./entity-view.component.css']
  })
export class EntityViewComponent implements OnInit {
  @Input() entity!: SearchResult;
  details: EntityDetails | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(private wikidataService: WikidataService) { }

  ngOnInit(): void {
    this.loadEntityDetails();
  }

  loadEntityDetails(): void {
    this.isLoading = true;
    this.error = null;
    this.details = null;

    this.wikidataService.getEntityDetails(this.entity.id).subscribe({
      next: (details) => {
        this.details = details;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load entity details. Please try again.';
        this.isLoading = false;
        console.error('Entity details error:', err);
      }
    });
  }
}