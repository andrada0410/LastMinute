IF (OBJECT_ID('shops')) IS NOT NULL AND COL_LENGTH('shops', 'has_offers') IS NOT NULL
BEGIN
    DECLARE @ConstraintName NVARCHAR(200);
    DECLARE @Sql NVARCHAR(MAX);

    SELECT @ConstraintName = d.name
    FROM sys.default_constraints d
    INNER JOIN sys.columns c ON d.parent_object_id = c.object_id 
        AND d.parent_column_id = c.column_id
    INNER JOIN sys.tables t ON t.object_id = c.object_id
    WHERE t.name = 'shops'
    AND c.name = 'has_offers';

    IF @ConstraintName IS NOT NULL
    BEGIN
        SET @Sql = 'ALTER TABLE shops DROP CONSTRAINT [' + @ConstraintName + '];';
        EXEC sp_executesql @Sql;
    END;

    ALTER TABLE shops
    DROP COLUMN has_offers;
END;