 
 export interface Field {
  id: string
  name: string
  type: string
  label: string
}
 
 export default interface Modules {
        id: string
        name?: string
        label: string
        icon: string
        fields?: Field[]
        addingField?: boolean
  }