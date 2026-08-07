DECLARE @shop_id INT;
SET @shop_id = NULL;

SELECT @shop_id = s.id 
FROM shops s
JOIN users u ON s.user_id = u.id
WHERE u.email = 'kfc.centru@shop.ro';

IF @shop_id IS NOT NULL
BEGIN

    UPDATE products
    SET 
        name = N'Bacon Twister®',
        price = 23.50,
        description = N'Cine zice că nu iese nimic bun când ești sucit nu știe ce zice. Așa ajungi să te bucuri și de brânză cu Cheddar și crispy bacon în Twister®, pe lângă cei doi Crispy Strips sau Strips Nepicanți, salata iceberg, roșiile și sos burger.',
        photo_path = 'https://api.kfc.ro/uploads/medium_Cat_Det_Twister_Bacon_1272x1272px_b390b5be55.png'
    WHERE 
        shop_id = @shop_id 
        AND name = N'Cheese Fries with Pulled Pork';

END