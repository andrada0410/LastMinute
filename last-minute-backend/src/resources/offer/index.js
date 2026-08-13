const { sqlRequest } = require("../../db");
const config = require('../../../config.json')

async function validateOffer(offerData) {
    if (offerData.hoursAvailable === undefined || offerData.hoursAvailable <= 0) {
        throw new Error("Numărul de ore disponibile trebuie să fie mai mare decât 0!");
    }

    if (!Array.isArray(offerData.products) || offerData.products.length === 0) {
        throw new Error("Oferta trebuie să conțină cel puțin un produs!");
    }

    for (const p of offerData.products) {
        if (!p.productId) {
            throw new Error("Fiecare produs din ofertă trebuie să aibă un id valid!");
        }

        if (p.quantity === undefined || p.quantity <= 0) {
            throw new Error("Cantitatea trebuie să fie mai mare decât 0!");
        }

        if (p.discountPercent === undefined || p.discountPercent < 0 || p.discountPercent > 100) {
            throw new Error("Discount-ul trebuie să fie între 0 și 100!");
        }
    }
}

module.exports = {
    getOfferByShop: async (shopId, startDate, endDate, include) => {
        if (include !== "Offer.products") {
            throw new Error("Parametrul include trebuie sa fie 'Offer.products'.");
        }

        const offerResult = await sqlRequest()
            .input("shopId", shopId)
            .input("startDate", startDate)
            .input("endDate", endDate)
            .query(`
            SELECT TOP 1
                id,
                shop_id AS shopId,
                start_date AS startDate,
                hours_available AS hoursAvailable,
                end_date AS endDate
            FROM offers
            WHERE shop_id = @shopId AND
                start_date <= @endDate AND end_date >= @startDate
                AND is_deleted = 0
            ORDER BY start_date DESC
            `);

        if (offerResult.recordset.length === 0) {
            return { entry: [] };
        }

        const offer = offerResult.recordset[0];

        const productsResult = await sqlRequest()
            .input("offerId", offer.id)
            .query(`
            SELECT
                p.id,
                p.shop_id AS shopId,
                p.name,
                p.price,
                p.description,
                p.photo_path AS photoPath,
                op.quantity,
                (p.price * (100 - op.discount_percent) / 100.0) AS offerPrice
            FROM offers_products op
            JOIN products p ON p.id = op.product_id
            WHERE op.offer_id = @offerId
                AND p.is_deleted = 0
            `);

        const entry = [
            {
                resourceType: "Offer",
                id: offer.id,
                shopId: offer.shopId,
                startDate: offer.startDate,
                endDate: offer.endDate,
                hoursAvailable: offer.hoursAvailable
            },
            ...productsResult.recordset.map(product => ({
                resourceType: "Product",
                id: product.id,
                shopId: product.shopId,
                name: product.name,
                price: Number(product.price),
                description: product.description,
                photoPath: product.photoPath,
                quantity: product.quantity,
                offerPrice: Number(product.offerPrice)
            }))
        ];

        return { entry };
    },

    createOffer: async (shopId, startDate, hoursAvailable, products) => {
        const start = new Date(startDate);
        const end = new Date(start.getTime() + hoursAvailable * 60 * 60 * 1000);

        const isSameDay =
            end.getFullYear() === start.getFullYear() &&
            end.getMonth() === start.getMonth() &&
            end.getDate() === start.getDate();

        const isMidnightBoundary =
            end.getHours() === 0 && end.getMinutes() === 0 && end.getSeconds() === 0 &&
            end.getDate() !== start.getDate();

        if (!isSameDay && !isMidnightBoundary) {
            const error = new Error("Oferta trebuie sa se incheie in aceeasi zi cu inceperea ei.");
            error.status = 400;
            throw error;
        }

        if (!Array.isArray(products) || products.length === 0) {
            const error = new Error("Oferta trebuie sa contina cel putin un produs.");
            error.status = 400;
            throw error;
        }

        try {
            // validation - ptoduct corresponds to the shop
            for (const product of products) {
                const productCheck = await sqlRequest()
                    .input("productId", product.productId)
                    .input("shopId", shopId)
                    .query(`
                        SELECT id FROM products
                        WHERE id = @productId AND shop_id = @shopId AND is_deleted = 0
                    `);

                if (productCheck.recordset.length === 0) {
                    const err = new Error(`Produsul ${product.productId} nu apartine acestui magazin sau nu exista.`);
                    err.status = 400;
                    throw err;
                }
            }

            // insert offer
            const offerResult = await sqlRequest()
                .input("shopId", shopId)
                .input("startDate", start)
                .input("hoursAvailable", hoursAvailable)
                .input("endDate", end)
                .query(`
                    INSERT INTO offers (shop_id, start_date, hours_available, end_date, is_deleted)
                    OUTPUT INSERTED.id
                    VALUES (@shopId, @startDate, @hoursAvailable, @endDate, 0)
                `);

            const offerId = offerResult.recordset[0].id;

            // insert product associated to offer
            for (const product of products) {
                await sqlRequest()
                    .input("offerId", offerId)
                    .input("productId", product.productId)
                    .input("quantity", product.quantity)
                    .input("discountPercent", product.discountPercent)
                    .query(`
                        INSERT INTO offers_products (offer_id, product_id, quantity, discount_percent)
                        VALUES (@offerId, @productId, @quantity, @discountPercent)
                    `);
            }

            return { id: offerId };
        } catch (err) {
            if (!err.status) {
                err.status = 400;
            }
            throw err;
        }
    },

    getOfferProductDetails: async (offerId, productId) => {
        const result = await sqlRequest()
            .input("offerId", offerId)
            .input("productId", productId)
            .query(`
                SELECT op.quantity, op.discount_percent AS discountPercent, p.price
                FROM offers_products op
                INNER JOIN products p ON op.product_id = p.id
                WHERE op.offer_id = @offerId AND op.product_id = @productId
            `);

        return result.recordset[0];
    },

    updateOfferStock: async (offerId, productId, quantity) => {
        const result = await sqlRequest()
            .input("offerId", offerId)
            .input("productId", productId)
            .input("quantity", quantity)
            .query(`
                UPDATE offers_products
                SET quantity = quantity - @quantity
                OUTPUT INSERTED.quantity
                WHERE offer_id = @offerId AND product_id = @productId
            `);

        return result.recordset[0].quantity;
    }
}