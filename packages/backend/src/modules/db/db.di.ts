enum repositoryToken {
    USER_REPOSITORY = "user_repository",
    CONTACT_REPOSITORY = "contact_repository",
    FILE_REPOSITORY = "file_repository",
    PRODUCTS_REPOSITORY = "products_repository"
}

export const DbDiToken = Object.freeze({
    SEQUELIZE_CONNECTION: "sequelize_connection",
    ...repositoryToken,
});
