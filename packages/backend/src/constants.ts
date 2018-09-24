// https://forums.asp.net/t/1635552.aspx?Bitwise+Operations+using+enums
export enum WEEK_DAYS_BITMAP {
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 4,
    THURSDAY = 8,
    FRIDAY = 16,
    SATURDAY = 32,
    SUNDAY = 64,
    ONLY_WORKING_WEEK_DAYS = 1 + 2 + 4 + 8 + 16,
    ALL_WEEK_DAYS = 1 + 2 + 4 + 8 + 16 + 32 + 64,
}
