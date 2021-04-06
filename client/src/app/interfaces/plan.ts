import { Section } from "./section"

export class Plan {
    Id: number
    GroupId: number
    Title: string
    CreatedDate: Date
    sections: Section[]
    
}
