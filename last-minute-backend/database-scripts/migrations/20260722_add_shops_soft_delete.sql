IF (OBJECT_ID('shops') IS NOT NULL) AND NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('shops') AND name = 'is_deleted'
)
BEGIN
    ALTER TABLE shops ADD is_deleted BIT NOT NULL DEFAULT 0;
END;