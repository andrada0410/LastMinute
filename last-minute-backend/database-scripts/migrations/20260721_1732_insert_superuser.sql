IF (OBJECT_ID('users') IS NOT NULL)
BEGIN
    DECLARE @superuser_id INT;
    SELECT @superuser_id = id FROM users WHERE email = 'sa@s.a';
    IF @superuser_id IS NULL
    BEGIN
        INSERT INTO users(email, password, role) VALUES ('sa@s.a', 'sa', 3);
    END;
END;