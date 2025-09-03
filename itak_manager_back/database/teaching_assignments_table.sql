-- Table teaching_assignments pour ITAK Manager
-- Cette table gère l'assignation des professeurs aux classes-matières
-- avec des dates de début et de fin d'assignation

CREATE TABLE IF NOT EXISTS public.teaching_assignments (
    id SERIAL PRIMARY KEY,
    teacher_id INT NOT NULL,
    class_subject_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Contraintes de clés étrangères
    FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (class_subject_id) REFERENCES public.class_subjects(id) ON DELETE CASCADE,
    
    -- Contrainte d'unicité pour éviter les assignations multiples
    UNIQUE(teacher_id, class_subject_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_teaching_assignments_teacher_id ON public.teaching_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teaching_assignments_class_subject_id ON public.teaching_assignments(class_subject_id);
CREATE INDEX IF NOT EXISTS idx_teaching_assignments_start_date ON public.teaching_assignments(start_date);
CREATE INDEX IF NOT EXISTS idx_teaching_assignments_end_date ON public.teaching_assignments(end_date);

-- Contraintes de validation
ALTER TABLE public.teaching_assignments 
ADD CONSTRAINT chk_start_date_not_future CHECK (start_date <= CURRENT_DATE);

ALTER TABLE public.teaching_assignments 
ADD CONSTRAINT chk_end_date_after_start CHECK (end_date IS NULL OR end_date >= start_date);

-- Insertion de quelques assignations par défaut
-- Assurez-vous que les professeurs et class_subjects existent d'abord
INSERT INTO public.teaching_assignments (teacher_id, class_subject_id, start_date, end_date) VALUES 
    (1, 1, '2024-09-01', NULL),    -- Professeur 1 assigné à la classe-matière 1 depuis le 1er septembre
    (2, 2, '2024-09-01', NULL),    -- Professeur 2 assigné à la classe-matière 2 depuis le 1er septembre
    (3, 3, '2024-09-01', NULL),    -- Professeur 3 assigné à la classe-matière 3 depuis le 1er septembre
    (4, 4, '2024-09-01', NULL),    -- Professeur 4 assigné à la classe-matière 4 depuis le 1er septembre
    (5, 5, '2024-09-01', NULL),    -- Professeur 5 assigné à la classe-matière 5 depuis le 1er septembre
    (1, 6, '2024-09-01', NULL),    -- Professeur 1 assigné à la classe-matière 6 depuis le 1er septembre
    (2, 7, '2024-09-01', NULL),    -- Professeur 2 assigné à la classe-matière 7 depuis le 1er septembre
    (3, 8, '2024-09-01', NULL)     -- Professeur 3 assigné à la classe-matière 8 depuis le 1er septembre
ON CONFLICT (teacher_id, class_subject_id) DO NOTHING;
