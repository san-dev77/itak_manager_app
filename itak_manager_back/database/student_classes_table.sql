-- Table student_classes pour ITAK Manager
-- Cette table gère l'inscription des étudiants dans les classes
-- avec des dates de début et de fin d'inscription

CREATE TABLE IF NOT EXISTS public.student_classes (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Contraintes de clés étrangères
    FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE,
    
    -- Contrainte d'unicité pour éviter les inscriptions multiples
    UNIQUE(student_id, class_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_student_classes_student_id ON public.student_classes(student_id);
CREATE INDEX IF NOT EXISTS idx_student_classes_class_id ON public.student_classes(class_id);
CREATE INDEX IF NOT EXISTS idx_student_classes_start_date ON public.student_classes(start_date);
CREATE INDEX IF NOT EXISTS idx_student_classes_end_date ON public.student_classes(end_date);

-- Contraintes de validation
ALTER TABLE public.student_classes 
ADD CONSTRAINT chk_start_date_not_future CHECK (start_date <= CURRENT_DATE);

ALTER TABLE public.student_classes 
ADD CONSTRAINT chk_end_date_after_start CHECK (end_date IS NULL OR end_date >= start_date);

-- Insertion de quelques inscriptions par défaut
-- Assurez-vous que les étudiants et classes existent d'abord
INSERT INTO public.student_classes (student_id, class_id, start_date, end_date) VALUES 
    (1, 1, '2024-09-01', NULL),    -- Étudiant 1 en classe 1 depuis le 1er septembre
    (2, 1, '2024-09-01', NULL),    -- Étudiant 2 en classe 1 depuis le 1er septembre
    (3, 2, '2024-09-01', NULL),    -- Étudiant 3 en classe 2 depuis le 1er septembre
    (4, 2, '2024-09-01', NULL),    -- Étudiant 4 en classe 2 depuis le 1er septembre
    (5, 3, '2024-09-01', NULL),    -- Étudiant 5 en classe 3 depuis le 1er septembre
    (6, 3, '2024-09-01', NULL),    -- Étudiant 6 en classe 3 depuis le 1er septembre
    (7, 4, '2024-09-01', NULL),    -- Étudiant 7 en classe 4 depuis le 1er septembre
    (8, 4, '2024-09-01', NULL)     -- Étudiant 8 en classe 4 depuis le 1er septembre
ON CONFLICT (student_id, class_id) DO NOTHING;
