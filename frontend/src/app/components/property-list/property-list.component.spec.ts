import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyListComponent } from './property-list.component';
import { EntityProperty } from '../../models/entity-details';

describe('PropertyListComponent', () => {
  let component: PropertyListComponent;
  let fixture: ComponentFixture<PropertyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertyListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyListComponent);
    component = fixture.componentInstance;
    
    // Set input
    component.properties = [
      { id: 'P1', values: [{ value: 'Value 1' }] },
      { id: 'P2', values: [{ value: 'Value 2' }, { value: 'Value 3' }] }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display properties', () => {
    const propertyElements = fixture.debugElement.nativeElement.querySelectorAll('.property-list li');
    expect(propertyElements.length).toBe(2);
    
    const firstProperty = propertyElements[0];
    expect(firstProperty.textContent).toContain('P1');
    expect(firstProperty.textContent).toContain('Value 1');
    
    const secondProperty = propertyElements[1];
    expect(secondProperty.textContent).toContain('P2');
    expect(secondProperty.textContent).toContain('Value 2');
    expect(secondProperty.textContent).toContain('Value 3');
  });

  it('should handle empty properties', () => {
    component.properties = [];
    fixture.detectChanges();
    
    const emptyMessage = fixture.debugElement.nativeElement.querySelector('.property-list p');
    expect(emptyMessage.textContent).toContain('No properties found.');
  });
});