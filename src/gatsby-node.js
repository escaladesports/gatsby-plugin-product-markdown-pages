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

	const categories = []

	result.data.allProductMarkdown.edges.forEach(({ node }) => {
		const id = node.productId

		// Create product page
		if (id) {
			const lowerId = id.toLowerCase()
			createPage({
				path: `/product/${lowerId}`,
				component: resolve(`./src/templates/product.js`),
				context: {
					id,
					lowerId,
					upperId: id.toUpperCase(),
				},
			})
		}

		// Create cateogry page
		const category = node.category
		if (category && categories.indexOf(category) === -1){
			categories.push(category)
			createPage({
				path: `/category/${category}`,
				component: resolve(`./src/templates/category.js`),
				context: {
					category,
				},
			})
		}
	})

}