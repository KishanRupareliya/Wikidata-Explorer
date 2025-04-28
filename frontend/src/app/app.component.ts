// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { SearchResult } from './models/search-result';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css'
// })
// export class AppComponent {
//   title = 'frontend';

//   selectedEntity: SearchResult | null = null;

//   onEntitySelected(entity: SearchResult): void {
//     this.selectedEntity = entity;
//   }
// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResult } from './models/search-result';
import { SearchComponent } from './components/search/search.component';
import { EntityViewComponent } from './components/entity-view/entity-view.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  // imports: [CommonModule, SearchComponent, EntityViewComponent,  HttpClientModule,],
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedEntity: SearchResult | null = null;

  onEntitySelected(entity: SearchResult): void {
    this.selectedEntity = entity;
  }
}

// export class AppComponent {
//   title = 'Wikidata Explorer';
// }