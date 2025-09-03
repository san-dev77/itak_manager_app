export interface ClassCategory {
    id?: number;
    name: string;
    created_at?: Date;
}
export interface CreateClassCategoryDto {
    name: string;
}
export interface UpdateClassCategoryDto {
    name?: string;
}
export interface ClassCategoryResponse {
    id: number;
    name: string;
    created_at: string;
}
