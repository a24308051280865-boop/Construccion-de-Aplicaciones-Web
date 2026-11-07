/// <summary>Image URLs used across the site: REPLACE the placeholders with your own URLs</summary>
const IMAGES = {

    // Big image on the home page (top)
    hero: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80",

    // Image of the "Quiénes somos" section on the home page
    about: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",

    // One image per category (home page tiles)
    categories: {
        playeras:   "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
        camisas:    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80",
        pantalones: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
        sudaderas:  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
        chamarras:  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
        vestidos:   "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80"
    },

    // One image per product (the key is the product name, exactly as in catalogo.sql)
    products: {
        // Playeras
        "Playera básica de algodón": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
        "Playera oversize":          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop&q=80",
        "Playera Batwing Logo":      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&fit=crop&q=80",
        "Playera Trefoil":           "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=80",
        "Playera Sportswear":        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=80",
        "Playera Essentials":        "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&auto=format&fit=crop&q=80",
        "Playera Flag":              "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&auto=format&fit=crop&q=80",
        "Playera Monograma":         "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop&q=80",
        "Playera Piqué":             "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500&auto=format&fit=crop&q=80",
        "Playera estampada":         "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&auto=format&fit=crop&q=80",

        // Camisas
        "Camisa de lino":            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80",
        "Camisa Oxford":             "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=80",
        "Camisa vaquera":            "https://images.unsplash.com/photo-1542272604-787c96355d53?w=500&auto=format&fit=crop&q=80",
        "Camisa Originals":          "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop&q=80",
        "Camisa Club":               "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format&fit=crop&q=80",
        "Camisa Woven":              "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=80",
        "Camisa Oxford Slim":        "https://images.unsplash.com/photo-1598808503746-f35c53414b7d?w=500&auto=format&fit=crop&q=80",
        "Camisa de popelina":        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&auto=format&fit=crop&q=80",
        "Camisa manga larga":        "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&auto=format&fit=crop&q=80",
        "Camisa de cuadros":         "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80",

        // Pantalones
        "Pantalón de sastre":        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80",
        "Pantalón chino":            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=80",
        "Jeans 501 Original":        "https://images.unsplash.com/photo-1542272604-787c96355d53?w=500&auto=format&fit=crop&q=80",
        "Pants Tiro":                "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&auto=format&fit=crop&q=80",
        "Jogger Club":               "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=500&auto=format&fit=crop&q=80",
        "Pants Essentials":          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=80",
        "Chino Bleecker":            "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500&auto=format&fit=crop&q=80",
        "Jeans Slim":                "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=80",
        "Pantalón deportivo":        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=80",
        "Jeans baggy":               "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=500&auto=format&fit=crop&q=80",

        // Sudaderas
        "Sudadera básica":           "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=80",
        "Hoodie clásico":            "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=500&auto=format&fit=crop&q=80",
        "Sudadera Crewneck":         "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80",
        "Hoodie Adicolor":           "https://images.unsplash.com/photo-1572495532053-dcc03752e319?w=500&auto=format&fit=crop&q=80",
        "Hoodie Club Fleece":        "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&auto=format&fit=crop&q=80",
        "Hoodie Essentials":         "https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?w=500&auto=format&fit=crop&q=80",
        "Sudadera Logo":             "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500&auto=format&fit=crop&q=80",
        "Sudadera Institucional":    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format&fit=crop&q=80",
        "Sudadera con cierre":       "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=80",
        "Sudadera estampada":        "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=500&auto=format&fit=crop&q=80",

        // Chamarras
        "Chamarra Bomber":           "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=80",
        "Chamarra acolchada":        "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=500&auto=format&fit=crop&q=80",
        "Trucker Denim":             "https://images.unsplash.com/photo-1578485789226-8f38c3527b14?w=500&auto=format&fit=crop&q=80",
        "Chamarra Track":            "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&auto=format&fit=crop&q=80",
        "Windrunner":                "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&auto=format&fit=crop&q=80",
        "Chamarra cortaviento":      "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=80",
        "Chamarra Harrington":       "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&auto=format&fit=crop&q=80",
        "Chamarra ligera":           "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=80",
        "Chamarra deportiva":        "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500&auto=format&fit=crop&q=80",
        "Chamarra Sherpa":           "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=80",

        // Vestidos
        "Vestido midi":              "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=80",
        "Vestido camisero":          "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format&fit=crop&q=80",
        "Vestido de mezclilla":      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&auto=format&fit=crop&q=80",
        "Vestido de tenis":          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&auto=format&fit=crop&q=80",
        "Vestido deportivo":         "https://images.unsplash.com/photo-1502716119720-b23a93e5fb1b?w=500&auto=format&fit=crop&q=80",
        "Vestido polo":              "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&auto=format&fit=crop&q=80",
        "Vestido de punto":          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=80",
        "Vestido Slip":              "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&auto=format&fit=crop&q=80",
        "Vestido polo piqué":        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&auto=format&fit=crop&q=80",
        "Vestido corto floral":      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=80"
    }
};