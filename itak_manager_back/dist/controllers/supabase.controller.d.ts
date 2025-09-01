import { SupabaseService } from '../services/supabase.service';
export declare class SupabaseController {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    testConnection(): Promise<{
        message: string;
        timestamp: string;
        error?: undefined;
        details?: undefined;
    } | {
        error: string;
        details: any;
        message?: undefined;
        timestamp?: undefined;
    }>;
    getTables(): Promise<{
        tables: ({
            error: true;
        } & "Received a generic string")[];
        error?: undefined;
        details?: undefined;
    } | {
        error: string;
        details: any;
        tables?: undefined;
    }>;
    insertData(table: string, data: any): Promise<{
        message: string;
        data: any[];
        error?: undefined;
        details?: undefined;
    } | {
        error: string;
        details: any;
        message?: undefined;
        data?: undefined;
    }>;
    getData(table: string): Promise<{
        message: string;
        data: ({
            error: true;
        } & "Received a generic string")[];
        error?: undefined;
        details?: undefined;
    } | {
        error: string;
        details: any;
        message?: undefined;
        data?: undefined;
    }>;
}
