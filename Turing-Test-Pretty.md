# Turing-Test


### 1. src

<details open><summary><b>

#### constants.js
</b></summary>

**E:\Node\Turing-Test\turing-node.js-challenge\src\constants.js**
```Typescript
const validationErrorMessages = {
  productIdValidation: "Product Id should be a valid non-zero positive integer",
  productNotFound: "Product not found",
  itemIdValidtion: "Item id should be a valid positive non-zero integer",
  expiryDateValidation: "Expiry date should be a valid date",
  itemNotFound: "Item not found",
  itemValidation: "Item must be a valid object",
  itemAlreadyExists: "Item already exist",
  itemExpired: "Item is expired",
};

module.exports = { validationErrorMessages };

```

</details>
<details open><summary><b>

#### task1.js
</b></summary>

**E:\Node\Turing-Test\turing-node.js-challenge\src\task1.js**
```Typescript
/**
 * Task 1
 */
const fs = require("fs");
const path = require("path");
const { validationErrorMessages } = require("./constants");

/**
 * Get Product info and its reviews
 * @param {Number} productId - Product id
 */

async function getProductInformationByProductId(productId) {
  // Check for the valid product id which should be a positive non-zero integer.
  if (!Number.isInteger(productId) || productId <= 0) {
    throw new Error(validationErrorMessages.productIdValidation);
  }

  const productsPath = "data/task1/products.json";
  const imagesPath = "data/task1/images.json";
  const reviewsPath = "data/task1/reviews.json";
  const customersPath = "data/task1/customers.json";

  const readFileAsJSON = async (filePath) => {
    const text = await fs.promises.readFile(
      path.join(__dirname, filePath),
      "utf8"
    );
    return JSON.parse(text);
  };

  const createMapByProperty = (array, property) =>
    new Map(array.map((item) => [item[property], item]));

  // Read products, images, reviews, and customers from files
  // Note: Keep the order aligned with the paths.
  const [{ products }, { images }, { reviews }, { customers }] =
    await Promise.all(
      [productsPath, imagesPath, reviewsPath, customersPath].map(readFileAsJSON)
    );

  // Find the product with the given productId
  const product = products.find((p) => p.id === productId);

  // Check if product exists
  if (!product) {
    throw new Error(validationErrorMessages.productNotFound);
  }

  // Filter the product data - `expiry_date` and `manufactured_date` aren't needed.
  const { expiry_date: _, manufactured_date: __, ...filteredProduct } = product;

  // Create maps for better search speed.
  const imageMap = createMapByProperty(images, "id");
  const customerMap = createMapByProperty(customers, "id");

  // Collect reviews for the product
  filteredProduct.reviews = reviews
    .filter((review) => review.product_id === productId)
    .map((review) => {
      const { product_id: _, customer_id, images, ...filteredReview } = review;

      // Retrieve the information of the customer who provided the review.
      filteredReview.customer = customerMap.get(customer_id);

      if (filteredReview.customer) {
        // `phone_number` should be encoded with base64.
        filteredReview.customer.phone_number = btoa(
          filteredReview.customer.phone_number
        );

        // `credit_card` and `country` should be excluded.
        delete filteredReview.customer.credit_card;
        delete filteredReview.customer.country;
      }

      // Populate the attached image data
      filteredReview.images = images.map((imageId) => imageMap.get(imageId));

      return filteredReview;
    })
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));

  return filteredProduct;
}

/**
 * TIP: Use the following code to test your implementation
 */
(async () => {
  try {
    const product = await getProductInformationByProductId(3);
    console.log(JSON.stringify(product, null, 3));
  } catch (err) {
    console.error(err);
  }
})();

module.exports = {
  getProductInformationByProductId,
};

```

</details>
<details open><summary><b>

#### task11.js
</b></summary>

