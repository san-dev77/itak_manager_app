export interface Subject {
  id?: number;
  name: string;
  code: string;
  categorie_id: number;
  created_at?: Date;
}

export interface CreateSubjectDto {
  name: string;
  code: string;
  categorie_id: number;
}

export interface UpdateSubjectDto {
  name?: string;
  code?: string;
  categorie_id?: number;
}

export interface SubjectResponse {
  id: number;
  name: string;
  code: string;
  categorie_id: number;
  created_at: string;
  category?: {
    id: number;
    name: string;
  };
}
