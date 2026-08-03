const { sqlRequest } = require("../../db");
const fs = require("fs/promises");
const path = require("node:path");
const config = require('../../../config.json')

async function validateProduct(productData) {
    if (productData.name !== undefined) {
        if (productData.name.length === 0) {
            throw new Error("Trebuie sa introduceti un nume valid!");
        }

        if (productData.name.length > 100) {
            throw new Error("Denumirea nu poate avea mai mult de 100 de caractere!");
        }
    }

    if (productData.description !== undefined) {
        if (productData.description.length === 0) {
            throw new Error("Trebuie sa introduceti o descriere!");
        }

        if (productData.description.length > 1000) {
            throw new Error("Descrierea nu poate avea mai mult de 1000 de caractere!");
        }
    }

    if (productData.price !== undefined) {
        if (productData.price < 0) {
            throw new Error("Pretul trebuie sa fie pozitiv!");
        }
    }
}

module.exports = {
    getProductsByShop: async (shopId) => {
        const result = await sqlRequest()
            .input("shopId", shopId)
            .query(`
                SELECT id, shop_id AS shopId, name, price, description, photo_path AS photoPath
                FROM products
                WHERE shop_id = @shopId
                AND is_deleted = 0
                ORDER BY id DESC
            `);
        return result.recordset;
    },

    createProduct: async (productData) => {
        await validateProduct(productData);

        const photo = productData.photo && productData.photo.length > 0 ? productData.photo[0].filename : null;

        const result = await sqlRequest()
            .input("shopId", productData.shopId)
            .input("name", productData.name)
            .input("price", productData.price)
            .input("description", productData.description)
            .input("photo", photo)
            .query(`
                INSERT INTO products (shop_id, name, price, description, photo_path)
                OUTPUT inserted.id, inserted.shop_id AS shopId, inserted.name, inserted.price, inserted.description, inserted.photo_path AS photoPath
                VALUES (@shopId, @name, @price, @description, @photo);
            `);

        return result.recordset[0];

    },

    deleteProduct: async (id) => {
        const result = await sqlRequest()
            .input("id", id)
            .query(`
                UPDATE products
                SET is_deleted = 1
                OUTPUT inserted.id
                WHERE id = @id AND is_deleted = 0
            `);

        if (result.recordset.length === 0) {
            const err = new Error("Produsul nu a fost găsit.");
            err.status = 404;
            throw err;
        }

        return result.recordset[0];
    },

    updateProduct: async (id, productData) => {
        if (productData.name !== undefined || productData.price !== undefined || productData.description !== undefined) {
            await validateProduct({
                name: productData.name,
                price: productData.price,
                description: productData.description
            });
        }

        const currentProductResult = await sqlRequest()
            .input("id", id)
            .query(`
                SELECT photo_path AS photoPath
                FROM products
                WHERE id = @id AND is_deleted = 0
            `);

        if (currentProductResult.recordset.length === 0) {
            const err = new Error("Produsul nu a fost gasit.");
            err.status = 404;
            throw err;
        }

        const currentProductData = currentProductResult.recordset[0];

        let filesToDelete = [];

        let updateCommands = [];
        let request = sqlRequest().input("id", id)

        if (productData.name !== undefined) {
            updateCommands.push("name = @name");
            request.input("name", productData.name);
        }

        if (productData.price !== undefined) {
            updateCommands.push("price = @price");
            request.input("price", productData.price);
        }

        if (productData.description !== undefined) {
            updateCommands.push("description = @description");
            request.input("description", productData.description);
        }

        if (productData.photo && productData.photo.length > 0) {
            const photoName = productData.photo[0].filename;

            updateCommands.push("photo_path = @photo");
            request.input("photo", photoName);

            if (currentProductData.photoPath) {
                filesToDelete.push(
                    path.join(
                        process.cwd(),
                        config.imagesFolder,
                        currentProductData.photoPath
                    )
                );
            }
        }

        if (updateCommands.length === 0) {
            return currentProductData;
        }

        const updateQuery = `
            UPDATE products
            SET ${updateCommands.join(", ")}
            OUTPUT inserted.id, inserted.shop_id AS shopId, inserted.name, inserted.price, inserted.description, inserted.photo_path AS photoPath
            WHERE id = @id AND is_deleted = 0;
         `;

        const result = await request.query(updateQuery);

        for (const filePath of filesToDelete) {
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.error("Nu s-a putut șterge fișierul:", filePath, err);
            }
        }

        return result.recordset[0];
    },

}