**E:\Node\Turing-Test\turing-node.js-challenge\src\task11.js**
```Typescript
const { validationErrorMessages } = require("./constants");
const fs = require("fs/promises");
const path = require("path");
const dataLocation = [
  "./data/task1/customers.json",
  "./data/task1/images.json",
  "./data/task1/products.json",
  "./data/task1/reviews.json",
];

const readFileAsJSON = async (filepath) => {
  const fileData = await fs.readFile(path.join(__dirname, filepath), "utf-8");
  return JSON.parse(fileData);
};

const getProductInformationByProductId = async (productId) => {
  //validate productID
  if (!Number.isInteger(productId) && productId <= 0)
    throw new Error(validationErrorMessages.productIdValidation);

  // GET Data
  const [{ customers }, { images }, { products }, { reviews }] =
    await Promise.all(dataLocation.map(readFileAsJSON));

  // Find the Product
  const product = products.find((p) => p.id === productId);
  if (!product) throw new Error(validationErrorMessages.productNotFound);

  // Filter out unnecessary fields
  const { expiry_date: _, manufactured_date: __, ...filterProduct } = product;

  // Embed Reviews in a Product
  const productReviews = reviews.filter((r) => r.product_id === productId);
  filterProduct.reviews = productReviews
    .map((review) => {
      // Embed Customer in a Review
      const { credit_card, phone_number, country, ...customer } =
        customers.find((c) => c.id === review.customer_id);
      // Encode Phone Number with base 64
      customer.phone_number = btoa(phone_number.toString());
      review.customer = customer;

      // Embed Images in a Review
      const resultImages = images.filter((image) => {
        if (review.images.includes(image.id)) return true;
        return false;
      });
      review.images = resultImages;

      // Remove Unnecessary fields
      const { product_id: _, customer_id: __, ...revw } = review;
      return revw;
    })
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  filterProduct.reviews.sort((review) => review.created_at);
  return filterProduct;
};

(async () => {
  try {
    const product = await getProductInformationByProductId(4);
    console.dir(product, { depth: null });
  } catch (error) {
    console.log(error);
  }
})();

module.exports = { getProductInformationByProductId };

```

</details>
<details open><summary><b>

#### task2.js
</b></summary>

**E:\Node\Turing-Test\turing-node.js-challenge\src\task2.js**
```Typescript
/**
 * Task 2
 */

const fs = require("fs");
const path = require("path");
const util = require("util");
const { validationErrorMessages } = require("./constants");

/**
 * Update expiry date of the item
 * @param {Number} itemId - Item id
 * @param {String} expiryDate - Expiry date in ISO8601 format
 */
async function updateExpiryDateByItemId(itemId, expiryDate) {
    // Check if `itemId` is a safe integer and greater than 0
    if (!Number.isInteger(itemId) || itemId <= 0) {
        throw new Error(validationErrorMessages.itemIdValidtion);
    }

    // Check if `expiryDate` is a valid date.
    const validDatedExpiryDate = new Date(expiryDate);
  
    if (expiryDate === null || isNaN(validDatedExpiryDate.getTime())) {
      throw new Error(validationErrorMessages.expiryDateValidation);
    }

    const readFileAsync = util.promisify(fs.readFile);

    // Get the product data
    const directoryPath = path.join(__dirname, "./data");
    const filePath = path.join(directoryPath, "task2/update_item_products.json");
    const data = await readFileAsync(filePath, "utf8");
    const products = data ? JSON.parse(data).products : undefined;

    // Check whether the product data is obtained successfully.
    if (products == null) {
        throw new Error(validationErrorMessages.itemNotFound);
    }

    // Holds the item with the given `item_id`
    let item = {};

    // Index of the product which contains the matching item with the given `item_id`
    const productIndex = products.findIndex((product) => (
        // Find the item with the given `item_id`
        item = product.items.find(item => item.item_id === itemId)
    ));

    // Check if the item is found, otherwise throws `itemNotFound` error
    if (item == null) {
        throw new Error(validationErrorMessages.itemNotFound);
    }

    // Update the expiry_date of the item
    item.expiry_date = expiryDate;

    // Create a shallow copy of the product to make it only contain the updated item.
    const productFound = { ...products[productIndex] };
    productFound.items = [item];

    return productFound;
}

/**
 * TIP: Use the following code to test your implementation.
 * You can change the itemId and expiryDate that is passed to
 * the function to test different use cases/scenarios
 */
(async () => {
    try {
        const product = await updateExpiryDateByItemId(142, "2022-01-01");
        console.log(JSON.stringify(product, null, 3));
    } catch (err) {
        console.error(err);
    }
})();

module.exports = {
    updateExpiryDateByItemId,
};

```

</details>
<details open><summary><b>

#### task22.js
</b></summary>

