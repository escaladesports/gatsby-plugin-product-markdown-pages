import { resolve }  from 'path'
import { createFilePath } from 'gatsby-source-filesystem'

exports.createPages = async ({ boundActionCreators, graphql }) => {
	const { createPage } = boundActionCreators

	const result = await graphql(`{
		allProductMarkdown{
			edges {
				node {
					productId
					category
				}
			}
		}
	}`)

	if (result.errors) {
		console.error(result.errors)
		process.exit(1)
	}

	const categories = {}
	const products = []

	// Get product data
	result.data.allProductMarkdown.edges.forEach(({ node }) => {
		const id = node.productId
		const category = node.category

		if (id) {
			const lowerId = id.toLowerCase()
			const upperId = id.toUpperCase()


			if (!categories[category]) {
				categories[category] = []
			}
			categories[category].push(upperId)

			products.push({
				id,
				lowerId,
				upperId,
				category,
			})

		}

	})

	// Create product pages
	products.forEach(product => {
		createPage({
			path: `/product/${product.lowerId}`,
			component: resolve(`./src/templates/product.js`),
			context: {
				regexProducts: `/${categories[product.category].join('|')}/`,
				...product
			},
		})
	})

	// Create category pages
	for(let category in categories){
		createPage({
			path: `/category/${category}`,
			component: resolve(`./src/templates/category.js`),
			context: {
				category,
				regexProducts: `/${categories[category].join('|')}/`,
			},
		})
	}

}