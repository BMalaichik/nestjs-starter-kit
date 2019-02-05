import { INestApplication } from "@nestjs/common";



describe(`AuthController`, () => {
    const app: INestApplication = (global as any).APP;

    it("TEST", () => {
        console.log(app);
    });
});
