-- Migration pour ajouter le champ categorie_id à la table subjects
-- Exécutez ce script après avoir créé la table class_category

-- Ajouter la colonne categorie_id
ALTER TABLE public.subjects 
ADD COLUMN IF NOT EXISTS categorie_id INTEGER;

-- Créer la contrainte de clé étrangère
ALTER TABLE public.subjects 
ADD CONSTRAINT fk_subjects_category 
FOREIGN KEY (categorie_id) REFERENCES public.class_category(id) ON DELETE CASCADE;

-- Créer l'index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_subjects_categorie_id ON public.subjects(categorie_id);

-- Mettre à jour les matières existantes avec des catégories par défaut
-- Assurez-vous que ces catégories existent dans class_category
UPDATE public.subjects SET categorie_id = 1 WHERE name IN ('Mathématiques', 'Français', 'Anglais');
UPDATE public.subjects SET categorie_id = 2 WHERE name IN ('Histoire', 'Géographie');
UPDATE public.subjects SET categorie_id = 3 WHERE name IN ('Sciences', 'Physique', 'Chimie', 'Biologie');
UPDATE public.subjects SET categorie_id = 4 WHERE name IN ('Informatique');

-- Rendre la colonne obligatoire après avoir mis à jour les données
ALTER TABLE public.subjects 
ALTER COLUMN categorie_id SET NOT NULL;
