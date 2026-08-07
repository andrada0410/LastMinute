IF OBJECT_ID('offers_products') IS NULL
BEGIN
CREATE TABLE offers_products(
    offer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    discount_percent INT NOT NULL,

    CONSTRAINT PK_offer_product PRIMARY KEY (offer_id, product_id),
    CONSTRAINT FK_offer_products_offers FOREIGN KEY (offer_id) REFERENCES offers(id),
    CONSTRAINT FK_offer_products_products FOREIGN KEY (product_id) REFERENCES products(id),
);
END;
