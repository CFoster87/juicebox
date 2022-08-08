const express = require("express");
const tagsRouter = express.Router();
const { getAllTags } = require("../db");

tagsRouter.use((req, res, next) => {
	console.log("A request is being made to /tags");

	next();
});

tagsRouter.get("/", async (req, res) => {
	const tags = await getAllTags();
	res.send({
		tags: tags,
	});
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
	const tagName = req.params.tagName;

	console.log("tagName", tagName);
	try {
		const postsByTag = await getPostsByTagName(tagName);

		const filterPosts = postsByTag.filter((post) => {
			if (post.active) {
				return true;
			}
			if (req.user && req.user.id === post.author.id) {
				return true;
			}

			return false;
		});

		res.send({ filterPosts });
	} catch ({ name, message }) {
		res.status(500).send({ name, message });
	}
});

module.exports = tagsRouter;
