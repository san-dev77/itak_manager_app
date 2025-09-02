import { SupabaseService } from '../services/supabase.service';
export declare class SupabaseController {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    testConnection(): unknown;
    getTables(): unknown;
    insertData(table: string, data: any): unknown;
    getData(table: string): unknown;
    updateData(table: string, id: string, data: any): unknown;
    deleteData(table: string, id: string): unknown;
}
