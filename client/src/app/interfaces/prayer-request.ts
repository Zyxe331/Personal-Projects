export interface PrayerRequest {
    Id: number,
    Title: string,
    Body: string,
    Resolved: boolean,
    IsPrivate: boolean,
    CreatedDate: Date,
    ShortFormattedDate: string,
    LongFormattedDate: string,
    User_Id: number,
    Prayer_Schedule_Id: number,
    nDate: string,
    nTime: string,
    frequency: string
}
