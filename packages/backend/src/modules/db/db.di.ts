enum repositoryToken {
    USER_REPOSITORY = "user_repository",
    CONTACT_REPOSITORY = "contact_repository",
    FILE_REPOSITORY = "file_repository",
    TIME_BASED_EVENT_REPOSITORY = "time_based_event",
}

export const DbDiToken = Object.freeze({
    SEQUELIZE_CONNECTION: "sequelize_connection",
    ...repositoryToken,
});
