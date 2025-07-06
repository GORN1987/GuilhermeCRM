export interface Field {
    id: string
    name: string
    type: string
  }
  
  export interface Record {
    id: string
    name: string
    icon: string
    label: string
    fields: Field[]
    addingField?: boolean
  }
  