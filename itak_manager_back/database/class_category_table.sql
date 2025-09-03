-- Table class_category pour ITAK Manager
CREATE TABLE IF NOT EXISTS public.class_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_class_category_name ON public.class_category(name);

-- Insertion des catégories par défaut
INSERT INTO public.class_category (name) VALUES 
    ('Collège'),
    ('Faculté')
ON CONFLICT (name) DO NOTHING;
