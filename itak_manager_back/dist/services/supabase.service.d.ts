export declare class SupabaseService {
    getData(table: string, select?: string): Promise<({
        error: true;
    } & "Received a generic string")[]>;
    insertData(table: string, data: any): Promise<any[]>;
    updateData(table: string, data: any, match: any): Promise<any[]>;
    deleteData(table: string, match: any): Promise<{
        success: boolean;
    }>;
    getDataById(table: string, id: string | number): Promise<any>;
}
