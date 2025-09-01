import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { SupabaseService } from '../services/supabase.service';

@Controller('supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('test')
  async testConnection() {
    try {
      // Test simple de connexion
      return {
        message: 'Connexion Supabase établie avec succès!',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        error: 'Erreur de connexion Supabase',
        details: error.message,
      };
    }
  }

  @Get('tables')
  async getTables() {
    try {
      // Récupérer la liste des tables (exemple)
      const tables = await this.supabaseService.getData(
        'information_schema.tables',
        'table_name',
      );
      return { tables };
    } catch (error) {
      return {
        error: 'Erreur lors de la récupération des tables',
        details: error.message,
      };
    }
  }

  @Post('data/:table')
  async insertData(@Param('table') table: string, @Body() data: any) {
    try {
      const result = await this.supabaseService.insertData(table, data);
      return {
        message: 'Données insérées avec succès',
        data: result,
      };
    } catch (error) {
      return {
        error: "Erreur lors de l'insertion",
        details: error.message,
      };
    }
  }

  @Get('data/:table')
  async getData(@Param('table') table: string) {
    try {
      const data = await this.supabaseService.getData(table);
      return {
        message: 'Données récupérées avec succès',
        data,
      };
    } catch (error) {
      return {
        error: 'Erreur lors de la récupération',
        details: error.message,
      };
    }
  }

  @Put('data/:table/:id')
  async updateData(
    @Param('table') table: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    try {
      const result = await this.supabaseService.updateData(table, data, { id });
      return {
        message: 'Données mises à jour avec succès',
        data: result,
      };
    } catch (error) {
      return {
        error: 'Erreur lors de la mise à jour',
        details: error.message,
      };
    }
  }

  @Delete('data/:table/:id')
  async deleteData(@Param('table') table: string, @Param('id') id: string) {
    try {
      const result = await this.supabaseService.deleteData(table, { id });
      return {
        message: 'Données supprimées avec succès',
        result,
      };
    } catch (error) {
      return {
        error: 'Erreur lors de la suppression',
        details: error.message,
      };
    }
  }
}
