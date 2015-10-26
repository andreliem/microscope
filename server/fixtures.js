if (Posts.find().count() === 0) {
	Posts.insert({
		title: "Introducing Telescope",
		url: "http://sachagreif.com/introductin-telescope/"
	});

	Posts.insert({
		title: "Meteor",
		url: "http://meteor.com"
	});

	Posts.insert({
		title: "The Book",
		url: "http://themeteorbook.com"
	});
	
}