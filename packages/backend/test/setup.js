module.exports = async () => {
    require("ts-node/register");
    await (require("./setup.ts"))();
}
