import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './modules/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
