import { Injectable } from '@nestjs/common';
import { supabase } from '../config/supabase.config';

@Injectable()
export class SupabaseService {
  async getData(table: string, select: string = '*') {
    const { data, error } = await supabase.from(table).select(select);

    if (error) throw error;
    return data;
  }

  async insertData(table: string, data: any) {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select();

    if (error) throw error;
    return result;
  }

  async updateData(table: string, data: any, match: any) {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .match(match)
      .select();

    if (error) throw error;
    return result;
  }

  async deleteData(table: string, match: any) {
    const { error } = await supabase.from(table).delete().match(match);

    if (error) throw error;
    return { success: true };
  }

  async getDataById(table: string, id: string | number) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}
