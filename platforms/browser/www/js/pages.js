$$(document).on('page:init', '.page[data-name="about"]', function (e, page) {
  console.log('Isi Query: ' + page.route.query.test);
});