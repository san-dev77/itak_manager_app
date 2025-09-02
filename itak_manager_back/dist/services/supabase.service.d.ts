export declare class SupabaseService {
    getData(table: string, select?: string): unknown;
    insertData(table: string, data: any): unknown;
    updateData(table: string, data: any, match: any): unknown;
    deleteData(table: string, match: any): unknown;
    getDataById(table: string, id: string | number): unknown;
}
