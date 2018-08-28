import { SharedDiToken } from "./shared.di";
import { TemplateRenderer } from "./template-renderer";


export const sharedProviders = [
    {
        provide: SharedDiToken.TEMPLATE_RENDERER,
        useClass: TemplateRenderer,
    },
];
