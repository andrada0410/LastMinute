IF OBJECT_ID('user_roles') IS NOT NULL
BEGIN
    INSERT INTO user_roles (id, role) VALUES (1, 'USER'), (2, 'SHOPUSER'), (3, 'SUPERUSER');
END;