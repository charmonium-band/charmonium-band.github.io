const adjustSizes = () => {
  const height = $(window).height();
  $('#scene').height(height);
  $('#content').css('margin-top', height - $('#logo').height());
}

$(document).ready(() => {
  adjustSizes();
});

$(window).on('resize', () => {
  adjustSizes();
})
