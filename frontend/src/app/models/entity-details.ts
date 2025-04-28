export interface PropertyValue {
    value: string;
  }
  
  export interface EntityProperty {
    id: string;
    values: PropertyValue[];
  }
  
  export interface EntityDetails {
    id: string;
    label: string;
    description?: string;
    properties: EntityProperty[];
  }