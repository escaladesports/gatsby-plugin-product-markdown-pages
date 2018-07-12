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
					subcategory
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
		const subcategory = node.subcategory ? node.category + '/' + node.subcategory : '';

		if (id) {
			const lowerId = id.toLowerCase()
			const upperId = id.toUpperCase()

			if (!categories[category]) {
				categories[category] = []
			}
			categories[category].push(upperId)

			if (subcategory !== '') {
				if (!categories[subcategory]) {
					categories[subcategory] = []
				}
				categories[subcategory].push(upperId)
			}

			products.push({
				id,
				lowerId,
				upperId,
				category,
				subcategory
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
	for (category in categories) {
		let cats = category.split('/');
		let context = {}
		if (cats.length >= 2) {
			context = {
				category: cats[0],
				subcategory: cats[1],
				regexProducts: '/' + categories[category].join('|') + '/'
			}
		} else {
			context = {
				category: category,
				subcategory: 'NONE',
				regexProducts: '/' + categories[category].join('|') + '/'
 			}
		}
		createPage({
			path: '/category/' + category,
			component: (0, _path.resolve)('./src/templates/category.js'),
			context: context
		});
	}
}