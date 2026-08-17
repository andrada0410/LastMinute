IF OBJECT_ID('offers') IS NOT NULL AND COL_LENGTH('offers', 'start_date') IS NOT NULL
BEGIN
    DECLARE @ConstraintName NVARCHAR(200);

    SELECT @ConstraintName = name
    FROM sys.default_constraints
    WHERE parent_object_id = OBJECT_ID('offers')
    AND parent_column_id = COLUMNPROPERTY(OBJECT_ID('offers'), 'start_date', 'ColumnId');

    IF @ConstraintName IS NOT NULL
    BEGIN
        EXEC('ALTER TABLE offers DROP CONSTRAINT ' + @ConstraintName);
    END;

    ALTER TABLE offers
    ADD CONSTRAINT df_offers_start_date DEFAULT GETUTCDATE() FOR start_date;
END;