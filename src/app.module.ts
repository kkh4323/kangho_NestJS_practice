import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';
import { AgreeOfTermModule } from './agree-of-term/agree-of-term.module';
import { UserInfoModule } from './user-info/user-info.module';
import { AppConfigModule } from './config/config.module';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    AppConfigModule,
    TerminusModule,
    DatabaseModule,
    UserModule,
    BlogModule,
    AuthModule,
    EmailModule,
    RedisModule,
    AgreeOfTermModule,
    UserInfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
