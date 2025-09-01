import { Module } from '@nestjs/common';
import { SupabaseService } from '../services/supabase.service';
import { SupabaseController } from '../controllers/supabase.controller';

@Module({
  controllers: [SupabaseController],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
