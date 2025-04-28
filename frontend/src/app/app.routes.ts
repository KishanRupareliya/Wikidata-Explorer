import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { EntityDetailsComponent } from './components/entity-details/entity-details.component';

export const routes: Routes = [
//   { path: '', component: AppComponent },
  { path: '', component: SearchComponent },
  { path: 'entity/:id', component: EntityDetailsComponent }
];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })