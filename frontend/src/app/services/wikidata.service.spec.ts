import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WikidataService } from './wikidata.service';
import { SearchResult } from '../models/search-result';
import { EntityDetails } from '../models/entity-details';

describe('WikidataService', () => {
  let service: WikidataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WikidataService]
    });
    service = TestBed.inject(WikidataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should search Wikidata successfully', () => {
    const mockResults: SearchResult[] = [
      { id: 'Q123', label: 'Test Item', description: 'Test Description' }
    ];

    service.search('test').subscribe(results => {
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('Q123');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/search?query=test');
    expect(req.request.method).toBe('GET');
    req.flush(mockResults);
  });

  it('should handle search errors', () => {
    service.search('test').subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne('http://localhost:8000/api/search?query=test');
    req.error(new ProgressEvent('error'));
  });

  it('should get entity details successfully', () => {
    const mockDetails: EntityDetails = {
      id: 'Q123',
      label: 'Test Entity',
      properties: [
        { id: 'P1', values: [{ value: 'Value 1' }] }
      ]
    };

    service.getEntityDetails('Q123').subscribe(details => {
      expect(details.id).toBe('Q123');
      expect(details.properties.length).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:8000/api/entity/Q123');
    expect(req.request.method).toBe('GET');
    req.flush(mockDetails);
  });
});