**E:\Node\Turing-Test\turing-node.js-challenge\src\task22.js**
```Typescript
const fs = require("fs/promises");
const path = require("path");
const { validationErrorMessages } = require("./constants");
const updateExpiryDateByItemId = async (itemId, expiryDate) => {
  // itemId Validation
  if (!Number.isInteger(itemId) || itemId <= 0)
    throw new Error(validationErrorMessages.itemIdValidtion);

  // expiryDate Validation
  const validExpiryDate = new Date(expiryDate);
  if (validExpiryDate === null || isNaN(validExpiryDate.getTime()))
    throw new Error(validationErrorMessages.expiryDateValidation);

  // Ready Data
  const data = await fs.readFile(
    path.join(__dirname, "./data/task2/update_item_products.json"),
    "utf-8"
  );
  const products = JSON.parse(data).products;

  let item = {};
  const productIndex = products.findIndex(
    (product) => (item = product.items.find((itm) => itm.item_id === itemId))
  );
  if (!item) throw new Error(validationErrorMessages.itemNotFound);

  item.expiry_date = expiryDate;
  const result = { ...products[productIndex] };
  result.items = [item];
  return result;
};

(async () => {
  try {
    const product = await updateExpiryDateByItemId(142, "2022-01-01");
    console.log(JSON.stringify(product, null, 3));
  } catch (err) {
    console.error(err);
  }
})();

module.exports = { updateExpiryDateByItemId };

```

</details>
<details open><summary><b>

#### task3.js
</b></summary>

**E:\Node\Turing-Test\turing-node.js-challenge\src\task3.js**
```Typescript
/**
 * Task 3
 */
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const { validationErrorMessages } = require("./constants");
/**
 * Add item to a product
 * @param {Number} productId - Product id
 * @param {Object} item - { id: 1010, expiry_date: "2050-03-30T12:57:07.846Z" }
 */
async function addItem(productId, item) {
    // Validate `productId`
    if (!Number.isInteger(productId) || productId <= 0) {
        throw new Error(validationErrorMessages.productIdValidation);
    }

    // Check if `item` is a valid object
    if (
        typeof item !== 'object' ||
        typeof item?.id !== 'number' ||
        typeof item?.expiry_date !== 'string'
    ) {
        throw new Error(validationErrorMessages.itemValidation);
    }

    // Read product data from file
    const productsPath = 'data/task3/products.json';
    let { products } = await fs.promises.readFile(path.join(__dirname, productsPath)).then(JSON.parse);

    // Find product by productId
    const product = products.find(product => product.id === productId);

    // Check if the product with the matching id is found
    if (product == null) {
        throw new Error(validationErrorMessages.productNotFound);
    }

    // Check if the item already exists with the given id
    if (product.items.findIndex(i => i.item_id === item.id) !== -1) {
        throw new Error(validationErrorMessages.itemAlreadyExists);
    }

    // Check if the item has expired
    if (Date.now() > Date.parse(item.expiry_date)) {
        throw new Error(validationErrorMessages.itemExpired);
    }

    // Add the given item to the product
    product.items.push({ item_id: item.id, expiry_date: item.expiry_date });
    product.items_left++;
    product.items.sort((a, b) => a.item_id - b.item_id);

    return product;
}

/**
 * TIP: Use the following code to test your implementation
 * Use different values for input parameters to test different scenarios
 */
(async () => {
    try {
        const result = await addItem(4, {
            id: 410,
            expiry_date: "2050-03-30T12:57:07.846Z",
        });
        console.log(result);
    } catch (err) {
        console.error(err);
    }
})();

module.exports = {
    addItem,
};

```

</details>
<details open><summary><b>

#### task33.js
</b></summary>

