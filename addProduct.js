const fs = require('fs');

const [title, price, imageUrl] = process.argv.slice(2);

if (!title || !price || !imageUrl) {
  console.error('Usage: node addProduct.js "Product Title" 25 "https://image.url"');
  process.exit(1);
}

const newProduct = `
<div class="product-box" onclick="goToDetailPage(this)"> 
  <img src="${imageUrl}" alt="" class="product-img"/>
  <h4 class="product-title">${title}</h4>
  <span class="price">€${price}</span>
  <div class="product-s">
    <p>Size</p>   
    <select class="product-size">                 
      <option value="Small">Small</option>
      <option value="Medium">Medium</option>
      <option value="Large">Large</option>
      <option value="XLarge">XLarge</option>
      <option value="XXLarge">XXLarge</option>
    </select>
  </div>
</div>
`;

const filePath = 'index.html';
let html = fs.readFileSync(filePath, 'utf8');

// Inject before <!-- END PRODUCTS -->
const updated = html.replace('<!-- END PRODUCTS -->', `${newProduct}\n<!-- END PRODUCTS -->`);

fs.writeFileSync(filePath, updated);
console.log(`✅ Product "${title}" added successfully!`);
