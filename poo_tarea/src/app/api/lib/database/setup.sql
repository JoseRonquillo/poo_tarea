
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO books (title, description, author)
SELECT 'El Principito', 'Una maravillosa historia sobre la amistad y la perspectiva', 'Antoine de Saint-Exupéry'
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'El Principito');

INSERT INTO books (title, description, author)
SELECT 'Cien años de soledad', 'La historia de la familia Buendía en Macondo', 'Gabriel García Márquez'
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'Cien años de soledad');