**E:\Node\Turing-Test\turing-node.js-challenge\src\task33.js**
```Typescript
const path = require("path");
const { validationErrorMessages } = require("./constants");
const fs = require("fs/promises");
const addItem = async (productId, item) => {
  //#region isProductIdValid
  if (!Number.isInteger(productId) || productId <= 0)
    throw new Error(validationErrorMessages.productIdValidation);
  //#endregion

  //#region item-validation
  const validExpiryDate = new Date(item.expiry_date);
  if (
    !item.id ||
    !item.expiry_date ||
    !Number.isInteger(item.id) ||
    item.id <= 0 ||
    validExpiryDate === null ||
    isNaN(validExpiryDate.getTime())
  )
    throw new Error(validationErrorMessages.itemValidation);
  //#endregion

  //#region Read data in products
  const data = await fs.readFile(
    path.join(__dirname, "./data/task3/products.json"),
    "utf-8"
  );
  const products = JSON.parse(data).products;
  //#endregion

  //#region find productById
  const product = products.find((product) => product.id === productId);
  if (!product) throw new Error(validationErrorMessages.productNotFound);
  //#endregion

  //#region is-ItemId-Unique
  const isItemIdUnique = product.items.findIndex(
    (itm) => itm.item_id === item.id
  );
  if (isItemIdUnique !== -1)
    throw new Error(validationErrorMessages.itemAlreadyExists);
  //#endregion

  //#region isItemExpired
  const currentDate = new Date();
  if (validExpiryDate - currentDate < 0)
    throw new Error(validationErrorMessages.itemExpired);
  //#endregion

  //#region Append New Item to Items and sort
  product.items.push({ item_id: item.id, expiry_date: item.expiry_date });
  product.items.sort((a, b) => a.item_id - b.item_id);
  product.items_left++;
  //#endregion

  return product;
};

(async () => {
  try {
    const result = await addItem(4, {
      id: 410,
      expiry_date: "2050-03-30T12:57:07.846Z",
    });
    console.log(result);
  } catch (err) {
    console.error(err);
  }
})();

module.exports = {
  addItem,
};

```

</details>

### 2. data


### 3. task1

<details open><summary><b>

#### customers.json
</b></summary>

**E:\Node\Turing-Test\turing-node.js-challenge\src\data\task1\customers.json**
```Typescript
{
  "customers": [
    {
      "id": 1,
      "name": "Aaron",
      "credit_card": 5555553753048194,
      "phone_number": 6056775011,
      "country": "United States",
      "email": "peter.p@zylker.com"
    },
    {
      "id": 2,
      "name": "Hemanth",
      "credit_card": 3234557535048147,
      "phone_number": 4056774023,
      "country": "India",
      "email": "hemanth.p@gmail.com"
    },
    {
      "id": 3,
      "name": "Ceylon",
      "credit_card": 8555553753048189,
      "phone_number": 905677502,
      "country": "United States",
      "email": "ceylon.p@gmail.com"
    },
    {
      "id": 4,
      "name": "Howard",
      "credit_card": 4534563753048332,
      "phone_number": 8055775056,
      "country": "United States",
      "email": "peter.p@zylker.com"
    },
    {
      "id": 5,
      "name": "Bernedette",
      "credit_card": 6335537530486794,
      "phone_number": 9053775056,
      "country": "India",
      "email": "bernedette.p@yahoo.com"
    }
  ]
}

```

</details>
<details open><summary><b>

#### images.json
</b></summary>

**E:\Node\Turing-Test\turing-node.js-challenge\src\data\task1\images.json**
```Typescript
{
  "images": [
    {
      "id": 1,
      "url": "https://farm8.staticflickr.com/7377/9359257263_81b080a039_z_d.jpg"
    },
    {
      "id": 2,
      "url": "https://farm4.staticflickr.com/3752/9684880330_9b4698f7cb_z_d.jpg"
    },
    {
      "id": 3,
      "url": "https://farm2.staticflickr.com/1449/24800673529_64272a66ec_z_d.jpg"
    }
  ]
}

```

</details>
<details open><summary><b>

#### products.json
</b></summary>

**E:\Node\Turing-Test\turing-node.js-challenge\src\data\task1\products.json**
```Typescript
{
  "products": [
    {
      "id": 1,
      "name": "Bimbo Breads",
      "expiry_date": "2023-05-31T12:00:00Z",
      "manufactured_date": "2022-11-15T08:30:00Z"
    },
    {
      "id": 2,
      "name": "Cinamon Roll",
      "expiry_date": "2023-04-30T12:00:00Z",
      "manufactured_date": "2022-10-01T10:00:00Z"
    },
    {
      "id": 3,
      "name": "Mill's Oats",
      "expiry_date": "2023-06-30T12:00:00Z",
      "manufactured_date": "2022-12-01T09:00:00Z"
    },
    {
      "id": 4,
      "name": "Instant pudding",
      "expiry_date": "2023-03-31T12:00:00Z",
      "manufactured_date": "2022-09-15T14:30:00Z"
    },
    {
      "id": 5,
      "name":  "Bimbo Salsa sauce",
      "expiry_date": "2023-05-15T12:00:00Z",
      "manufactured_date": "2022-11-01T11:00:00Z"
    }
  ]
}

```

</details>
<details open><summary><b>

#### reviews.json
</b></summary>

