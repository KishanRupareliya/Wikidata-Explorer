import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityProperty } from '../../models/entity-details';

@Component({
    selector: 'app-property-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './property-list.component.html',
    styleUrls: ['./property-list.component.css']
  })
export class PropertyListComponent {
  @Input() properties: EntityProperty[] = [];
}