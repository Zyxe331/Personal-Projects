export interface User {
    Id: number,
    FirstName: string,
    LastName: string,
    Username: string,
    Email: string,
    Password: string,
    Active: boolean,
    CreatedDate: Date,
    PhoneNumber: string,
    Role_Id: number,
    StopNudge: boolean
}
