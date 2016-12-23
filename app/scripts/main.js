const TRACKLISTS = [
    {
        name: 'Recent Work',
        tracks: [
            {
                id: 'everlasting-lights',
                name: 'Everlasting Lights',
                src: '/music/everlasting-lights.mp3',
                artSrc: '/music/art/everlasting-lights.jpg',
            },
            {
                id: 'dark-matter',
                name: 'Dark Matter',
                src: '/music/dark-matter.mp3',
                artSrc: '/music/art/dark-matter.jpg',
            },
            {
                id: 'space-dance',
                name: 'Space Dance',
                src: '/music/space-dance.mp3',
                artSrc: '/music/art/space-dance.jpg',
            },
        ],
    },
    {
        name: 'Solar Wind',
        tracks: [
            {
                id: 'mondreise',
                name: 'Mondreise',
                src: '/music/mondreise.mp3',
                artSrc: '/music/art/mondreise.jpg',
            },
            {
                id: 'beyond-return',
                name: 'Beyond Return',
                src: '/music/beyond-return.mp3',
            },
            {
                id: 'stardive',
                name: 'Stardive',
                src: '/music/stardive.mp3',
                artSrc: '/music/art/stardive.jpg',
            },
            {
                id: 'lunar-fields',
                name: 'Lunar Fields',
                src: '/music/lunar-fields.mp3',
                artSrc: '/music/art/lunar-fields.jpg',
            },
            {
                id: 'three-sided-truth',
                name: 'Three-Sided Truth',
                src: '/music/three-sided-truth.mp3',
            },
        ],
    },
    {
        name: 'Jams / Others',
        tracks: [
            {
                id: 'jam-in-d',
                name: 'Spacerock Jam in D',
                src: '/music/jam-in-d.mp3',
                artSrc: '/music/art/jam-in-d.jpg',
            },
            {
                id: 'funkturm-insomnia-jam',
                name: 'Funkturm Insomnia Jam',
                src: '/music/funkturm-insomnia-jam.flac',
                artSrc: '/music/art/funkturm-jam.jpg',
            },
        ],
    },
    {
        name: 'Covers',
        tracks: [
            {
                id: 'radioactive-toy',
                name: 'Porcupine Tree - Radioactive Toy',
                src: '/music/radioactive-toy.mp3',
            },
        ],
    },
];

const DEFAULT_TRACK = TRACKLISTS[0].tracks[0];
let currentTrack = null;

function selectTrack(track, play=false) {
    const { id, name, src, artSrc } = track;
    const artSrcOrDefault = artSrc || '/music/art/charmonium-logo.jpg';
    currentTrack = track;
    const playerSource = $('#player source');
    playerSource.attr('src', src);
    $('#current-track-name').text(name);

    $('.track').removeClass('current');

    $('#track-art').fadeOut(250);
    setTimeout(() => {
      $('#track-art').attr('src', artSrcOrDefault);
    }, 250);
    $('#track-art').on('load', function() {
      $(this).fadeIn(250);
    });

    $('#music-content ol').removeClass('current');
    $(`#track-${ id }`).addClass('current');
    $(`#track-${ id }`).parent().addClass('current');

    $('#player').get(0).load();
    if (play) {
      $('#player').get(0).play();
    }
}

function buildTracklists(trackLists) {
    trackLists.map((trackList) => {
        const tracks = $('<ol/>');
        trackList.tracks.map((track) => {
            const trackContent = $('<li/>', {
                class: 'track',
                id: `track-${ track.id }`,
                click: () => {
                    selectTrack(track, true);
                },
            });
            trackContent.text(track.name);
            tracks.append(trackContent);
        });
        const tracklistContent = $('<div>', { class: 'tracklist' });
        tracklistContent.append($('<h2>').text(trackList.name));
        tracklistContent.append(tracklistContent);
        tracklistContent.append(tracks);
        tracklistContent.appendTo('#music-content');
    });
}

function initBackground() {
  $('<img/>').attr('src', '/images/stars.png').on('load',
    function() {
      $(this).remove();
      $('#background-top').css('background-image', 'url(/images/stars.png)');
      $('#background-top').fadeIn(500);
      $('#background-bottom').css('background-image', 'url(/images/stars.png)');
      $('#background-bottom').fadeIn(500);
    });
}

function hideLoadingAndInitVisualization() {
  $('#loading').fadeOut(500);
  $('#wrapper').fadeIn(500);
  initVisualization();
}

$(window).on('load', function() {
  initBackground();

  buildTracklists(TRACKLISTS);
  selectTrack(DEFAULT_TRACK);

  initAudioAnalyser();

  hideLoadingAndInitVisualization();
});
