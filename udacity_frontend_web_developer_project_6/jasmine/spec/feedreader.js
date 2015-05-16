/** feedreader.js
  *
  * This is the spec file that Jasmine will read and contains
  * all of the tests that will be run against your application.
*/

/** We're placing all of our tests within the $() function,
  * since some of these tests may require DOM elements. We want
  * to ensure they don't run until the DOM is ready.
*/
$(function() {

	/** This suite is used to validate the RSS
	  * feeds definitions defined in the allFeeds
	  * variable in our application.
	*/
	describe('RSS Feeds', function() {

		/** This test makes sure that the
		  * allFeeds variable has been defined and that it is not
		  * empty.
		*/
		it('are defined', function() {
			expect(allFeeds).toBeDefined();
			expect(allFeeds.length).not.toBe(0);
		});

		/** This test loops through each feed
		  * in the allFeeds object and ensures it has a URL defined
		  * and that the URL is not empty.
		*/
		it('has a url', function() {
			var i;
			for (i = 0; i < allFeeds.length; i++) {
				expect(allFeeds[i].url).toBeDefined();
				expect(allFeeds[i].url.length).not.toBe(0);
			}
		});

		/** This test loops through each feed
		  * in the allFeeds object and ensures it has a name defined
		  * and that the name is not empty.
		*/
		it('has a name', function() {
			var i;
			for (i = 0; i < allFeeds.length; i++) {
				expect(allFeeds[i].name).toBeDefined();
				expect(allFeeds[i].name.length).not.toBe(0);
			}
		});
	});

	/** This suite is used to validate the menu.
	*/
	describe('The menu', function() {

		/** This test ensures the menu element is
		  * hidden by default based on a class name applied to the body.
		*/
		it('has "menu-hidden" class on body by default', function() {
			// Check that the hidden class is present.
			expect($('body').hasClass('menu-hidden')).toBe(true);
		});

		/** This test that ensures the menu changes
		  * visibility when the menu icon is clicked. This test
		  * has two expectations: does the menu display when
		  * clicked and does it hide when clicked again.
		*/
		it('toggles "menu-hidden" class on body when the menu icon is clicked', function() {
			var menuIcon = $('.menu-icon-link');
			// Check that the hidden class is present.
			expect($('body').hasClass('menu-hidden')).toBe(true);
			// Click the menu icon.
			menuIcon.click();
			// Check that the hidden class is not present.
			expect($('body').hasClass('menu-hidden')).not.toBe(true);
			// Click the menu icon to restore.
			menuIcon.click();
		});
	});

	/** This suite is used to validate the initial
	  * entries from a feed.
	*/
	describe('Initial Entries', function() {

		/** Invoke the loadFeed function passing in a pointer to the
		  * first index for allFeeds. Because loadFeed is asynchronous
		  * we will use beforeEach and pass Jasmine's done() function as
		  * a callback so that the "it" will be invoked upon completion.
		*/
		beforeEach(function(done) {
			loadFeed(0, function() {
				done();
			});
		});

		/** This test ensures that when the loadFeed
		  * function is called and completes its work, there is at least
		  * a single .entry element within the .feed container.
		  * Because loadFeed() is asynchronous, this test requires
		  * the use of Jasmine's beforeEach and asynchronous done() function.
		*/
		it('should add load initial entries', function(done) {
			expect($('.feed .entry').length).not.toBe(0);
			done();
		});

	});

	/** This suite is used to test what happens when
	  * a new feed is loaded.
	*/
	describe('New Feed Selection', function() {

		var firstFeedHtml,
			secondFeedHtml;

		/** Invoke the loadFeed function passing in a pointer to two
		  * indeices for allFeeds. Because loadFeed is asynchronous
		  * we will use beforeEach and pass Jasmine's done() function as
		  * a callback so that the "it" will be invoked upon completion.
		*/
		beforeEach(function(done) {
			loadFeed(0, function() {
				firstFeedHtml = $('.feed').html();
				loadFeed(1, function() {
					secondFeedHtml = $('.feed').html();
					done();
				});
			});
		});

		/** This test compares the innerHTML of the first and second feeds
		  * ensuring that the content changed.
		*/
		it('should be different from previous selection', function(done) {
			expect(secondFeedHtml).not.toBe(firstFeedHtml);
			done();
		});
	});

}());
