import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { registerLicense } from "@syncfusion/ej2-base";
import { AppModule } from "./app/app.module";

//NRAiBiAaIQQuGjN/V0N+XU9Hc1RHQmJNYVF2R2dJeFRwcF9DYEwxOX1dQl9nSXpScUViWn5fcnVXTmU=

registerLicense(
    "Ngo9BigBOggjHTQxAR8/V1NBaF1cWmhOYVppR2Nbe05xdl9HYFZRRmYuP1ZhSXxXdkNjUH9ecXRUR2NaUkY="
);
platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
