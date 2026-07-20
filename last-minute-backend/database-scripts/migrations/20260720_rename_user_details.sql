IF OBJECT_ID('user_details') IS NOT NULL
BEGIN
    EXEC sp_rename 'user_details', 'persons';
END;