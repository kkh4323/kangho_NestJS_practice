import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { AgreeOfTermModule } from '@agree-of-term/agree-of-term.module';
import { AppConfigModule } from '@config/config.module';
import { AppController } from '@root/app.controller';
import { AppService } from '@root/app.service';
import { AuthModule } from '@auth/auth.module';
import { BlogModule } from '@blog/blog.module';
import { DatabaseModule } from '@database/database.module';
import { EmailModule } from '@email/email.module';
import { RedisModule } from '@redis/redis.module';
import { UserModule } from '@user/user.module';
import { UserInfoModule } from '@user-info/user-info.module';

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
