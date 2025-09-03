import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './modules/supabase.module';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { StudentModule } from './modules/student.module';
import { TeacherModule } from './modules/teacher.module';
import { StaffModule } from './modules/staff.module';
import { ClassCategoryModule } from './modules/class-category.module';
import { ClassModule } from './modules/class.module';
import { SubjectModule } from './modules/subject.module';
import { ConfigModule } from './modules/config.module';

@Module({
  imports: [
    SupabaseModule,
    UserModule,
    AuthModule,
    StudentModule,
    TeacherModule,
    StaffModule,
    ClassCategoryModule,
    ClassModule,
    SubjectModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
