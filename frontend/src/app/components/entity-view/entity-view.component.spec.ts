import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntityViewComponent } from './entity-view.component';
import { WikidataService } from '../../services/wikidata.service';
import { of, throwError } from 'rxjs';
import { SearchResult } from '../../models/search-result';
import { EntityDetails } from '../../models/entity-details';

describe('EntityViewComponent', () => {
  let component: EntityViewComponent;
  let fixture: ComponentFixture<EntityViewComponent>;
  let wikidataService: jasmine.SpyObj<WikidataService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('WikidataService', ['getEntityDetails']);

    await TestBed.configureTestingModule({
      declarations: [EntityViewComponent],
      providers: [{ provide: WikidataService, useValue: spy }]
    }).compileComponents();

    wikidataService = TestBed.inject(WikidataService) as jasmine.SpyObj<WikidataService>;
    fixture = TestBed.createComponent(EntityViewComponent);
    component = fixture.componentInstance;
    
    // Set input
    component.entity = { id: 'Q1', label: 'Test Entity' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load entity details on init', () => {
    const mockDetails: EntityDetails = {
      id: 'Q1',
      label: 'Test Entity',
      properties: [
        { id: 'P1', values: [{ value: 'Value 1' }] }
      ]
    };
    wikidataService.getEntityDetails.and.returnValue(of(mockDetails));

    component.ngOnInit();
    fixture.detectChanges();

    expect(wikidataService.getEntityDetails).toHaveBeenCalledWith('Q1');
    expect(component.details).toEqual(mockDetails);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle entity details errors', () => {
    wikidataService.getEntityDetails.and.returnValue(throwError(() => new Error('API Error')));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.error).toBe('Failed to load entity details. Please try again.');
    expect(component.isLoading).toBeFalse();
  });
});