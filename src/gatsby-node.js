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

	result.data.allProductMarkdown.edges.forEach(({ node }) => {
		const id = node.productId

		// Create product page
		if (id) {
			const lowerId = id.toLowerCase()
			const upperId = id.toUpperCase()
			const ctx = {
				id,
				lowerId,
				upperId,
			}
			createPage({
				path: `/product/${lowerId}`,
				component: resolve(`./src/templates/product.js`),
				context: {...ctx},
			})

			// Create cateogry page
			const category = node.category
			if (!categories[category]) {
				categories[category] = []
			}
			categories[category].push({...ctx})

		}

	})

	for(let category in categories){
		createPage({
			path: `/category/${category}`,
			component: resolve(`./src/templates/category.js`),
			context: {
				category,
				products: categories[category],
			},
		})
	}

}