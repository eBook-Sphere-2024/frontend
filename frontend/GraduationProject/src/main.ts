import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerLicense } from "@syncfusion/ej2-base";
import { AppModule } from './app/app.module';

  //NRAiBiAaIQQuGjN/V0N+XU9Hc1RHQmJNYVF2R2dJeFRwcF9DYEwxOX1dQl9nSXpScUViWn5fcnVXTmU=

  registerLicense(
    'ORg4AjUWIQA/Gnt2UFhhQlJBfVpdXGdWfFN0QXNedV50flBGcDwsT3RfQFljTX9UdkRhUHpccX1QRg=='
  );
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

