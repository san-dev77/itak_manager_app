export interface Class {
  id?: number;
  name: string;
  level: string;
  capacity?: number;
  categorie_id: number;
  created_at?: Date;
}

export interface CreateClassDto {
  name: string;
  level: string;
  capacity?: number;
  categorie_id: number;
}

export interface UpdateClassDto {
  name?: string;
  level?: string;
  capacity?: number;
  categorie_id?: number;
}

export interface ClassResponse {
  id: number;
  name: string;
  level: string;
  capacity?: number;
  categorie_id: number;
  created_at: string;
  category?: {
    id: number;
    name: string;
  };
}
