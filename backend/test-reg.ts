import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AuthService } from './src/auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const auth = app.get(AuthService);
  try {
    const res = await auth.register({ email: "test-debug2@dalatAgri.com", password: "Admin1234", fullName: "Test" });
    console.log("Success:", res);
  } catch (e) {
    console.error("Error:", e);
  }
  await app.close();
}
bootstrap();
