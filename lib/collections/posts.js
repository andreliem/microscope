Posts = new Mongo.Collection('posts');

Posts.allow({
	update: function(userId, post) { return ownsDocument(userId, post); },
	remove: function(userId, post) { return ownsDocument(userId, post); }
});

Posts.deny({
	update: function(userId, post, fieldNames) {
		// can only edit 2 fields not in fieldNames
		return (_.without(fieldNames, 'url', 'title').length > 0);
	}
});

Meteor.methods({
	postUpdate: function(postId, postAttributes) {
		check(Meteor.userId(), String);
		check(postId, String);
		check(postAttributes, {
			title: String,
			url: String
		});

		var postWithSameLink = Posts.findOne(
			{_id: { $ne: postId}, url: postAttributes.url},
		);
		if (postWithSameLink) {
			return {
				postExists: true,
				_id: postWithSameLink._id
			}
		}

		Posts.update(postId, {$set: postAttributes}, function(error, result) {
			console.log("Posts.update", error);
			console.log("Posts.update", result);
		});

		return {
			_id: postId
		};

	},
	postInsert: function(postAttributes) {
		check(Meteor.userId(), String);
		check(postAttributes, {
			title: String,
			url: String
		});

		var postWithSameLink = Posts.findOne({url: postAttributes.url});
		if (postWithSameLink) {
			return {
				postExists: true,
				_id: postWithSameLink._id
			}
		}

		var user = Meteor.user();
		var post = _.extend(postAttributes, {
			userId: user._id,
			author: user.username,
			submitted: new Date()
		});
		var postId = Posts.insert(post);
		return {
			_id: postId
		};
	}
});