**E:\Node\Turing-Test\turing-node.js-challenge\src\data\task1\reviews.json**
```Typescript
{
  "reviews": [
    {
      "id": 1,
      "message": "Great taste!",
      "product_id": 2,
      "customer_id": 1,
      "created_at": "2023-01-28T09:00:00Z",
      "rating": 5,
      "images": [1, 2]
    },
    {
      "id": 2,
      "message": "Not satisfied",
      "product_id": 1,
      "customer_id": 2,
      "created_at": "2023-02-27T10:00:00Z",
      "rating": 2,
      "images": [2]
    },
    {
      "id": 3,
      "message": "Great taste!",
      "product_id": 3,
      "customer_id": 3,
      "created_at": "2023-02-28T09:00:00Z",
      "rating": 5,
      "images": [1]
    },
    {
      "id": 4,
      "message": "Not satisfied",
      "product_id": 4,
      "customer_id": 4,
      "created_at": "2023-01-27T10:00:00Z",
      "rating": 2,
      "images": [3]
    },
    {
      "id": 5,
      "message": "Superb",
      "product_id": 4,
      "customer_id": 3,
      "created_at": "2023-05-27T10:00:00Z",
      "rating": 3,
      "images": [1]
    },
    {
      "id": 6,
      "message": "Superb",
      "product_id": 4,
      "customer_id": 5,
      "created_at": "2023-07-27T10:00:00Z",
      "rating": 3,
      "images": [1, 3]
    }
  ]
}

```

</details>

### 4. task2

<details open><summary><b>

#### update_item_products.json
</b></summary>

**E:\Node\Turing-Test\turing-node.js-challenge\src\data\task2\update_item_products.json**
```Typescript
{
   "products": [
      {
         "id": 5,
         "name": "Bimbo Salsa sauce",
         "is_available": true,
         "price": 12,
         "total_number_of_items": 5,
         "number_of_items_left": 3,
         "items": [
            {
               "item_id": 132,
               "expiry_date": "2050-12-31"
            },
            {
               "item_id": 133,
               "expiry_date": "2050-12-31"
            },
            {
               "item_id": 134,
               "expiry_date": "2022-06-23T17:57:44.525Z"
            },
            {
               "item_id": 135,
               "expiry_date": "2022-12-31"
            },
            {
               "item_id": 136,
               "expiry_date": "2022-01-01"
            }
         ],
         "rating": 4.2,
         "brand": "Bimbo",
         "category": "Condiments"
      },
      {
         "id": 6,
         "name": "Cereal bars",
         "is_available": true,
         "price": 34,
         "total_number_of_items": 6,
         "number_of_items_left": 5,
         "items": [
            {
               "item_id": 137,
               "expiry_date": "2023-06-10T01:47:07.846Z"
            },
            {
               "item_id": 138,
               "expiry_date": "2023-05-11T12:23:07.846Z"
            },
            {
               "item_id": 139,
               "expiry_date": "2023-05-11T12:57:07.846Z"
            },
            {
               "item_id": 140,
               "expiry_date": "2023-03-22T13:57:07.846Z"
            },
            {
               "item_id": 141,
               "expiry_date": "2023-05-15T03:57:07.846Z"
            },
            {
               "item_id": 142,
               "expiry_date": "2022-01-01"
            }
         ],
         "rating": 3.6,
         "brand": "Burry",
         "category": "Bakery"
      },
      {
         "id": 7,
         "name": "Low fat cottage cheese",
         "is_available": true,
         "price": 12,
         "total_number_of_items": 15,
         "number_of_items_left": 12,
         "items": [
            {
               "item_id": 143,
               "expiry_date": "2023-01-07T01:47:07.846Z"
            },
            {
               "item_id": 144,
               "expiry_date": "2023-01-04T02:09:07.846Z"
            },
            {
               "item_id": 145,
               "expiry_date": "2022-01-01"
            },
            {
               "item_id": 146,
               "expiry_date": "2023-12-10T13:23:07.846Z"
            },
            {
               "item_id": 147,
               "expiry_date": "2022-01-01"
            },
            {
               "item_id": 148,
               "expiry_date": "2023-12-17T12:57:07.846Z"
            },
            {
               "item_id": 149,
               "expiry_date": "2023-12-27T10:57:07.846Z"
            },
            {
               "item_id": 150,
               "expiry_date": "2022-01-01"
            },
            {
               "item_id": 151,
               "expiry_date": "2023-12-30T12:45:07.846Z"
            },
            {
               "item_id": 152,
               "expiry_date": "2023-11-29T13:54:07.846Z"
            },
            {
               "item_id": 153,
               "expiry_date": "2023-12-28T12:09:07.846Z"
            },
            {
               "item_id": 154,
               "expiry_date": "2023-07-237T12:45:07.846Z"
            },
            {
               "item_id": 155,
               "expiry_date": "2023-05-07T11:33:07.846Z"
            },
            {
               "item_id": 156,
               "expiry_date": "2023-04-12T13:27:07.846Z"
            },
            {
               "item_id": 157,
               "expiry_date": "2023-07-07T12:34:07.846Z"
            }
         ],
         "rating": 4,
         "brand": "Angel Delight",
         "category": "Dairy"
      },
      {
         "id": 8,
         "name": "Low fat milk",
         "is_available": true,
         "price": 10,
         "total_number_of_items": 5,
         "number_of_items_left": 5,
         "items": [
            {
               "item_id": 158,
               "expiry_date": "2022-01-01"
            },
            {
               "item_id": 159,
               "expiry_date": "2023-03-30T04:17:07.846Z"
            },
            {
               "item_id": 160,
               "expiry_date": "2022-01-01"
            },
            {
               "item_id": 161,
               "expiry_date": "2023-03-22T12:23:07.846Z"
            },
            {
               "item_id": 162,
               "expiry_date": "2022-12-31"
            }
         ],
         "rating": 4.78,
         "brand": "Angel Delight",
         "category": "Dairy"
      }
   ]
}
```

