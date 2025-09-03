-- Table class_subjects pour ITAK Manager
-- Cette table gère l'association entre les classes et les matières
-- avec des informations sur le coefficient, les heures hebdomadaires et le statut optionnel

CREATE TABLE IF NOT EXISTS public.class_subjects (
    id SERIAL PRIMARY KEY,
    class_id INT NOT NULL,
    subject_id INT NOT NULL,
    coefficient INT NOT NULL DEFAULT 1,
    weekly_hours INT,
    is_optional BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Contraintes de clés étrangères
    FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE,
    
    -- Contrainte d'unicité pour éviter les doublons
    UNIQUE(class_id, subject_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_class_subjects_class_id ON public.class_subjects(class_id);
CREATE INDEX IF NOT EXISTS idx_class_subjects_subject_id ON public.class_subjects(subject_id);
CREATE INDEX IF NOT EXISTS idx_class_subjects_coefficient ON public.class_subjects(coefficient);

-- Contraintes de validation
ALTER TABLE public.class_subjects 
ADD CONSTRAINT chk_coefficient_positive CHECK (coefficient >= 0);

ALTER TABLE public.class_subjects 
ADD CONSTRAINT chk_weekly_hours_positive CHECK (weekly_hours IS NULL OR weekly_hours >= 0);

-- Insertion de quelques associations par défaut
-- Assurez-vous que les classes et matières existent d'abord
INSERT INTO public.class_subjects (class_id, subject_id, coefficient, weekly_hours, is_optional) VALUES 
    (1, 1, 4, 6, false),   -- Mathématiques en classe 1, coefficient 4, 6h/semaine
    (1, 2, 3, 4, false),   -- Français en classe 1, coefficient 3, 4h/semaine
    (1, 3, 2, 3, false),   -- Anglais en classe 1, coefficient 2, 3h/semaine
    (2, 1, 4, 5, false),   -- Mathématiques en classe 2, coefficient 4, 5h/semaine
    (2, 4, 2, 3, false),   -- Histoire en classe 2, coefficient 2, 3h/semaine
    (3, 6, 3, 4, false),   -- Sciences en classe 3, coefficient 3, 4h/semaine
    (3, 7, 2, 2, false),   -- Physique en classe 3, coefficient 2, 2h/semaine
    (4, 10, 2, 3, true)    -- Informatique en classe 4, coefficient 2, 3h/semaine, optionnel
ON CONFLICT (class_id, subject_id) DO NOTHING;
