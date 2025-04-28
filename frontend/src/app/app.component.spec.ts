/*
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, frontend');
  });
});
*/

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { EntityViewComponent } from './components/entity-view/entity-view.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { SearchResult } from './models/search-result';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        SearchComponent,
        EntityViewComponent,
        PropertyListComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should update selected entity', () => {
    const mockEntity: SearchResult = { id: 'Q1', label: 'Test Entity' };
    expect(component.selectedEntity).toBeNull();
    
    component.onEntitySelected(mockEntity);
    expect(component.selectedEntity).toEqual(mockEntity);
  });

  it('should render entity view when entity is selected', () => {
    const mockEntity: SearchResult = { id: 'Q1', label: 'Test Entity' };
    component.selectedEntity = mockEntity;
    fixture.detectChanges();
    
    const entityView = fixture.debugElement.nativeElement.querySelector('app-entity-view');
    expect(entityView).toBeTruthy();
  });
});