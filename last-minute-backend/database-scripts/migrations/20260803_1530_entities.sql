IF OBJECT_ID('users') IS NOT NULL 
AND OBJECT_ID('persons') IS NOT NULL 
AND OBJECT_ID('shops') IS NOT NULL
AND OBJECT_ID('categories') IS NOT NULL
BEGIN
    -- Conturi Maria
    DECLARE @user_id INT;


    -- Cont Maria 1
    SET @user_id = NULL;
    SELECT @user_id = id FROM users WHERE email = 'maria.pop@gmail.com';
    IF @user_id IS NULL
    BEGIN
        INSERT INTO users(email, password, role) VALUES ('maria.pop@gmail.com', 'parola', 1);
        SET @user_id = SCOPE_IDENTITY();
        INSERT INTO persons(user_id, first_name, last_name) VALUES (@user_id, 'Maria', 'Pop');
    END;

    -- Cont Maria 2
    SET @user_id = NULL;
    SELECT @user_id = id FROM users WHERE email = 'alex.marian@gmail.com';
    IF @user_id IS NULL
    BEGIN
        INSERT INTO users(email, password, role) VALUES ('alex.marian@gmail.com', 'parola', 1);
        SET @user_id = SCOPE_IDENTITY();
        INSERT INTO persons(user_id, first_name, last_name) VALUES (@user_id, 'Alex', 'Marian');
    END;

    -- Conturi BigBelly

    -- BigBelly (Fast-Food)
    SET @user_id = NULL;
    SELECT @user_id = id FROM users WHERE email = 'bigbelly.manastur@shop.ro';
    IF @user_id IS NULL
    BEGIN
        INSERT INTO users(email, password, role) VALUES ('bigbelly.manastur@shop.ro', 'parola', 2);
        SET @user_id = SCOPE_IDENTITY();
        INSERT INTO shops(name, address, user_id, logo_path, banner_path, details, category_id, coordinates)
        VALUES (
            'Big Belly Manastur',
            'Calea Manastur 68, Cluj-Napoca',
            @user_id,
            'https://www.bigbelly-cluj.ro/file/zone/363-363.png',
            'https://imageproxy.wolt.com/assets/6a1001268cbf13ed0c107b7a',
            N'Mancarea este mai mult decat un preparat, este despre gusturi, stari, pofte si momente de bucurie',
            2,
            geography::Point(46.7612472, 23.5651834, 4326)
        );
    END;


 
    -- KFC Centru (Fast-Food)
    SET @user_id = NULL;
    SELECT @user_id = id FROM users WHERE email = 'kfc.centru@shop.ro';
    IF @user_id IS NULL
    BEGIN
        INSERT INTO users(email, password, role) VALUES ('kfc.centru@shop.ro', 'parola', 2);
        SET @user_id = SCOPE_IDENTITY();
        INSERT INTO shops(name, address, user_id, logo_path, banner_path, details, category_id, coordinates)
        VALUES (
            'KFC Cluj Centru',
            'Strada Iuliu Maniu 1, Cluj-Napoca',
            @user_id,
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbNHwgpV1P0f_-f_-XGzpGxp0D6kMqiCIyqHaTjioBMg&s=10',
            'https://dil-rjcorp.com/wp-content/uploads/2021/05/kfc-banner.webp',
            N'Puiul pe care îl gătim astăzi urmează întru totul rețeta secretă a Colonelului. Poate de asta puiul de la KFC e îndrăgit de atât de multe generații.',
            2,
            geography::Point(46.7702351, 23.5905329, 4326)
        );
    END;

    -- McDonald's Piata Mihai Viteazul (Fast-Food)
    SET @user_id = NULL;
    SELECT @user_id = id FROM users WHERE email = 'mcdonalds.mihaiviteazul@shop.ro';
    IF @user_id IS NULL
    BEGIN
        INSERT INTO users(email, password, role) VALUES ('mcdonalds.mihaiviteazul@shop.ro', 'parola', 2);
        SET @user_id = SCOPE_IDENTITY();
        INSERT INTO shops(name, address, user_id, logo_path, banner_path, details, category_id, coordinates)
        VALUES (
            'McDonald''s Piata Mihai Viteazu',
            'Piata Mihai Viteazu 1, Cluj-Napoca',
            @user_id,
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREoOC9GYrg42oSN59bKnPeSY9TcVybRPdr4qMFwOrW0g&s=10',
            'https://tb-static.uber.com/prod/image-proc/processed_images/ff6c08b6abced02451fb79b888dddc39/5e48b5818af0117f322d7c4ae77977a8.jpeg',
            N'Misiunea noastră, la McDonald’s®, este să fim mereu restaurantul preferat al clienților noștri și să îi întâmpinăm cu produse proaspete, pregătite la fiecare comandă din ingrediente de cea mai bună calitate.',
            2,
            geography::Point(46.7742218, 23.593088, 4326)
        );
    END;

    -- MEATinc. Cluj-Napoca (Restaurant)
    SET @user_id = NULL;
    SELECT @user_id = id FROM users WHERE email = 'meatinc@shop.ro';
    IF @user_id IS NULL
    BEGIN
        INSERT INTO users(email, password, role) VALUES ('meatinc@shop.ro', 'parola', 2);
        SET @user_id = SCOPE_IDENTITY();
        INSERT INTO shops(name, address, user_id, logo_path, banner_path, details, category_id, coordinates)
        VALUES (
            'MEATinc. Cluj-Napoca',
            'Strada Alexandru Vaida Voevod 43, 400592 Cluj-Napoca',
            @user_id,
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfaO5g9YZmMGZRXP4HvIxNi9AMQA5s74VMj8NPoQRxE429K-OniUB28-Q&s=10',
            'https://images.bolt.eu/store/2025/2025-04-03/5387d599-340b-468c-b937-8afec9e5e2c1.png',
            N'Îți promitem că acele căutări culinare rămase fără răspuns până acum își vor găsi împlinirea la MEATinc.',
            1,
            geography::Point(46.77545, 23.62058, 4326)
        );
    END;

    -- Marty Restaurants (Restaurant)
    SET @user_id = NULL;
    SELECT @user_id = id FROM users WHERE email = 'marty.delivery@shop.ro';
    IF @user_id IS NULL
    BEGIN
        INSERT INTO users(email, password, role) VALUES ('marty.delivery@shop.ro', 'parola', 2);
        SET @user_id = SCOPE_IDENTITY();
        INSERT INTO shops(name, address, user_id, logo_path, banner_path, details, category_id, coordinates)
        VALUES (
            'Marty Delivery',
            'Piata 1 Mai 4-5, 400141 Cluj-Napoca',
            @user_id,
            'https://www.platiniashopping.ro/wp-content/uploads/marty.png',
            'https://martyrestaurants.ro/wp-content/uploads/2023/07/Marty-IntroBackground-min.png',
            N'Pe ideea diversității în unitate se construiește nucleul Marty, nucleu în care sunt aduse laolaltă gusturi din întreaga lume, în combinații bogate și inedite.',
            1,
            geography::Point(46.78672, 23.60782, 4326)
        );
    END;

    -- Panemar (Bakery)
    SET @user_id = NULL;
    SELECT @user_id = id FROM users WHERE email = 'panemar.memo@shop.ro';
    IF @user_id IS NULL
    BEGIN
        INSERT INTO users(email, password, role) VALUES ('panemar.memo@shop.ro', 'parola', 2);
        SET @user_id = SCOPE_IDENTITY();
        INSERT INTO shops(name, address, user_id, logo_path, banner_path, details, category_id, coordinates)
        VALUES (
            'Panemar Memorandumului',
            'Strada Memorandumului 18, Cluj-Napoca',
            @user_id,
            'https://panemar.ro/wp-content/uploads/2024/05/logo-Panemar.png',
            'https://images.squarespace-cdn.com/content/v1/5940e0ca893fc04fe54f9bf1/1497795225363-1W1JZCHG6XGU2DQ2F542/13122855_1098533243547436_6640830806629298318_o.jpg?format=1500w',
            N'Ia o pauză proaspătă și delicioasă.',
            4,
            geography::Point(46.7700395, 23.5874565, 4326)
        );
    END;

    -- Lidl (Supermarket)
    SET @user_id = NULL;
    SELECT @user_id = id FROM users WHERE email = 'lidl.marasti@shop.ro';
    IF @user_id IS NULL
    BEGIN
        INSERT INTO users(email, password, role) VALUES ('lidl.marasti@shop.ro', 'parola', 2);
        SET @user_id = SCOPE_IDENTITY();
        INSERT INTO shops(name, address, user_id, logo_path, banner_path, details, category_id, coordinates)
        VALUES (
            'Lidl Marasti',
            'Bulevardul 21 Decembrie 1989 95-97, 400604 Cluj-Napoca',
            @user_id,
            'https://corporate.lidl.ro/bundles/nucleuscomponent/corporate/assets/@lidl/a-logo-image/logo_default.55fa35599267bb36eb58dd8930b445f8.svg',
            'https://corporate-cms.object.storage.eu01.onstackit.cloud/corporate/images/_aliases/corporate_3840x960/5/6/2/8/88265-7-rum-RO/f80c5f0cf9d6-3840x960_Hero_Unternehmen_v4.jpg',
            N'Misiunea noastră este a le oferi zilnic românilor produse de cea mai bună calitate la cel mai bun preţ, direct de la producători, într-o largă varietate de sortimente, în zone din imediata lor vecinătate.',
            5,
            geography::Point(46.777479, 23.6081799, 4326)
        );
    END;

    -- Carrefour (Supermarket)
    SET @user_id = NULL;
    SELECT @user_id = id FROM users WHERE email = 'carrefour.express@shop.ro';
    IF @user_id IS NULL
    BEGIN
        INSERT INTO users(email, password, role) VALUES ('carrefour.express@shop.ro', 'parola', 2);
        SET @user_id = SCOPE_IDENTITY();
        INSERT INTO shops(name, address, user_id, logo_path, banner_path, details, category_id, coordinates)
        VALUES (
            'Carrefour Express Cluj Fabricii ',
            'Strada Fabricii 3, Cluj-Napoca',
            @user_id,
            'https://cdn-static.carrefour.ro/unified/assets/images/dist/logo/default/carrefour.png',
            'https://business.co.ke/wp-content/uploads/2026/06/Web-banner-carrefour-600.jpg',
            N'Nu doar preturile mici ne definesc. Ne dorim sa raspundem cat mai bine schimbarii situatiei economice mondiale si locale, astfel incat clientii nostri sa beneficieze in continuare de calitate si diversitate la cele mai mici preturi.',
            5,
            geography::Point(46.7806455, 23.6135647, 4326)

        );
    END;

    -- Starbucks (Confectionery)
    SET @user_id = NULL;
    SELECT @user_id = id FROM users WHERE email = 'starbucks.iulius@shop.ro';
    IF @user_id IS NULL
    BEGIN
        INSERT INTO users(email, password, role) VALUES ('starbucks.iulius@shop.ro', 'parola', 2);
        SET @user_id = SCOPE_IDENTITY();
        INSERT INTO shops(name, address, user_id, logo_path, banner_path, details, category_id, coordinates)
        VALUES (
            'Starbucks Iulius Mall Cluj',
            'Strada Alexandru Vaida Voevod 53-55, Cluj-Napoca',
            @user_id,
            'https://www.starbucks.ro/assets/app/icons/apple-icon.png',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTICjez2AKCF3M9iV43RpT6aOxEGErHlqySf77_DNqJX-coSvHicvFp2EEZ&s=10',
            N'Spune bun venit comenzilor simple, opțiunilor nelimitate și - da, cafelei gratuite.',
            3,
            geography::Point(46.77166, 23.62573, 4326)
        );
    END;

    -- Meron Coffee (Confectionery)
    SET @user_id = NULL;
    SELECT @user_id = id FROM users WHERE email = 'meron.roastery@shop.ro';
    IF @user_id IS NULL
    BEGIN
        INSERT INTO users(email, password, role) VALUES ('meron.roastery@shop.ro', 'parola', 2);
        SET @user_id = SCOPE_IDENTITY();
        INSERT INTO shops(name, address, user_id, logo_path, banner_path, details, category_id, coordinates)
        VALUES (
            'Meron Roastery',
            'Strada Horea 5, Cluj-Napoca',
            @user_id,
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXimeUaUsELJgx_HwA3FcWGVBwSkTbh7NUOtCTSr50uw&s',
            'https://www.meron.coffee/wp-content/uploads/2020/08/Meron-Faces-1.jpg',
            N'DESCOPERĂ EXPERIENȚA COMPLETĂ A CAFELEI DE SPECIALITATE.',
            3,
            geography::Point(46.7748075, 23.5868892, 4326)
        );
    END;
END;