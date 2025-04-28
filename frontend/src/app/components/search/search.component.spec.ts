import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { WikidataService } from '../../services/wikidata.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let wikidataService: jasmine.SpyObj<WikidataService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('WikidataService', ['search']);

    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      providers: [{ provide: WikidataService, useValue: spy }]
    }).compileComponents();

    wikidataService = TestBed.inject(WikidataService) as jasmine.SpyObj<WikidataService>;
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should perform search and display results', () => {
    const mockResults = [
      { id: 'Q1', label: 'Test 1' },
      { id: 'Q2', label: 'Test 2', description: 'Desc 2' }
    ];
    wikidataService.search.and.returnValue(of(mockResults));

    component.query = 'test';
    component.search();
    fixture.detectChanges();

    expect(wikidataService.search).toHaveBeenCalledWith('test');
    expect(component.results).toEqual(mockResults);
    expect(component.isLoading).toBeFalse();

    const resultItems = fixture.debugElement.queryAll(By.css('.search-results li'));
    expect(resultItems.length).toBe(2);
  });

  it('should handle search errors', () => {
    wikidataService.search.and.returnValue(throwError(() => new Error('API Error')));

    component.query = 'test';
    component.search();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Failed to search Wikidata. Please try again.');
    expect(component.isLoading).toBeFalse();

    const errorElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorElement).toBeTruthy();
  });

  it('should emit selected entity', () => {
    const mockEntity = { id: 'Q1', label: 'Test' };
    spyOn(component.entitySelected, 'emit');

    component.viewDetails(mockEntity);
    expect(component.entitySelected.emit).toHaveBeenCalledWith(mockEntity);
  });
});