</details>

### 5. task3

<details open><summary><b>

#### products.json
</b></summary>

**E:\Node\Turing-Test\turing-node.js-challenge\src\data\task3\products.json**
```Typescript
{
  "products": [
    {
      "id": 1,
      "name": "Bimbo Breads",
      "is_available": true,
      "price": 12,
      "rating": 4.69,
      "brand": "Bimbo",
      "category": "Bakery",
      "items_left": 5,
      "items": [
        {
          "item_id": 101,
          "expiry_date": "2050-03-30T12:57:07.846Z"
        },
        {
          "item_id": 102,
          "expiry_date": "2050-03-12T11:30:07.846Z"
        },
        {
          "item_id": 103,
          "expiry_date": "2023-03-07T06:32:07.846Z"
        },
        {
          "item_id": 104,
          "expiry_date": "2023-03-15T07:25:07.846Z"
        },
        {
          "item_id": 105,
          "expiry_date": "2050-02-01T12:57:07.846Z"
        }
      ]
    },
    {
      "id": 2,
      "name": "Low fat milk",
      "is_available": true,
      "price": 10,
      "rating": 4.78,
      "brand": "Angel Delight",
      "category": "Dairy"
    },
    {
      "id": 3,
      "name": "Mill's Oats",
      "is_available": true,
      "price": 12,
      "rating": 4.2,
      "brand": "ArrowHead Mills",
      "category": "Bakery",
      "items_left": 15,
      "items": [
        {
          "item_id": 301,
          "expiry_date": "2023-01-07T01:47:07.846Z"
        },
        {
          "item_id": 302,
          "expiry_date": "2023-01-04T02:09:07.846Z"
        },
        {
          "item_id": 303,
          "expiry_date": "2023-02-12T06:23:07.846Z"
        },
        {
          "item_id": 304,
          "expiry_date": "2050-12-10T13:23:07.846Z"
        },
        {
          "item_id": 305,
          "expiry_date": "2050-12-07T15:30:07.846Z"
        },
        {
          "item_id": 306,
          "expiry_date": "2050-12-17T12:57:07.846Z"
        },
        {
          "item_id": 307,
          "expiry_date": "2050-12-27T10:57:07.846Z"
        },
        {
          "item_id": 308,
          "expiry_date": "2023-12-27T13:57:07.846Z"
        },
        {
          "item_id": 309,
          "expiry_date": "2050-12-30T12:45:07.846Z"
        },
        {
          "item_id": 310,
          "expiry_date": "2050-11-29T13:54:07.846Z"
        },
        {
          "item_id": 311,
          "expiry_date": "2050-12-28T12:09:07.846Z"
        },
        {
          "item_id": 312,
          "expiry_date": "2050-07-237T12:45:07.846Z"
        },
        {
          "item_id": 313,
          "expiry_date": "2050-05-07T11:33:07.846Z"
        },
        {
          "item_id": 314,
          "expiry_date": "2050-04-12T13:27:07.846Z"
        },
        {
          "item_id": 315,
          "expiry_date": "2050-07-07T12:34:07.846Z"
        }
      ]
    },
    {
      "id": 4,
      "name": "Instant pudding",
      "is_available": true,
      "price": 20,
      "rating": 4.78,
      "brand": "Angel Delight",
      "category": "Frozen",
      "items_left": 5,
      "items": [
        {
          "item_id": 401,
          "expiry_date": "2023-03-17T01:57:07.846Z"
        },
        {
          "item_id": 402,
          "expiry_date": "2023-03-30T04:17:07.846Z"
        },
        {
          "item_id": 403,
          "expiry_date": "2023-03-30T09:56:07.846Z"
        },
        {
          "item_id": 404,
          "expiry_date": "2023-03-22T12:23:07.846Z"
        },
        {
          "item_id": 405,
          "expiry_date": "2050-04-05T03:29:07.846Z"
        }
      ]
    },
    {
      "id": 5,
      "name": "Bimbo Salsa sauce",
      "is_available": false,
      "price": 12,
      "rating": 4.2,
      "brand": "Bimbo",
      "category": "Condiments",
      "items_left": 5,
      "items": [
        {
          "item_id": 501,
          "expiry_date": "2023-01-30T12:57:07.846Z"
        },
        {
          "item_id": 502,
          "expiry_date": "2023-01-12T11:30:07.846Z"
        },
        {
          "item_id": 503,
          "expiry_date": "2023-01-07T06:32:07.846Z"
        },
        {
          "item_id": 504,
          "expiry_date": "2023-01-15T07:25:07.846Z"
        },
        {
          "item_id": 505,
          "expiry_date": "2023-01-01T12:57:07.846Z"
        }
      ]
    },
    {
      "id": 6,
      "name": "Cereal bars",
      "is_available": true,
      "price": 34,
      "rating": 3.6,
      "brand": "Burry",
      "category": "Bakery",
      "items_left": 6,
      "items": [
        {
          "item_id": 601,
          "expiry_date": "2050-06-10T01:47:07.846Z"
        },
        {
          "item_id": 602,
          "expiry_date": "2050-05-11T12:23:07.846Z"
        },
        {
          "item_id": 603,
          "expiry_date": "2050-05-11T12:57:07.846Z"
        },
        {
          "item_id": 604,
          "expiry_date": "2023-03-22T13:57:07.846Z"
        },
        {
          "item_id": 605,
          "expiry_date": "2050-05-15T03:57:07.846Z"
        },
        {
          "item_id": 606,
          "expiry_date": "2023-02-17T09:57:07.846Z"
        }
      ]
    },
    {
      "id": 7,
      "name": "Cinamon Roll",
      "is_available": true,
      "price": 20,
      "rating": 3.6,
      "brand": "Burry",
      "category": "Bakery",
      "items_left": 6,
      "items": [
        {
          "item_id": 701,
          "expiry_date": "2050-06-10T01:47:07.846Z"
        },
        {
          "item_id": 702,
          "expiry_date": "2050-05-11T12:23:07.846Z"
        },
        {
          "item_id": 703,
          "expiry_date": "2050-05-11T12:57:07.846Z"
        },
        {
          "item_id": 704,
          "expiry_date": "2023-03-22T13:57:07.846Z"
        },
        {
          "item_id": 705,
          "expiry_date": "2050-05-15T03:57:07.846Z"
        },
        {
          "item_id": 706,
          "expiry_date": "2023-02-17T09:57:07.846Z"
        }
      ]
    },
    {
      "id": 8,
      "name": "Full fat milk",
      "is_available": true,
      "price": 10,
      "rating": 4.78,
      "brand": "Angel Delight",
      "category": "Dairy",
      "items_left": 5,
      "items": [
        {
          "item_id": 801,
          "expiry_date": "2023-01-17T01:57:07.846Z"
        },
        {
          "item_id": 802,
          "expiry_date": "2023-01-30T04:17:07.846Z"
        },
        {
          "item_id": 803,
          "expiry_date": "2023-01-30T09:56:07.846Z"
        },
        {
          "item_id": 804,
          "expiry_date": "2023-01-22T12:23:07.846Z"
        },
        {
          "item_id": 805,
          "expiry_date": "2023-01-05T03:29:07.846Z"
        }
      ]
    }
  ]
}

```

</details>
