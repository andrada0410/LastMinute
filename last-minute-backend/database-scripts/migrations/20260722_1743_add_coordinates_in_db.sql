IF COL_LENGTH('shops', 'coordinates') IS NULL
BEGIN
    ALTER TABLE shops 
    ADD coordinates GEOGRAPHY NULL
END;