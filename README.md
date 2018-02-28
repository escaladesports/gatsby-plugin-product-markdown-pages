# gatsby-plugin-product-markdown-pages

A Gatsby source plugin for routing pages from [product markdown](https://github.com/escaladesports/product-markdown-spec) files. Intended to be used with [gatsby-source-product-markdown](https://www.npmjs.com/package/gatsby-source-product-markdown).

## Install

With npm:

```bash
npm install --save gatsby-plugin-product-markdown-pages
```

With Yarn:

```bash
yarn add gatsby-plugin-product-markdown-pages
```

## Implement

Basic usage:

```javascript
// ./gatsby-config.js
module.exports = {
	plugins: [
		'gatsby-plugin-product-markdown-pages'
	]
}
```

This will generate pages based on your `id` and `category` properties if available. It will pass context variables `id`, `lowerId`, and `upperId` to product pages. For category pages, it will pass a `category` context variable. Your paths might look something like:

- /product/id1
- /product/id2
- /category/fruits
- /category/vegetables

## Notes

- Product variants will be automatically unpacked.
- When querying your data, the `id` property will be changed to `productId` to differentiate between the product ID that's in your markdown file and the ID that GraphQL uses.