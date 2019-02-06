module.exports = async () => {
    const app = global.APP;
    await app.close();

    delete global.APP;
}
