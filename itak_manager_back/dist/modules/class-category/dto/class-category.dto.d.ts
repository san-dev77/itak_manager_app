export declare class CreateClassCategoryDto {
    name: string;
}
declare const UpdateClassCategoryDto_base: import("@nestjs/common").Type<Partial<CreateClassCategoryDto>>;
export declare class UpdateClassCategoryDto extends UpdateClassCategoryDto_base {
}
export declare class ClassCategoryResponseDto {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
export {};
