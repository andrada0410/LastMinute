IF OBJECT_ID('products') IS NOT NULL
AND OBJECT_ID('shops') IS NOT NULL
AND OBJECT_ID('users') IS NOT NULL 
BEGIN
    DECLARE @shop_id INT;


    -- BigBelly
    SET @shop_id = NULL;
    SELECT @shop_id = s.id 
    FROM shops s
    JOIN users u ON s.user_id = u.id
    WHERE u.email = 'bigbelly.manastur@shop.ro';

    IF @shop_id IS NOT NULL
    BEGIN

        INSERT INTO products(shop_id, name, price, description, photo_path)
        VALUES
        (
            @shop_id,
            N'Gourmet Double Smash Burger',
            52.00,
            N'Gourmet Double Smash e pentru momentele în care vrei ceva serios de bun și nu ai chef să explici nimănui de ce nu dai și altora. Dublu smash, brânză brie topită, bacon crocant, sos de trufe peste tot și zero intenție de a fi subtil. Muști o dată și gata — ești în poveste. Gramaj: 400 gr.',
            'https://www.bigbelly-cluj.ro/file/product/2825-2825.jpg?v=639099455058243703'
        ),
        (
            @shop_id,
            N'Meniu Gourmet Double Smash Burger',
            72.00,
            N'1x Gourmet Double Smash Burger (400g) 1x Portie Cartofi Fry`n Dip (150g)
            1x Sos la Alegere (70g)
            1x Bautura Racoritoare / Bere Tuborg 0.5l
            Gourmet Double Smash e pentru momentele în care vrei ceva serios de bun și nu ai chef să explici nimănui de ce nu dai și altora. Dublu smash, brânză brie topită, bacon crocant, sos de trufe peste tot și zero intenție de a fi subtil. Muști o dată și gata — ești în poveste.
            Gramaj: 620 gr.',
            'https://www.bigbelly-cluj.ro/file/product/2827-2827.jpg?v=639099465615076797'
        ),
        (
            @shop_id,
            N'Triple Smash Burger',
            54.00,
            N'Un burger consistent, cu 3 bucăți de vită smash, rumenite cât trebuie pentru a rămâne suculente și pline de gust, cheddar topit, bacon și ceapă crocantă pentru extra textură. Completat de salată proaspătă, castraveți murați și sosuri care le leagă pe toate, într-o chiflă pufoasă. Sățios și gustos.
            Gramaj: 500 gr',
            'https://www.bigbelly-cluj.ro/file/product/2838-2838.png?v=639108119164955743'
        ),
        (
            @shop_id,
            N'Cheese Fries',
            24.00,
            N'Cartofi prajiti (200 gr) +  sos ceddar + ceapa verde + patrunjel + jalapeno
            350 gr',
            'https://www.bigbelly-cluj.ro/file/product/cheese-fries-1418.jpg?v=637926311493972604'
        ),
        (
            @shop_id,
            N'Cheese Fries with Pulled Pork',
            31.00,
            N'Ingrediente: Cartofi prajiti (180 gr) + sos cedar + pulled pork in sos BBQ + ceapa crocanta +  ceapa verde + ardei jalapeno 
            450 gr',
            'https://www.bigbelly-cluj.ro/file/product/2553-2553.jpg?v=638767798417801155'
        ),
        (
            @shop_id,
            N'Pizza Black Chicken & Bacon',
            44.00,
            N'Ingrediente: Sos de rosii, sunca, mozzarela, piept de pui crocant, bacon, ardei copt
            *Aluatul negru este obținut prin adăugarea cărbunelui activ alimentar.
            750 gr',
            'https://www.bigbelly-cluj.ro/file/product/2364-2364.jpg?v=638433212632366512'
        ),
        (
            @shop_id,
            N'Pizza BigBelly',
            44.00,
            N'Ingrediente: Sos de rosii, porumb, sunca, pui crocant, ciuperci, mozzarella, ardei gras
            800 gr',
            'https://www.bigbelly-cluj.ro/file/product/527-527.jpg?v=637836436150285586'
        ),
        (
            @shop_id,
            N'Pizza Prosciutto Cotto',
            42.00,
            N'Ingrediente: Sos de rosii, mozzarella, sunca
            600 gr',
            'https://www.bigbelly-cluj.ro/file/thumbnailproduct/pizza-prosciutto-cotto-209.jpg?v=639028871067334696'
        ),
        (
            @shop_id,
            N'Oklahoma Smash Bowl',
            30.00,
            N'🕺Inspirat de energia festivalurilor și de serile lungi de vară, acest preparat aduce împreună tot ce iubești la street food-ul autentic 🍟 O porție generoasă de cartofi prăjiți crocanți acoperiți cu sos cremos de cheddar, ceapă caramelizată, un pattie de smashed burger suculent și felii de cedar topit. La final, ceapa crocantă și ceapa verde adaugă textura și prospețimea care transformă fiecare înghițitură într-o experiență de festival.
            Perfect de savurat între concerte, evenimente și aventurile verii. Un preparat creat special pentru sezonul festivalurilor, când foamea cere ceva consistent, iar vibe-ul cere ceva memorabil.
            Gramaj porție: 340 gr',
            'https://www.bigbelly-cluj.ro/file/product/2915-2915.png?v=639196385474027946'
        ),
        (
            @shop_id,
            N'Meniu Mini Chicken Burger',
            29.00,
            N'1x Mini Chicken Burger (230)
            1x Portie Cartofi Prăjiți 6mm (150g)
            1x Ketchup (10g)
            1x Maioneză (10g)
            1x Bautura Racoritoare
            Mini Chicken Burger Meniu aduce un burger de 230 g cu carne de pui crispy, așezată într-o chiflă pufoasă, cu salată iceberg proaspătă, ketchup și maioneză. Meniul include și cartofi prăjiți de 6 mm, sos la alegere și o băutură răcoritoare gratuită. Ideal ca un snack rapid sau chiar ca o masă completă.
            Gramaj Total: 385 gr.',
            'https://www.bigbelly-cluj.ro/file/product/2819-2819.jpg?v=639094406142858372'
        );
    END;

    
    -- KFC Centru
    SET @shop_id = NULL;
    SELECT @shop_id = s.id 
    FROM shops s
    JOIN users u ON s.user_id = u.id
    WHERE u.email = 'kfc.centru@shop.ro';

    IF @shop_id IS NOT NULL
    BEGIN

        INSERT INTO products(shop_id, name, price, description, photo_path)
        VALUES
        (
            @shop_id,
            N'Meniu Kentucky®',
            33.50,
            N'Bucăți de pui nepicante, condimentate cu cele 11 ingrediente secrete ale Colonelului. Un meniu #pebune: 2 bucăți de pui Kentucky® nepicante, porție medie de cartofi prăjiți cu o răcoritoare Coca-Cola/Coca-Cola Zero/Fanta/ Sprite 0,4L.  
            Alege mare: cu doar 4.90 LEI în plus schimbă porția medie de cartofi prăjiți cu cartofi prăjiți portie mare sau Dipping Fries și răcoritoarea Coca-Cola/Coca-Cola Zero/Fanta/Sprite 0.4L cu răcoritoare Coca-Cola/Coca-Cola Zero/Fanta/Sprite/ FUZETEA/ Schweppes Bitter Lemon 0.5L/ Apă plată 0.5L/Apă minerală 0.5L.',
            'https://api.kfc.ro/uploads/medium_Cat_Det_Meniu_Kentucky_1272x1272px_54eb23619d.png'
        ),
        (
            @shop_id,
            N'Meniu Hot Wings®',
            42.00,
            N'Dacă nu îți era poftă de Hot Wings® încă, ce spui acum? 8 Hot Wings®, porție mare de cartofi prăjiți și răcoritoare Coca-Cola/Coca-Cola Zero/Fanta/Sprite 0.5L. ',
            'https://api.kfc.ro/uploads/medium_Cat_Det_CEVA_Hot_Wings_1272x1272px_a8071e560a.png'
        ),
        (
            @shop_id,
            N'Meniu Fillet Bites®',
            42.00,
            N'Un meniu de care te bucuri #pebune 9 Fillet Bites®, cartofi prăjiți porție mare și răcoritoare Coca-Cola/Coca-Cola Zero/Fanta/Sprite 0.5L.',
            'https://api.kfc.ro/uploads/medium_Cat_Det_Meniu_9_Fillet_Bites_1272x1272px_b868ffb4ae.png'
        ),
        (
            @shop_id,
            N'Meniu Crispy Strips®',
            53.00,
            N'Ia-ți meniu Crispy Strips® cu 8 crispy strips, o porție mare de cartofi și o răcoritoare Coca-Cola/ Coca-Cola Zero/Fanta/ Sprite 0.5L.',
            'https://api.kfc.ro/uploads/medium_Cat_Det_Meniu_5_Crispy_Strips_1272x1272px_02067f46b8.png'
        ),
        (
            @shop_id,
            N'Cheese Fries with Pulled Pork',
            31.00,
            N'Ingrediente: Cartofi prajiti (180 gr) + sos cedar + pulled pork in sos BBQ + ceapa crocanta +  ceapa verde + ardei jalapeno 450 gr',
            'https://www.bigbelly-cluj.ro/file/product/2553-2553.jpg?v=638767798417801155'
        ),
        (
            @shop_id,
            N'Zinger® Burger',
            15.50,
            N'Clasic, simplu și delicios! 100% piept de pui crocant și picant, salată Iceberg și sos burger, plus chiflă proaspătă! Zinger Burger, corect!',
            'https://api.kfc.ro/uploads/medium_Cat_Det_Burger_Zinger_Burger_1272x1272px_5a4d38538d.png'
        ),
        (
            @shop_id,
            N'Fillet® Burger',
            15.50,
            N'Bucură-te de un Fillet Burger: burger de pui nepicant, cu salată Iceberg și sos burger, toate puse într-o chiflă proaspătă!',
            'https://api.kfc.ro/uploads/medium_Cat_Det_Burger_Fillet_Burger_1272x1272px_e06e17b32e.png'
        ),
        (
            @shop_id,
            N'Twister®',
            20.50,
            N'Același pui KFC, dar cu un twist! Crispy Strips® sau Strips Nepicanți înveliți în tortilla alături de roșii, salată Iceberg și sos burger.',
            'https://api.kfc.ro/uploads/medium_Cat_Det_Twister_Nepicant_1272x1272px_3843144bc7.png'
        ),
        (
            @shop_id,
            N'Meltz Picant/Nepicant',
            23.00,
            N'Gustarea perfectă nu exis... tortilla, 2 bucăți de piept de pui Crispy Strips®/ Strips Nepicanți, brânză topită cu Cheddar, sos sweet & sour și cubulețe de roșii! Meltz our hearts.',
            'https://api.kfc.ro/uploads/medium_Cat_Det_Meltz_1272x1272px_0dcffee050.png'
        ),
        (
            @shop_id,
            N'Cartofi Prăjiți',
            29.00,
            N'Ce-ar sta bine lângă puiul nostru #pebune? O porție mare de cartofii prăjiți! Love at first bite.',
            'https://api.kfc.ro/uploads/medium_Cat_Det_Fries_Large_Fries_1272x1272px_31cc975c03.png'
        );
    END;


    -- McDonald's
    SET @shop_id = NULL;
    SELECT @shop_id = s.id 
    FROM shops s
    JOIN users u ON s.user_id = u.id
    WHERE u.email = 'mcdonalds.mihaiviteazul@shop.ro';

    IF @shop_id IS NOT NULL
    BEGIN

        INSERT INTO products(shop_id, name, price, description, photo_path)
        VALUES
        (
            @shop_id,
            N'McPuișor® Fresh ',
            9.90,
            N'Carne fragedă de pui în crustă crocantă, cu sos McChicken®, legume proaspete și chiflă pufoasă 115 g ℮  ',
            'https://www.mcdonalds.ro/sites/default/files/styles/500x500/public/field_product_image/2026-07/burger%20pui.png?itok=ZMLdiZWA'
        ),
        (
            @shop_id,
            N'Chicken McNuggets®',
            33.40,
            N'9 Bucăţi de piept de pui fragede în interior, aurii și crocante la exterior, învelite într-un strat pané crocant.',
            'https://www.mcdonalds.ro/sites/default/files/styles/500x500/public/field_product_image/2023-10/ro-upload-d8c680f3-3c5f-4fd2-add9-a404ae055fa7.png?itok=YVIXQ1rq'
        ),
        (
            @shop_id,
            N'Aripioare - produs picant',
            36.20,
            N'9 Aripioare de pui, acoperite uniform într-un înveliș pané crocant.',
            'https://www.mcdonalds.ro/sites/default/files/styles/500x500/public/field_product_image/2021-03/Aripioare_pui_5.png?itok=n4MCtfjX'
        ),
        (
            @shop_id,
            N'Big Mac®',
            21.20,
            N'Două felii de carne de vită tocată preparate pe grătar, asezonate cu sare și piper, sos Big Mac® și brânză topită cu Cheddar, salată crocantă, ceapă, felii de castraveţi muraţi, chiflă Big Mac® cu susan.',
            'https://www.mcdonalds.ro/sites/default/files/styles/500x500/public/field_product_image/2022-07/BM.png?itok=JaRbeO6z'
        ),
        (
            @shop_id,
            N'Hamburger',
            7.90,
            N'O felie de carne de vită tocată, preparată pe grătar, asezonată cu sare și piper, muștar și ketchup, ceapă, felie de castravete murat, chiflă.',
            'https://www.mcdonalds.ro/sites/default/files/styles/500x500/public/field_product_image/2026-03/hamburger%20500x500.png?itok=O4YsI9to'
        ),
        (
            @shop_id,
            N'Meniu Big Tasty™',
            39.90,
            N'Un meniu gustos de avantajos: un Big Tasty, o porţie medie de cartofi şi, la alegere, o băutură răcoritoare sau apă.',
            'https://www.mcdonalds.ro/sites/default/files/styles/500x500/public/field_product_image/2026-04/Meniu%20Big%20Tasty%C2%AE%20%20500PX_0.png?itok=UiWy9LgM'
        ),
        (
            @shop_id,
            N'Meniu Big Mac®',
            32.90,
            N'Meniul care-ți potolește foamea! Un BigMac®, o porţie medie de cartofi şi, la alegere, o băutură răcoritoare sau apă.',
            'https://www.mcdonalds.ro/sites/default/files/styles/500x500/public/field_product_image/2026-04/Meniu%20Big%20Mac%C2%AE%20500px_0.png?itok=vXqkRJtV'
        ),
        (
            @shop_id,
            N'Meniu Fresh Deluxe™',
            36.90,
            N'Meniul demn de un rege: un Fresh Deluxe, o porţie medie de cartofi şi, la alegere, o băutură răcoritoare sau apă.',
            'https://www.mcdonalds.ro/sites/default/files/styles/500x500/public/field_product_image/2026-04/Meniu%20Fresh%20Deluxe%20500PX_0.png?itok=7rOmI3dl'
        ),
        (
            @shop_id,
            N'Happy Meal™ McPuisor',
            19.90,
            N'Meniul plin de zâmbete te așteaptă mereu cu noi surprize. O felie de carne de pui într-un strat crocant de pesmet auriu, însoţită de sos McPuișor®, castraveţi muraţi și chiflă.',
            'https://www.mcdonalds.ro/sites/default/files/styles/500x500/public/field_product_image/2026-03/puisor%20500x500.png?itok=9_14V2oZ'
        ),
        (
            @shop_id,
            N'Bavaria Mozza Sticks',
            13.20,
            N'Batoane cu Mozzarella în aluat de bere *72g ℮',
            'https://www.mcdonalds.ro/sites/default/files/styles/500x500/public/field_product_image/2026-08/500x500%20-%20Mozzarella%20Sticks.jpg?itok=yZbrRU4D'
        );
    END;


    -- MEATinc.
    SET @shop_id = NULL;
    SELECT @shop_id = s.id 
    FROM shops s
    JOIN users u ON s.user_id = u.id
    WHERE u.email = 'meatinc@shop.ro';

    IF @shop_id IS NOT NULL
    BEGIN

        INSERT INTO products(shop_id, name, price, description, photo_path)
        VALUES
        (
            @shop_id,
            N'Breakfast  Combo',
            44.00,
            N'
            Un burger Breakfast si o portie de cartofi prajiti .
            Burger Breakfast - Chifla pufoasa cu ou ochi, bacon, cheddar, sos remoulade, rosie, salata verde. Total 300 g
            Valori nutritionale:
            •	Calorii: 500 calorii
            •	Grăsimi: 30g grăsimi
            •	Proteine: 25g proteine
            •	Carbohidrați: 30g carbohidrați
            Alergeni: Glute, crustacee si produse derivate, oua si produse derivate, peste si produse derivate, arahide si produse derivate, soia si produse derivate, lapte si produse derivate, fructe cu coaja lemnoasa, telina si produse derivate, mustar si produse derivate, seminte de susan si produse derivate, lupini si produse derivate, moluste si produse derivate.',
            'https://images.bolt.eu/store/2025/2025-12-08/2455886a-c98e-4bc2-a41b-0a20c78e8fe7.png'
        ),
        (
            @shop_id,
            N'Original Combo',
            47.00,
            N'Un burger Original si un suc gama Pepsi 380 ML.
            Burger Original - Chifla, unt,carne  de vita black angus 100 g, sos burger, salata lolo, rosie . Total aprox. 250 g.
            Valoare nutrițională:
            •	Calorii: aproximativ 290
            •	Proteine: aproximativ 25g
            •	Grăsimi: aproximativ 10
            •	Carbohidrați: aproximativ 30g
            Alergeni: Gluten, crustacee si produse derivate, oua si produse derivate, peste si produse derivate, arahide si produse derivate, soia si produse derivate, lapte si produse derivate, fructe cu coaja lemnoasa, telina si produse derivate, mustar si produse derivate, seminte de susan si produse derivate, lupini si produse derivate, moluste si produse derivate.',
            'https://images.bolt.eu/store/2025/2025-12-08/ebdf6147-00a3-438b-89d0-848ab2002315.png'
        ),
        (
            @shop_id,
            N'Smashed PEPSI COMBO',
            145.00,
            N'2 x Oklahoma Smashed Burgers
            2 x Cajun Fries
            2 x Suc gama Pepsi',
            'https://images.bolt.eu/store/2025/2025-04-03/5387d599-340b-468c-b937-8afec9e5e2c1.png'
        ),
        (
            @shop_id,
            N'Fresh & Spicy',
            62.00,
            N'Chifla 80 gr, carne de vita manzat black angus 120 gr, Cheddar, valeriana, avocado, sos special.
            Valori nutritionale:
            * Proteine: 53.90 gr
            * Lipide: 59.40 gr
            * Glucide: 45.28 gr
            * Valoare energetica: 956.19 gr',
            'https://images.bolt.eu/store/2025/2025-05-08/a426e678-c803-4177-aa44-77e78be2ce33.png'
        ),
        (
            @shop_id,
            N'Don Dijon',
            62.00,
            N'Chifla 80 gr, carne de vita manzat black angus 120g, cheddar 80 gr, sos dijonaise, ceapa deep fried home made, bacon 40 gr.
            Valoare energetica:
            * Proteine: 62.58 gr
            *  Lipide: 60.37 gr
            *  Glucide: 23.73 gr
            *  Valoare energetica: 980.71 Kcal',
            'https://images.bolt.eu/store/2025/2025-05-08/7f6507cc-8889-45d8-ab55-973b9ec705d1.png'
        ),
        (
            @shop_id,
            N'Oklahoma Smashed Burger',
            55.00,
            N'Potato roll bun (70gr), carne  de vita angus smashed (2x60gr), ceapa alba pe grill (25gr), castraveti murati (20gr), branza cheddar 30 gr), sos burger (30gr). Total aprox 300 gr.
            Valori nutritionale:
            Calorii: 610 Kcal
            Proteine: 48 gr
            Carbohidrati: 59 gr
            Grasimi : 47 gr',
            'https://images.bolt.eu/store/2024/2024-09-11/9889026c-e3ff-456d-b24e-a9c0665a6812.png'
        ),
        (
            @shop_id,
            N'Chick`s Loaded Fries',
            45.00,
            N'Cajun Fries 180 gr, Strips Pui 100 gr, Sos Special 50 gr, Patrunjel',
            'https://images.bolt.eu/store/2024/2024-03-08/d9096eca-e848-4ed2-8836-a91a827d7c85.jpeg'
        ),
        (
            @shop_id,
            N'Breakfast burger',
            35.00,
            N'Chifla pufoasa cu ou ochi, bacon, cheddar, sos remoulade, rosie, salata verde. Total 300 g
            Valori nutritionale:
            •	Calorii: 500 calorii
            •	Grăsimi: 30g grăsimi
            •	Proteine: 25g proteine
            •	Carbohidrați: 30g carbohidrați
            Alergeni: Glute, crustacee si produse derivate, oua si produse derivate, peste si produse derivate, arahide si produse derivate, soia si produse derivate, lapte si produse derivate, fructe cu coaja lemnoasa, telina si produse derivate, mustar si produse derivate, seminte de susan si produse derivate, lupini si produse derivate, moluste si produse derivate.',
            'https://images.bolt.eu/store/2025/2025-04-03/7c93be21-4439-4799-80c7-2384725a8a1d.png'
        ),
        (
            @shop_id,
            N'Mac & Cheese',
            26.00,
            N'Macaroane, Lapte, crema de branza, Cheddar Hochland, Parmezan, Curcuma, Piper alb, sar, Total aproximativ 150 gr.(Contitatile pot varia cu +/- 10%)
            •	Calorii totale: Aproximativ 179 kcal
            •	Proteine totale: Aproximativ 10g
            •	Grăsimi totale: Aproximativ 15.4g
            •	Carbohidrați totali: Aproximativ 10.2g',
            'https://images.bolt.eu/store/2025/2025-04-03/7ab491d9-25f0-4413-8977-9bfff29fbd83.jpeg'
        ),
        (
            @shop_id,
            N'Pulled pork',
            43.00,
            N'Ceafa de porc franjurata , gatita lent timp de 8 ore si afumata, sos BBQ si cu sos cheddar, (Total 250g)
            Valoare nutritională:
            Per 100 g carne:
            •	Calorii: 270 kcal
            •	Proteine: 26 g
            •	Grăsimi: 16 g
            •	Carbohidrați: 4 g
            Alergeni: Gluten, crustacee si produse derivate, oua si produse derivate, peste si produse derivate, arahide si produse derivate, soia si produse derivate, lapte si produse derivate, fructe cu coaja lemnoasa, telina si produse derivate, mustar si produse derivate, seminte de susan si produse derivate, lupini si produse derivate, moluste si produse derivate',
            'https://images.bolt.eu/store/2025/2025-04-03/d5e05f64-7deb-48ec-855d-4e2b826163d4.png'
        );
    END;


    -- Marty
    SET @shop_id = NULL;
    SELECT @shop_id = s.id 
    FROM shops s
    JOIN users u ON s.user_id = u.id
    WHERE u.email = 'marty.delivery@shop.ro';

    IF @shop_id IS NOT NULL
    BEGIN

        INSERT INTO products(shop_id, name, price, description, photo_path)
        VALUES
        (
            @shop_id,
            N'Pizza Hawaii',
            50.50,
            N'Sos de roșii Mutti, mozzarella, prosciutto crudo, ananas',
            'https://images.bolt.eu/store/2026/2026-08-03/b1eed945-1911-4c19-bf28-b0be872447fe.jpeg'
        ),
        (
            @shop_id,
            N'Turkey Soup',
            40.50,
            N'',
            'https://images.bolt.eu/store/2026/2026-08-03/1fd40ea9-9641-4244-bf45-40c2d4caaecf.png'
        ),
        (
            @shop_id,
            N'Pizza Funghi',
            46.50,
            N'Aluat de pizza, sos de roșii, mozzarella, ciuperci. Alergeni: gluten, lactoză.
            400g
            Aditivi: potentiator de gust.
            Valori nutriționale pentru 100 grame:
            Valoare energetică: 247,89 Kcal / 1036,19 Kj, Grăsimi: 8,5 g, Acizi grași saturați: 3,63 g, Glucide: 33,21 g, Zaharuri: 2,01 g, Proteine: 9,79 g, Sare: 1,32 g.',
            'https://images.bolt.eu/store/2026/2026-08-03/4408a04d-81f1-4b0b-bc4b-b92c323c865a.jpeg'
        ),
        (
            @shop_id,
            N'Chicken noodle soup',
            32.00,
            N'',
            'https://images.bolt.eu/store/2026/2026-07-31/d06ec09b-609e-48be-b60c-1553154ff81a.png'
        ),
        (
            @shop_id,
            N'Cremă de roșii',
            42.00,
            N'Servită cu crutoane de casă - produs vegetarian',
            'https://images.bolt.eu/store/2026/2026-07-31/acb7cbdd-43c8-44db-aa05-48ef1c8361e2.png'
        ),
        (
            @shop_id,
            N'Focaccia',
            9.0,
            N'',
            'https://images.bolt.eu/store/2026/2026-07-31/46c0e110-c218-4e9b-b564-0b3601bc557b.jpeg'
        ),
        (
            @shop_id,
            N'Burger în chifle Bao',
            67.00,
            N'Chifle bao, carne de vită (România), cașcaval cheddar, salată kimchi, ceapă verde, ceapă crocantă, sos de cașcaval, sos aromatizat, produs picant. 320g/50g
            Valori Nutriționale pentru 100 g
            Valoare Energetică: 338,09 Kcal / 1413,22 Kj, Lipide 22,35 g, din care Acizi Grași Saturați 10,25 g,
            Glucide: 22,39 g, din care Zaharuri: 5,49 g, Proteine: 12,1 g, Sare: 2,49 g.
            Alergeni: soia, lactoză, semințe de susan, gluten.',
            'https://images.bolt.eu/store/2026/2026-07-31/6da70a53-99fd-40c2-b70f-c91149e25e9f.png'
        ),
        (
            @shop_id,
            N'Pui cu portocale',
            58.00,
            N'Piept de pui (România), orez, portocală, usturoi, ceapă verde, ketchup dulce, sos de soia, zahăr brun, sriracha, făină, produs picant.
            Valori nutriționale pentru 100 grame:
            Valoare energetică: 186,86 Kcal / 781,09 Kj, Grăsimi: 5,99 g, din care Acizi Grași Saturați: 0,96 g,
            Glucide: 21,45 g, din care Zaharuri: 9,2 g, Proteine: 11,7 g, Sare: 0,86 g.
            Alergeni: gluten, soia.',
            'https://images.bolt.eu/store/2026/2026-07-31/181e9210-212d-4671-9fdf-fd428ef0152d.png'
        ),
        (
            @shop_id,
            N'Beef Ramen',
            72.00,
            N'Supă pe bază de oase (oase de porc/vită, ceapă, morcovi, ghimbir) PD, pastă miso, sos de soia, ciuperci shitake, ciuperci shimeji, ou, sos de soia, tăiței noodles, ceapă verde, brisket.
            Valori nutriționale pentru 100 grame:
            Valoare energetică: 84,88 Kcal / 354,8 Kj, Grăsimi: 3,17 g, din care Acizi Grași Saturați: 0,88 g,
            Glucide: 8,84 g, din care Zaharuri: 1,03 g, Proteine: 6,14 g, Sare: 2,73 g.
            Alergeni: soia, ou.',
            'https://images.bolt.eu/store/2026/2026-07-31/fe47c0f7-c7a4-44ab-8cfd-e62778bf63e3.png'
        ),
        (
            @shop_id,
            N'Burrito',
            64.00,
            N'Chilli con carne PD, lipie, sos de roșii, salsa pico de gallo, dovlecel, fasole roșie, porumb, orez, guacamole, cașcaval cheddar, mozzarella, lămâie
            400g, produs picant
            Valori Nutriționale pentru 100 g
            Valoare Energetică: 229,19 Kcal / 958 Kj, Lipide 7,32 g, din care Acizi Grași Saturați 2,74 g,
            Glucide: 30,17 g, din care Zaharuri: 5,95 g, Proteine: 10,61 g, Sare: 0,92 g. Alergeni: gluten, lactoză',
            'https://images.bolt.eu/store/2026/2026-07-31/464ef150-009a-4603-b694-b32fd1135c48.png'
        );
    END;


    -- Panemar
    SET @shop_id = NULL;
    SELECT @shop_id = s.id 
    FROM shops s
    JOIN users u ON s.user_id = u.id
    WHERE u.email = 'panemar.memo@shop.ro';

    IF @shop_id IS NOT NULL
    BEGIN

        INSERT INTO products(shop_id, name, price, description, photo_path)
        VALUES
        (
            @shop_id,
            N'CROISSANT CU UNT',
            4.00,
            N'Aici se regăsește gustul autentic al croissantului franțuzesc.
            Ingrediente:
            făină albă de grâu, 24% unt, apă, zahăr, drojdie, gluten de grâu, sare iodată, drojdie inactivă, făină din malț de grâu, agenți de tratare a făinii: acid ascorbic, enzime. Glazură: apă, gluten de grâu.
            Gramaj: 75g',
            'https://panemar.ro/wp-content/uploads/2023/07/Panemar-Produs-Croissant-cu-Unt.jpg'
        ),
        (
            @shop_id,
            N'MUFFIN',
            5.00,
            N'Cu cacao sau simplu, muffin este surpriza pufoasă din coșuleț pentru colegii de la locul de muncă.
            Ingrediente:
            premix pentru chec (zahăr, făină de grâu, amidon din GRÂU, fructe in proportii variabile (portocale, mere), sirop de glucoză-fructoză, agenți de afânare: difosfați, carbonați de sodiu, arome, sare, dextroză, făină de orez, agent de îngroșare: gumă de xantan, ulei vegetal de palmier, agent gelatinizant: pectine, acidifiant: acid citric, colorant: annatto), zahăr, făină de grâu, ouă, apă, ulei vegetal de floarea soarelui, agent de afânare: bicarbonat de sodiu, pirofosfat acid de sodiu. 
            Gramaj: 85g',
            'https://panemar.ro/wp-content/uploads/2023/07/4196b68f34Panemar-muffin-produs.jpg'
        ),
        (
            @shop_id,
            N'MINI PANETTONE CU FISTIC',
            15.00,
            N'Cu fistic sau zmeură, Panettone este surpriza delicată din coșuleț pentru cei mici și pentru cei mari.
            Ingrediente:
            făină albă de grâu, 20% umplutură [ulei vegetal (palmier), zahăr, fistic 15%, lapte praf degresat, zer pudră, lactoză, emulsifiant: lecitină de soia, arome], glazură (uleiuri rafinate și grăsimi vegetale total hidrogenate (floarea soarelui, palmier, sâmbure de palmier), zahăr, fistic  7%, unt de cacao, lapte praf, zer pudră, lactoză, emulgator: lecitină de floarea soarelui, lecitină din soia, arome), apă, unt, zahăr, gălbenuș, lapte praf integral, miere de albine, sare iodată, drojdie, gluten, emulsifianți: mono- și digliceride ale acizilor grași, stearoil-2-lactilat de sodiu, arome, enzime. Decor: 2% fistic prăjit. 
            Gramaj: 100g',
            'https://panemar.ro/wp-content/uploads/2023/07/Panemar-Mini-Panettone-cu-Fistic-Produs.jpg'
        ),
        (
            @shop_id,
            N'MINI PANETTONE CU ZMEURĂ',
            15.00,
            N'Cu fistic sau zmeură, Panettone este surpriza delicată din coșuleț pentru cei mici și pentru cei mari.
            Ingrediente:
            făină albă de grâu, 25 % umplutură [zmeură 38%, sirop de glucoză, zahăr, piure de mere, suc de fructe (zmeură, măr), amidon modificat, acidifiant: acid citric, stabilizator: gumă gellan, aromă, conservant: sorbat de potasiu, colorant: carmin, hibiscus, morcov], apă, unt, zahăr, gălbenuș, sare, gluten, arome, colorant: beta-caroten, emulsifianți: esteri ai acidului mono-și diacetiltartric cu mono-și digliceride ale acizilor grași, agenți de tratare a făinii: acid ascorbic, enzime, cisteină. Glazură: uleiuri rafinate și grăsimi vegetale total hidrogenate (floarea soarelui, palmier, sâmbure de palmier), zahăr, unt de cacao, lapte praf, emulsifianți: lecitină de floarea soarelui, lecitină de soia, arome. Decor: 2% zmeură liofilizată. 
            Gramaj: 100g',
            'https://panemar.ro/wp-content/uploads/2023/07/Panemar-Mini-Panettone-cu-Zmeura-Produs.jpg'
        ),
        (
            @shop_id,
            N'COVRIG BAVAREZ CU SUSAN',
            9.00,
            N'Din tradiția Bavariei, cu puțină pasiune de la noi, vă oferim o soluție simplă și delicioasă de a vă stăpâni foamea.
            Ingrediente:
            făină albă de grâu, apă, maia de grâu (făină albă de grâu, apă, culturi starter), uleiuri vegetale (palmier, floarea-soarelui), drojdie, sare iodată, zahăr, făină de malț de grâu, agenți de tratare a făinii: acid ascorbic, enzime. Decor: 5% semințe de susan.
            Gramaj: 85g',
            'https://panemar.ro/wp-content/uploads/2023/07/Panemar-Covrig-Bavarez-Cu-Susan-Produs.jpg'
        ),
        (
            @shop_id,
            N'COVRIG BAVAREZ CU SARE',
            9.00,
            N'Din tradiția Bavariei, cu puțină pasiune de la noi, vă oferim o soluție simplă și delicioasă de a vă stăpâni foamea.
            Ingrediente:
            făină albă de grâu, apă, maia de grâu (făină albă de grâu, apă, culturi starter), uleiuri vegetale (palmier, floarea-soarelui), drojdie, sare iodată, zahăr, făină de malț de grâu, agenți de tratare a făinii: acid ascorbic, enzime. Decor: 3% sare ornamentală.
            Gramaj: 85g',
            'https://panemar.ro/wp-content/uploads/2023/07/56d77d84c8Panemar-covrig-bavarez-produs.jpg'
        ),
        (
            @shop_id,
            N'COVRIG POLONEZ',
            9.00,
            N'O ploaie de nucă revărsată peste un aluat însiropat, făcut după o rețetă originală.
            Ingrediente:
            făină albă de grâu, grăsimi vegetale (palmier, rapiță), apă, zahăr, drojdie, sare iodată, drojdie inactivă, făină de malț de grâu, aromă, agenți de tratare a făinii: acid ascorbic, enzime. Sirop: apă, zahăr, sirop de glucoză. Décor: nucă măcinată.
            * Miezul de nucă este atent selectat anterior utilizării. Cu toate acestea, produsele pot conține accidental fragmente de coajă.
            Gramaj: 200g',
            'https://panemar.ro/wp-content/uploads/2023/07/Panemar-Produs-Covrig-Polonez.jpg'
        ),
        (
            @shop_id,
            N'CROISSANT CU CREMĂ DE FISTIC',
            16.00,
            N'Croissantul cu cremă de fistic este preferatul celor cu gusturi pretențioase.
            Ingrediente:
            făină albă de grâu, 24% unt, apă, zahăr, drojdie, gluten de grâu, sare iodată, drojdie inactivă, făină din malț de grâu, agenți de tratare a făinii: acid ascorbic, enzime, 40% cremă [ulei vegetal de palmier, zahăr, fistic (15%), lapte praf degresat, zer pudră, lactoză, emulsifiant: lecitină din soia, arome]. Décor: glazură (zahăr, apă, sirop de glucoză, agent gelatinizant: pectine, acidifiant: acid citric, agent de îngroșare: gumă de xantan, gumă de carruba, conservant: sorbat de potasiu), 3% fistic măcinat.
            Gramaj: 125g',
            'https://panemar.ro/wp-content/uploads/2023/06/Panemar-Croissant-cu-Crema-de-Fistic-Produs.jpg'
        ),
        (
            @shop_id,
            N'CROISSANT CU CREMĂ DE CACAO',
            16.00,
            N'Preparat cu măiestrie și multă pasiune, croissantul cu cremă de cacao este desertul ideal.
            Ingrediente:
            făină albă de grâu, 24% unt, apă, zahăr, drojdie, gluten de grâu, sare iodată, drojdie inactivă, făină din malț de grâu, agenți de tratare a făinii: acid ascorbic, enzime, 40% cremă [uleiuri vegetale (floarea-soarelui, palmier), zahăr, 12% lapte praf integral, lactoză, lapte praf degresat, 4% cacao degresată, emulsifiant: lecitină din soia, arome]. Décor: glazură (zahăr, apă, sirop de glucoză, agent gelatinizant: pectine, acidifiant: acid citric, agent de îngroșare: gumă de xantan, gumă de carruba, conservant: sorbat de potasiu), 3,5% granule de cacao.
            Gramaj: 125g',
            'https://panemar.ro/wp-content/uploads/2023/06/Panemar-Croissant-cu-Crema-de-Ciocoata-Produs.jpg'
        ),
        (
            @shop_id,
            N'MĂLAI CU LAPTE',
            8.00,
            N'La un mălai cu lapte se creează momentul ideal pentru amintirile frumoase!
            Ingrediente:
            iaurt, brânză de vaci, lapte 18%, ouă, zahăr, 8% mălai (făină de porumb), smântână, ulei vegetal de floarea soarelui, albuș de ou praf, griș de grâu, agenți de afânare: bicarbonat de sodiu, pirofosfat acid de sodiu, sare iodată, aromă.
            Gramaj: 130g',
            'https://panemar.ro/wp-content/uploads/2023/07/Panemar-Produs-Malai-cu-Lapte.jpg'
        );
    END;


    -- Lidl
    SET @shop_id = NULL;
    SELECT @shop_id = s.id 
    FROM shops s
    JOIN users u ON s.user_id = u.id
    WHERE u.email = 'lidl.marasti@shop.ro';

    IF @shop_id IS NOT NULL
    BEGIN

        INSERT INTO products(shop_id, name, price, description, photo_path)
        VALUES
        (
            @shop_id,
            N'Mozzarella rasă',
            23.99,
            N'cantitate XXL',
            'https://www.lidl.ro/assets/gcpca162ae3d0164790a64103147dea7a98.png'
        ),
        (
            @shop_id,
            N'Pișcoturi italienești',
            10.49,
            N'cantitate XXL',
            'https://www.lidl.ro/assets/gcpb1be7d502da146a3a29f4e0564d74270.png'
        ),
        (
            @shop_id,
            N'Înghețată la cornet',
            14.99,
            N'8 bucăți',
            'https://www.lidl.ro/assets/gcp62461bde288a46178bd2bad87985e1bd.jpg'
        ),
        (
            @shop_id,
            N'Nuggets de pui',
            14.25,
            N'2 sosuri incluse',
            'https://www.lidl.ro/assets/gcpd386d34b115044e9bdb04ff6459465df.png'
        ),
        (
            @shop_id,
            N'Arahide prăjite și sărate',
            17.99,
            N'cantitate XXL',
            'https://www.lidl.ro/assets/gcp50ee07c7f0664f51a681f317c3c81440.png'
        ),
        (
            @shop_id,
            N'Mix asiatic',
            13.49,
            N'Tip: Pui Tikka Masala',
            'https://www.lidl.ro/assets/gcp0026c7c16c394766862fc95aab96ec02.png'
        ),
        (
            @shop_id,
            N'File de hering în sos tomat',
            14.99,
            N'cantitate XXL',
            'https://www.lidl.ro/assets/gcp5ca2a23ed5b847138f5ff539720fea94.png'
        ),
        (
            @shop_id,
            N'Salam Milano, feliat',
            7.99,
            N'Tip: Salam italian Milano feliat',
            'https://www.lidl.ro/assets/gcpdf8671ff2b724663972516cdb57ee37c.png'
        ),
        (
            @shop_id,
            N'Mozzarella din lapte de vacă',
            7.99,
            N'cantitate XXL',
            'https://www.lidl.ro/assets/gcp763300da90d44451a75cedc405497200.png'
        ),
        (
            @shop_id,
            N'Sos de roșii pentru paste',
            9.99,
            N'Tip: Sos de calitate superioară pentru paste',
            'https://www.lidl.ro/assets/gcpaf441fb8e9cc43b899478b0df8c992e1.png'
        );
    END;


    -- Carrefour
    SET @shop_id = NULL;
    SELECT @shop_id = s.id 
    FROM shops s
    JOIN users u ON s.user_id = u.id
    WHERE u.email = 'carrefour.express@shop.ro';

    IF @shop_id IS NOT NULL
    BEGIN

        INSERT INTO products(shop_id, name, price, description, photo_path)
        VALUES
        (
            @shop_id,
            N'Capsuni Romania caserola 500g',
            14.99,
            N'Capsuni Romania caserola 500g Cantitate neta: 500g Alergeni: Nu contine Tara de origine: Romania Conditii de depozitare: camera frigorifica Soi: Mixt Categoria de calitate: I Calibru: min 25, productie in solar Imaginea produsului este cu tiltu de prezentare, informatiile privind tara de provenienta, categoria de calitate si calibrul pot varia in functie de disponibilitatea stocului si de locatia magazinului livrator. Tara de origine va fi comunicata clientului, la cerere, inainte de finalizarea comenzii. In campul "Cerinte Speciale", puteti comunica livratorului detalii despre modul in care doriti sa primiti produsele (ex: cantitate, aspect, grad de coacere, etc.)',
            'https://glovo.dhmedia.io/image/global-catalog-glovo/nv-global-catalog/xe/d90ec112-d1f0-4f40-a6a8-462fb1db5dea.jpg?t=W3sid2VicCI6e319XQ=='
        ),
        (
            @shop_id,
            N'Caserola 15 oua L Free Range Toneli',
            21.99,
            N'Caserola 15 oua L Free Range Toneli Cantitate neta: 15 bucati Marime: L Cod: 1 Ingrediente: Ou Alergeni: Ou Valori nutritionale: Valoare energetica: 543 Kj /130 Kcal; Grasimi: 8, 42g din care acizi grasi saturati: 2.9 g; Glucide: 0.73 g - din care zaharuri: 0, 7 g; Proteine: 12, 88 g; Fibre: <0, 5 g; Sare: 0, 44 g. Termen de valabilitate: A se consuma inainte de data inscriptionata pe ambalaj. Conditii de depozitare: Conditii de depozitare: A se pastra in spatii racoroase, fara mirosuri straine si ferite de surse de caldura. Atentionari speciale: A se pastra la frigider dupa cumparare. Tara de origine: Romania',
            'https://glovo.dhmedia.io/image/global-catalog-glovo/nv-global-catalog/xe/09899eb1-5d89-41d5-956b-995f4458e319.jpg?t=W3sid2VicCI6e319XQ=='
        ),
        (
            @shop_id,
            N'Lapte integral 3.5% grasime Napolact 1.5L',
            15.99,
            N'Lapte integral 3.5% grasime Napolact 1.5L Cantitate neta: 1.5L Stare termica: Refrigerate Ingrediente: LAPTE DE VACA PASTEURIZAT, CHEAG, SARE Alergeni: Lapte si produse din lapte (inclusiv lactoza) Valori nutritionale: Informatii nutritionale /100 ml Valoarea energetica 262 kJ / 60 kcal Grasimi 3,5 g -din care acizi grasi saturati 2,1 g Glucide 4,5 g -din care zaharuri 4,5 g Proteine 3,1 g Sare 0,06 g Termen de valabilitate: A se consuma de preferinta inainte de: vezi data scrisa pe ambalaj. Conditii de depozitare: intre 2-4°C Atentionari speciale: Lapte de consum integral standardizat Tara de origine: RomaniaTara de origine a ingredientelor principale: Romania',
            'https://glovo.dhmedia.io/image/global-catalog-glovo/nv-global-catalog/xe/1bcf060f-c057-4575-b210-c7c2d9b98198.jpg?t=W3sid2VicCI6e319XQ=='
        ),
        (
            @shop_id,
            N'Cotlet dezosat de porc Carrefour La Piata 400g',
            14.25,
            N'Cotlet dezosat de porc Carrefour la Piata 400g, tara de origine Romania',
            'https://glovo.dhmedia.io/image/global-catalog-glovo/nv-global-catalog/xe/d037aaba-a26b-46df-a743-5e21e1c36f35.jpg?t=W3sid2VicCI6e319XQ=='
        ),
        (
            @shop_id,
            N'Salam Uscat Agricola 200G',
            11.49,
            N'Salam Uscat Agricola 200G Cantitate neta: 200G Stare termica: Refrigerate Ingrediente: carne de porc (77%),carne de vita(20%),apa,slanina,sare, corector de aciditate (glucono-delta-lactona),dextroza, sirop de glucoza,zahar,aroma naturala,extracte de condimente,stabilizatori (trifosfati),proteina din lapte,antioxidant (ascorbat de sodiu), colorant (carmina),conservant (nitrit de sodiu). Alergeni: Contine soia; Poate contine urme de: lactoza, mustar. Valori nutritionale: Valoare energetica: 1982 KJ / 479 Kcal; Grasimi: 43 g, din care acizi grasi saturati: 15 g; Glucide: 5 g, din care zaharuri: 2 g; Proteine: 18 g; Sare: 4 g. Termen de valabilitate: A se consuma de preferinta inainte de: vezi data scrisa pe ambalaj. Conditii de depozitare: temperatura minima (+ 2)°C ; temperatura maxima (+ 14)° C; umiditatea relativa max.75%. Tara de origine: RomaniaTara de origine a ingredientelor principale: Romania',
            'https://glovo.dhmedia.io/image/global-catalog-glovo/nv-global-catalog/xe/33e14a1f-5d6e-426a-ae79-38cecf6839ae.jpg?t=W3sid2VicCI6e319XQ=='
        ),
        (
            @shop_id,
            N'Cascaval Rucar 300g Carrefour',
            12.85,
            N'Cascaval Rucar 300g Carrefour Cantitate neta: 300g Stare termica: Refrigerate Ingrediente: Lapte pasteurizat, culturi lactice selectionate Alergeni: Lapte Valori nutritionale: Valoare energetica medie/100g: Energie: 1319kJ/317kcal; grasimi: 24g, din care acizi grasi saturati: 15g; glucide: 1.3g, din care zaharuri: 0.5g, proteine: 24g; sare: 1.4g Termen de valabilitate: A se consuma de preferinta inainte de: vezi data scrisa pe ambalaj. Conditii de depozitare: A se depozita la temperatura intre 2-8°C. Tara de origine: RomaniaTara de origine a ingredientelor principale: Romania',
            'https://glovo.dhmedia.io/image/global-catalog-glovo/nv-global-catalog/xe/7416dd58-93a2-4465-952e-2e68ec6ae479.jpg?t=W3sid2VicCI6e319XQ=='
        ),
        (
            @shop_id,
            N'Malai Baneasa',
            3.75,
            N'Malai Baneasa Cantitate neta: 1 kg Ingrediente: faina de porumb. Alergeni: nu se aplica. Valori nutritionale: Valoare energetica: 350 kcl / 1487 kj, Grasimi 1g din care acizi grasi saturati 0g, Glucide 78 g, Fibre 0, 6 g, Proteine 7 g, Sare 0, 002g. Termen de valabilitate: A se consuma inainte de data inscriptionata pe ambalaj. Conditii de depozitare: A se pastra in spatii uscate, curate si bine aerisite, ferite de razele solare, la temperatura de maxim 25 grade Celsius. Tara de origine: Romania',
            'https://glovo.dhmedia.io/image/global-catalog-glovo/nv-global-catalog/xe/bd9da63a-01b3-4d6f-ab0f-704ac581573a.jpg?t=W3sid2VicCI6e319XQ=='
        ),
        (
            @shop_id,
            N'Castraveti picanti in otet 680g Drag de Romania',
            9.75,
            N'Castraveti picanti in otet 680g Drag de Romania Cantitate neta: 680g Ingrediente: castraveti proaspeti intregi (origine Romania), apa, otet din zaharuri 10%, zahar, ardei iute, morcov, ceapa, sare, condimentemarar, coriandru, boabe de mustar, foi de dafin, corector de aciditateacid acetic, Alergeni: Contine boabe de mustar. Valori nutritionale: Valoare energetica 140kJ/33kcal, Grasimi <0.5g din care acizi grasi saturati <0.1g, Glucide 5.5g din care zaharuri 3.0g, Fibre 1.2g, Proteine 1.1g, Sare 1.7g. Termen de valabilitate: A se consuma inainte de data inscriptionata pe ambalaj. Conditii de depozitare: A se pastra la loc uscat si racoros. Tara de origine: Romania',
            'https://glovo.dhmedia.io/image/global-catalog-glovo/nv-global-catalog/xe/e965a58b-f1e5-4068-b238-b4a7548a11ea.jpg?t=W3sid2VicCI6e319XQ=='
        ),
        (
            @shop_id,
            N'Slanina Afumata Cu Boia 300G',
            18.49,
            N'Slanina Afumata Cu Boia 300G Cantitate neta: 300G Stare termica: Refrigerate Ingrediente: Slanina, Sare, Boia, Apa, Conservant: nitrit de sodiu. Alergeni: Poate contine urme de soia, gluten, susan, lactoza si mustar! Valori nutritionale: 768 kcal, 3164 kjouli, lipide 80g, din care acizi grasi saturati 43g; glucide 0g, din care zaharuri 0g; proteine 12g, sare 2.5g, fibre 0g. Termen de valabilitate: A se consuma de preferinta inainte de: a se vedea pe spatele ambalaj. Conditii de depozitare: temperatura de +5-+10ºC, umiditate 75-80%. Tara de origine: RomaniaTara de origine a ingredientelor principale: Romania',
            'https://glovo.dhmedia.io/image/global-catalog-glovo/nv-global-catalog/xe/7630ce98-777c-43a2-9074-dbb77690d0e7.jpg?t=W3sid2VicCI6e319XQ=='
        ),
        (
            @shop_id,
            N'Crenvursti 500G',
            15.39,
            N'Crenvursti 500G Cantitate neta: 500G Stare termica: Refrigerate Ingrediente: carne, apa, slanina din UE, sare, proteina din lapte, zaharuri (contine lactoza), stabilizatori (difosfati), conservanti (acetati de sodiu, nitrit de sodiu), fibre vegetale, arome naturale, condimente, antioxidant (eritorbat de sodiu, ascorbat de sodiu), colorant (carmine). Alergeni: Contine PROTEINA VEGETALA DIN SOIA. Poate contine urme de mustar, telina, lapte, lactoza. Valori nutritionale: Pentru 100g produs Valoare energetica 1091 kJ/ 263kcal Grasimi 23g -din care acizi grasi saturati 8,4g Glucide 1,1g -din care zaharuri 0g Proteine 13g Sare 2,4g Termen de valabilitate: A se consuma de preferinta inainte de: vezi data scrisa pe ambalaj. Conditii de depozitare: Temperatura de depozitare 2-8°C Atentionari speciale: Produs in membrana comestibila, ambalat in atmosfera protectoare; A se consuma in maximum 48 ore de la deschiderea ambalajului.',
            'https://glovo.dhmedia.io/image/global-catalog-glovo/nv-global-catalog/xe/479c6f23-cf00-464a-a9c1-3459e7af034d.jpg?t=W3sid2VicCI6e319XQ=='
        );
    END;


    -- Starbucks
    SET @shop_id = NULL;
    SELECT @shop_id = s.id 
    FROM shops s
    JOIN users u ON s.user_id = u.id
    WHERE u.email = 'starbucks.iulius@shop.ro';

    IF @shop_id IS NOT NULL
    BEGIN

        INSERT INTO products(shop_id, name, price, description, photo_path)
        VALUES
        (
            @shop_id,
            N'Iced Protein Matcha Latte',
            31.90,
            N'Iced Protein Matcha Latte: gheață; băutură proteică pe bază de soia (apă, boabe de soia decojite (13,1%), zahăr, regulatori de aciditate (fosfați de potasiu), calciu, aromă, sare de mare, stabilizator (gumă gellan), vitamine (B2, B12, D2); Ceai verde matcha. Valoare energetică (KJ) 572 valoare energetică (kcal) 137, Grăsimi 6 g, din care saturate 1.2 g, carbohidrați 6 g, din care zahăr 6 g, fibre 3.33 g, proteine 12.1 g, sare 0.23 g, cofeina 86 mg',
            'https://glovo.dhmedia.io/image/menus-glovo/products/b7b5fd06e27d05a2ce154e57f254765f13af5eae4da525c1afe86778f0e2a556?t=W3sid2VicCI6e319XQ=='
        ),
        (
            @shop_id,
            N'STRAWBERRY MATCHA CLOUD FRAPPUCCINO',
            30.90,
            N'Un amestec vibrant de matcha, sirop cu aromă de vanilie, lapte și gheață, stratificat cu un cold foam cremos cu aromă de căpșuni. Valoarea energetică (kj) 1323, Valoare energetică (kcal) 316, Grăsimi (g) 14.7 din care acizi grași saturați (g) 9.2, Glucide (g) 39.4, din care zaharuri (g) 37.7, Fibre (g) 1.1, Proteine (g) 6, Sare (g) 0.49, Cofeină (mg) 61.9',
            'https://glovo.dhmedia.io/image/menus-glovo/products/5966068fd3f7cde0e77f7133468556f354122bcdd52cfb1536904cee2781d533?t=W3sid2VicCI6e319XQ=='
        ),
        (
            @shop_id,
            N'CARAMEL MOCHA CLOUD FRAPPUCCINO',
            30.90,
            N'Un amestec de mocha și caramel, preparat cu sos mocha, cafea Frappuccino® Roast, lapte și gheață. Finalizat cu cold foam cremos cu aromă de caramel și un swirl de caramel. Valoare energetică (KJ) 1693, valoare energetică (kcal) 404, grăsimi 20.1 g, din care saturate 12.5 g, carbohidrați 49.1 g, din care zahăr 46.7 g, fibre 1.2 g, proteine 6 g, sare 0.53 g, cofeină 34 mg',
            'https://glovo.dhmedia.io/image/menus-glovo/products/ca7a3f2182c7b055ffb9bce0f34b75855fd3c55619af33f92a837fef24613ad3?t=W3sid2VicCI6e319XQ=='
        ),
        (
            @shop_id,
            N'ICED CARAMELISED BANANA FLAVOUR LATTE',
            29.90,
            N'Sosul cu aromă de banană caramelizată este combinat cu cafea Signature Roast, lapte și gheață, apoi completat cu cold foam din lapte cu aromă de banană caramelizată. Valoare energetică (KJ) 991, valoare energetică (kcal) 235, grăsimi 6 g, din care saturate 4.2 g, carbohidrați 34.2 g, din care zahăr 33 g, fibre 0.3 g, proteine 11.1 g, sare 0.53 g, cofeină 89.1 mg',
            'https://glovo.dhmedia.io/image/menus-glovo/products/9b1ab8a510161048bdd0644f72860ba25c3e26c2ebf808339bf9915e9bb3def9?t=W3sid2VicCI6e319XQ=='
        ),
        (
            @shop_id,
            N'Iced Caramelised Banana Oat Shaken Espresso',
            29.90,
            N'Cafea Signature Roast, fină, combinată cu sos cu aromă de banană caramelizată și gheață, apoi completată cu un strop de băutură pe bază de ovăz. Valoare energetică (KJ) 713, valoare energetică (kcal) 169, grăsimi 4.3 g, din care saturate 3.1 g, carbohidrați 25.6 g, din care zahăr 24.1 g, fibre 0.4 g, proteine 6.7 g, sare 0.36 g, cofeină 133.6 mg',
            'https://glovo.dhmedia.io/image/menus-glovo/products/9afd7a6a7bbf924b27b5e50dd79b5dcddb82420de0d7483cd4d00b8f9090ce00?t=W3sid2VicCI6e319XQ=='
        ),
        (
            @shop_id,
            N'White Chocolate Mocha',
            24.90,
            N'Espresso cu sirop cu aromă de ciocolată albă și lapte fierbinte. lapte semi-degresat [LAPTE semi-degresat], ciocolată albă moka [zahăr, apă, LAPTE praf degresat, ulei de cocos, unt de cacao, sare, emulgator (mono și digliceride ale acizilor grași), stabilizator [gumă guar, caragenan], conservant ( sorbat de potasiu), aromă naturală], prăjire espresso (așa cum este consumată) [cafea prăjită cu boabe întregi], prăjire espresso (așa cum este consumată) [cafea prăjită cu boabe întregi], frișcă cu conținut scăzut de grăsimi [smântână 34% (LAPTE), zahăr (6%) ), , gaz propulsor: protoxid de azot, gaz propulsor: azot, emulgator: mono și digliceride ale acizilor grași, aromă naturală de vanilie, stabilizator: caragenan.]Energie (kJ):1448Energie (kcal):345Grăsimi (g):12,7Of care saturați (g): 10,5 Carbohidrați (g): 46,2 Din care zahăr (g): 45,4 Fibre (g): 0,3 Proteine (g): 11,3 Sare (g): 0,5 Cofeină (mg): 89,1',
            'https://glovo.dhmedia.io/image/menus-glovo/products/a39a407199464a87c814aaba6339ee60ecaba69641d676ec15eac5b8b133f207?t=W3sid2VicCI6e319XQ=='
        ),
        (
            @shop_id,
            N'Iced White Chocolate Mocha',
            24.90,
            N'Espresso accentuat cu sirop de aromă de ciocolată albă, lapte și cuburi de gheață peste care adăugăm frișcă.lapte semi-degresat [LAPTE semi-degresat], gheață, ciocolată albă moka [zahăr, apă, LAPTE praf degresat, ulei de cocos, unt de cacao, sare, emulgator (mono și digliceride ale acizilor grași), stabilizator [gumă guar, caragenan], conservant (sorbat de potasiu), aromă naturală], prăjire espresso (așa cum este consumat) [cafea prăjită cu boabe întregi], prăjire espresso (așa cum este consumată) [cafea prăjită cu boabe întregi], frișcă redusă în grăsimi [smântână 34% (LAPTE), zahăr ( 6%), , gaz propulsor: protoxid de azot, gaz propulsor: azot, emulgator: mono și digliceride ale acizilor grași, aromă naturală de vanilie, stabilizator: caragenan.]Energie (kJ):1680Energie (kcal):401Grăsimi (g): 19,1 Din care saturate (g): 14,9 Carbohidrați (g): 46,5 Din care zahăr (g): 45,7 Fibre (g): 0,3 Proteine (g): 10,6 Sare (g): 0,48 Cofeină (mg): 89,1',
            'https://glovo.dhmedia.io/image/menus-glovo/products/e014749808b929028d708779af75e36ceecf284b2eaf99210a6652049244badd?t=W3sid2VicCI6e319XQ=='
        ),
        (
            @shop_id,
            N'Aerocano',
            10.90,
            N'Shoturi de espresso Starbucks® Blonde Roast amestecate cu gheață, rezultând o băutură în stil Americano, cu o textură cremoasă și fină. Valoare energetică (kJ) 38, Valoare energetică (kcal) 9, Grăsimi (g) 0,2, din care acizi grași saturați (g) 0, Carbohidrați (g) 1,2, din care zaharuri (g) 0,2, Fibre (g) 0,5, Proteine (g) 0,5, Sare (g) 0,0, Cofeină (mg) 128,25',
            'https://glovo.dhmedia.io/image/menus-glovo/products/b57ea2ab180a88925d231c63734ff72d96bed9090992b57206787991226ae19f?t=W3sid2VicCI6e319XQ=='
        ),
        (
            @shop_id,
            N'Cold Brew Latte',
            21.90,
            N'Cafeaua noastră Cold Brew este preparată cu grijă, infuzată timp de 20 de ore în apă rece, pentru o aromă catifelată; cu lapte.lapte semi-degresat [LAPTE semi-degresat], concentrat preparat la rece [cafea arabică], concentrat preparat la rece [cafea arabică], gheațăEnergie (kJ):520Energie (kcal):123Grăsimi (g):4,3Din care saturate (g):4,1Carbohidrați (g):12Din care zahăr(g):11,1Fibre(g):0,6Proteine(g):8,9Sare(g):0,26Cofeină(mg):166,5',
            'https://glovo.dhmedia.io/image/menus-glovo/products/d755058666d07d82208e79ac98c54ee3d2da3f8f7e7e9cde82eabe7fa3300eec?t=W3sid2VicCI6e319XQ=='
        ),
        (
            @shop_id,
            N'Pink Coconut Starbucks Refresha®',
            27.90,
            N'Pink Coconut Starbucks Refresha® combină arome dulci de căpșuni și alternativa noastră cremoasă de cocos. O băutură fructată și răcoritoare.gheață, băutură de nucă de cocos [Apă, lapte de cocos (10%), zahăr, dextrină de porumb, făină de fasole, stabilizatori: gumă gellan, gumă xantan, regulator de aciditate: carbonat acid de sodiu, aromă naturală.], bază de băuturi cu aromă de căpșuni și acai [ Apă, zahăr, concentrat de suc de struguri, extract de cafea verde, acid: acid citric, colorant concentrat din morcov, antioxidant: acid ascorbic, aromă naturală, conservant: sorbat de potasiu, colorant: beta-caroten din blakeslea trispora.], felii de căpșuni liofilizate. [felii de căpșuni (uscate prin congelare)]Energie (kJ):606Energie (kcal):144Grăsimi (g):3,4Din care saturate (g):3Carbohidrați (g):25,2Din care zahăr(g):25Fibre(g):2,4 Proteine (g): 1,7 Sare (g): 0,07 Cofeină (mg): 11,1',
            'https://glovo.dhmedia.io/image/menus-glovo/products/657d81b4633f8686d734cf3e55ba589ad3a193ca746d63fdc2e8421d2a0e02f6?t=W3sid2VicCI6e319XQ=='
        );
    END;


    -- Meron
    SET @shop_id = NULL;
    SELECT @shop_id = s.id 
    FROM shops s
    JOIN users u ON s.user_id = u.id
    WHERE u.email = 'meron.roastery@shop.ro';

    IF @shop_id IS NOT NULL
    BEGIN

        INSERT INTO products(shop_id, name, price, description, photo_path)
        VALUES
        (
            @shop_id,
            N'Classic Brew',
            25.00,
            N'Gramaj: 200ml
            Ingrediente:
            Cafea, apa. Contine cafeina
            Valori Nutritionale medii per 100g:	
            Valoare Energetica - kJ/kcal	4/1
            Grasimi - g	0
            - din care Acizi Grasi Saturati - g	0
            Glucide - g	0
            - din care Zaharuri - g	0
            Proteine - g	0.1
            Sare - g	0',
            'https://images.bolt.eu/store/2025/2025-08-28/b6fdf7a9-75ed-4926-a262-89a46b2a542a.jpeg'
        ),
        (
            @shop_id,
            N'Exceptional Brew',
            38.00,
            N'Gramaj: 200ml
            Ingrediente:
            Cafea, apa. Contine cafeina
            Valori Nutritionale medii per 100g:	
            Valoare Energetica - kJ/kcal	4/1
            Grasimi - g	0
            - din care Acizi Grasi Saturati - g	0
            Glucide - g	0
            - din care Zaharuri - g	0
            Proteine - g	0.1
            Sare - g	0',
            'https://images.bolt.eu/store/2025/2025-08-28/b62d206d-7344-4788-b7aa-384445122856.jpeg'
        ),
        (
            @shop_id,
            N'Single Shot White',
            24.00,
            N'Gramaj: 250ml
            Ingrediente:
            Lapte de vaca integral pasteurizat (contine lactoza): 230ml, cafea, apa. Contine cafeina
            Alergeni: 7
            Valori Nutritionale medii per 100g:	
            Valoare Energetica - kJ/kcal	244.7/58.4
            Grasimi - g	3.2
            - din care Acizi Grasi Saturati - g	1.8
            Glucide - g	4.1
            - din care Zaharuri - g	4.1
            Proteine - g	3
            Sare - g	0.1',
            'https://images.bolt.eu/store/2025/2025-08-26/4c5435e8-dc53-432b-9f42-9cb2ecb4a608.jpeg'
        ),
        (
            @shop_id,
            N'Double Shot White',
            25.00,
            N'Gramaj: 250ml
            Ingrediente:
            Lapte de vaca integral pasteurizat (contine lactoza): 210ml, cafea, apa. Contine cafeina
            Alergeni: 7
            Valori Nutritionale medii per 100g:	
            Valoare Energetica - kJ/kcal	223.4/53.3
            Grasimi - g	2.9
            - din care Acizi Grasi Saturati - g	1.7
            Glucide - g	3.8
            - din care Zaharuri - g	3.8
            Proteine - g	2.8
            Sare - g	0.1',
            'https://images.bolt.eu/store/2025/2025-08-26/ae1114b7-3aa2-48b0-93dc-f0b6696a839c.jpeg'
        ),
        (
            @shop_id,
            N'Iced Cappuccino',
            23.00,
            N'Gramaj: 280ml
            Ingrediente:
            Lapte de vaca integral pasteurizat (contine lactoza): 180ml, cafea, apa, gheata. Contine cafeina
            Alergeni: 7
            Valori Nutritionale medii per 100g:	
            Valoare Energetica - kJ/kcal	239.4/57.2
            Grasimi - g	3.2
            - din care Acizi Grasi Saturati - g	1.8
            Glucide - g	4.1
            - din care Zaharuri - g	4.1
            Proteine - g	3
            Sare - g	0.1',
            'https://images.bolt.eu/store/2025/2025-08-28/68a9c713-86f8-4d2a-b699-8c75f84c1e85.jpeg'
        ),
        (
            @shop_id,
            N'Cold Brew',
            27.00,
            N'Gramaj: 200ml
            Ingrediente:
            Cafea, apa, gheata. Contine cafeina
            Valori Nutritionale medii per 100g:	
            Valoare Energetica - kJ/kcal	4/1
            Grasimi - g	0
            - din care Acizi Grasi Saturati - g	0
            Glucide - g	0
            - din care Zaharuri - g	0
            Proteine - g	0.1
            Sare - g	0',
            'https://images.bolt.eu/store/2025/2025-08-28/6f75d6f9-0949-4935-886d-588b00183a2f.jpeg'
        ),
        (
            @shop_id,
            N'Cold Brew Latte',
            28.00,
            N'Gramaj: 400ml
            Ingrediente:
            Lapte de vaca integral pasteurizat (contine lactoza): 300ml, cafea, apa, gheata. Contine cafeina
            Alergeni: 7
            Valori Nutritionale medii per 100g:	
            Valoare Energetica - kJ/kcal	192/46
            Grasimi - g	2.5
            - din care Acizi Grasi Saturati - g	1.4
            Glucide - g	3.3
            - din care Zaharuri - g	3.3
            Proteine - g	2.4
            Sare - g	0',
            'https://images.bolt.eu/store/2025/2025-08-28/dcf15189-7ec4-49c5-ad67-bcff439374c2.jpeg'
        ),
        (
            @shop_id,
            N'Cold Brew Tonic',
            30.00,
            N'Gramaj: 400ml
            Ingrediente:
            Apa Tonica (apa, zahar, dioxid de carbon, acidifiant: acid citric (E330), 0.1% infuzie de citrice siciliene, extract din scoarta de arbore de cinchona 0.1%, arome naturale): 200ml, cafea, gheata. Contine cafeina.
            Valori Nutritionale medii per 100g:	
            Valoare Energetica - kJ/kcal	150/35
            Grasimi - g	0
            - din care Acizi Grasi Saturati - g	0
            Glucide - g	8.3
            - din care Zaharuri - g	8.3
            Proteine - g	0.1
            Sare - g	0',
            'https://images.bolt.eu/store/2025/2025-08-28/fb53cabf-f585-4be7-a210-7bcd2476e1ec.jpeg'
        ),
        (
            @shop_id,
            N'Oatly - Lapte de Ovaz',
            22.00,
            N'1l',
            'https://images.bolt.eu/store/2025/2025-09-01/82f824a7-9cc6-4c59-b668-8663e51ca3e8.png'
        ),
        (
            @shop_id,
            N'Sproud - Lapte de Mazare',
            24.00,
            N'1l',
            'https://images.bolt.eu/store/2025/2025-09-01/ecb776c9-6e2e-4620-a103-67b788b7982a.jpeg'
        );
    END;
END;