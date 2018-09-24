enum repositoryToken {
    USER_REPOSITORY = "user_repository",
    CONTACT_REPOSITORY = "contact_repository",
    FILE_REPOSITORY = "file_repository",
    SHOP_REPOSITORY = "shop_repository",
    CATEGORY_REPOSITORY = "category_repository",
    PRODUCT_REPOSITORY = "product_repository"
}

export const DbDiToken = Object.freeze({
    SEQUELIZE_CONNECTION: "sequelize_connection",
    ...repositoryToken,
});
