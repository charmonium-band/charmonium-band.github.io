/**
 *  Taken from https://github.com/dmitru/threejs-atom.
 */

function initVisualization() {
  var ww, wh;
  var renderer, scene, camera, world, material, controls;
  var opacityAnimation, pulseAnimations;
  var currentVolumeIsZero = true;
  var isFullscreen = false;
  var controlsShown = false;
  var sceneSavedMargin;
  var paused = false;

  var Config = {
    AUDIO_SENSITIVITY: { min: 0, max: 1.0, step: 0.001, value: 0.1 },
    AUDIO_AVERAGING: { min: 0, max: 1.0, step: 0.0001, value: 0.97 },

    LAYERS: { min: 1, max: 10, step: 1, value: 3 },
    N: { min: 10, max: 1500, step: 10, value: 230 },

    RADIUS: { min: 10, max: 500, step: 10, value: 210 },
    RADIUS_POWER: { min: 0.1, max: 3, step: 0.01, value: 0.49 },
    RADIUS_VARIABILITY: { min: 0.00, max: 2.0, step: 0.005, value: 0.08 },
    RADIUS_VARIABILITY_POWER: { min: 0.2, max: 4.0, step: 0.005, value: 0.805 },

    OPACITY: { min: 0.01, max: 0.5, step: 0.001, value: 0.184 },
    OPACITY_VARIABILITY: { min: 0.00, max: 2.0, step: 0.01, value: 0.2 },
    OPACITY_PULSE_PERIOD: { min: 0.1, max: 10, step: 0.01, value: 0.91 },
    OPACITY_PULSE_DEPTH: { min: 0.00, max: 1.0, step: 0.01, value: 0.43 },

    PULSE_DEPTH: { min: 0.00, max: 1.0, step: 0.001, value: 0.015 },
    PULSE_PERIOD: { min: 0.00, max: 20.0, step: 0.01, value: 0.96 },
    PULSE_VARIABILITY: { min: 0.00, max: 2.0, step: 0.01, value: 0.0 },

    ROTATION: { min: 0, max: 0.005, step: 0.00005, value: 0.0015 },

    JITTER_PROBABILITY: { min: 0, max: 1.0, step: 0.01, value: 0 },
    JITTER_INTENSITY: { min: 0, max: 1.0, step: 0.01, value: 0 },
  };

  function buildLayerConfigs(Config) {
    const layerConfigs = [];
    for (var layerIndex = 1; layerIndex <= Config.LAYERS.max; layerIndex += 1) {
      layerConfigs.push({
        rotX: layerIndex * Config.ROTATION.value * (layerIndex % 2 === 0 ? 1 : -1),
        rotY: layerIndex * Config.ROTATION.value * (layerIndex % 2 === 0 ? 1 : -1),
        rotZ: layerIndex * Config.ROTATION.value * (layerIndex % 2 === 0 ? 1 : -1),

        n: Config.N.value,

        radius: Config.RADIUS.value / Math.pow(layerIndex, Config.RADIUS_POWER.value),
        radiusVariability: Config.RADIUS_VARIABILITY.value / layerIndex,
        radiusVariabilityPower: Config.RADIUS_VARIABILITY_POWER.value,
      });
    }
    return layerConfigs;
  }

  var layerConfigs = buildLayerConfigs(Config);

  function onParametersChanged() {
    layerConfigs = buildLayerConfigs(Config);
    recreateScene();
  }

  function recreateScene() {
    if (scene) {
      scene.remove(world);
    }
    world = createWorld();
    scene.add(world);
  }

  function toggleControls() {
    if (controlsShown) {
      controls.animate({ opacity: 0 }, 150);
      setTimeout(function() { controls.css({ display: 'none' }); }, 150)
    } else {
      controls.css({ opacity: 0, display: 'block' })
        .animate({ opacity: 1 }, 150);
    }
    controlsShown = !controlsShown;
  }

  function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    const canvasHeight = $('#canvas').height();
    const screenHeight = $(window).height();

    if (isFullscreen) {
      $('.show-on-mouse-over-scene').animate({ opacity: 0 }, 1000);
      $('.hide-on-fullscreen').animate({ opacity: 0 }, 250);
      sceneSavedMargin = $('#scene').css('margin-top');
      $('#scene').animate({ 'margin-top': (screenHeight - canvasHeight) / 2 });
    } else {
      $('.hide-on-fullscreen').animate({ opacity: 1 }, 250);
      $('#scene').animate({ 'margin-top': sceneSavedMargin });
    }
  }

  function initControls() {
    controls = $('#controls');
    controls.click(function(e) { e.stopPropagation(); });
    $('#scene').mouseover(function(e) {
      if (!isFullscreen) {
        $('.show-on-mouse-over-scene').animate({ opacity: 0.3 }, 2000);
      }
    });
    $('#scene').mouseleave(function(e) {
      if (!isFullscreen) {
        $('.show-on-mouse-over-scene').animate({ opacity: 0 }, 250);
      }
    });
    $('#scene').click(function(e) {
        if (!e.altKey) {
          toggleFullscreen();
        } else {
          toggleControls();
        }
    });

    $(document).keyup(function(e) {
      if (e.keyCode === 27 && isFullscreen) {
        toggleFullscreen();
      }
    });

    _.keys(Config).map(function(key) {
      const keyConfig = Config[key];

      const label = $('<label>');
      const input = $('<input>')
        .attr(keyConfig)
        .attr('type', 'range')
        .on('change', function(e) {
          const value = parseFloat(e.target.value);
          Config[key].value = value;
          onParametersChanged();
        });
      label.append($('<div>').text(key));
      label.append(input);
      controls.append(label);
    });
  }

  function initScene() {
    ww = $('#scene').width();
    wh = $('#scene').height();

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: document.getElementById('canvas'),
      antialias: false,
    });
    renderer.setSize(ww, wh);
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, ww / wh, 20, 10000);
    camera.position.set(0, 0, 600);
    scene.add(camera);

    onParametersChanged();

    requestAnimationFrame(render);
    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {
    ww = $('#scene').width();
    wh = $('#scene').height();

    camera.aspect = ww / wh;
    camera.updateProjectionMatrix();

    renderer.setSize(ww, wh);
  }

  function createWorld() {
    function createEllipse({ material, radius, rotX, rotY, rotZ }) {
      var curve = new THREE.EllipseCurve(
        0,  0,            // ax, aY
        radius, radius,   // xRadius, yRadius
        0,  2 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
      );

      var path = new THREE.Path(curve.getPoints(20));
      var geometry = path.createPointsGeometry(20);
      _.forEach(geometry.vertices, function(v) {
        v.xOriginal = v.x;
        v.yOriginal = v.y;
        v.zOriginal = v.z;
      });

      // Create the final Object3d to add to the scene
      var ellipse = new THREE.Line(geometry, material);
      ellipse.rotation.x = rotX;
      ellipse.rotation.y = rotY;
      ellipse.rotation.z = rotZ;

      return ellipse;
    }

    function createLayer({
      material, n, radius, radiusVariability, radiusVariabilityPower
    }) {
      const sphere = new THREE.Object3D();
      for (var i = 0; i < Config.N.value; ++i) {
        const rotX = 2 * (Math.random() - 0.5) * Math.PI;
        const rotY = 2 * (Math.random() - 0.5) * Math.PI;
        const rotZ = 2 * (Math.random() - 0.5) * Math.PI;
        const r = radius +
          Math.pow(radius * radiusVariability * Math.random(), radiusVariabilityPower) *
          (Math.random() > 0.5 ? 1 : -1);
        sphere.add(createEllipse({ material, radius: r, rotX, rotY, rotZ }));
      }

      return sphere;
    }

    material = new THREE.MeshBasicMaterial({
      color: 'white',
      fog: true,
      opacity: Config.OPACITY.value,
      transparent: true,
      depthWrite: false,
    });
    material.baseOpacity = Config.OPACITY.value;

    const maxOpacity = Config.OPACITY.value *
      (1.0 + Config.OPACITY_PULSE_DEPTH.value + Math.random() * Config.OPACITY_VARIABILITY.value);
    opacityAnimation = TweenMax.to(material, Config.OPACITY_PULSE_PERIOD.value, {
      baseOpacity: maxOpacity,
      repeat: -1,
      yoyo: true,
      ease: Power2.easeIn,
    });

    world = new THREE.Object3D();
    pulseAnimations = [];
    for (var layerIndex = 0; layerIndex < Config.LAYERS.value; ++layerIndex) {
      const layerConfig = layerConfigs[layerIndex];
      const layer = createLayer(Object.assign({ material }, layerConfig));

      const pulsePeriod = Config.PULSE_PERIOD.value *
        (1.0 + Math.random() * Config.PULSE_VARIABILITY.value);
      const pulseDepth = Config.PULSE_DEPTH.value *
        (1.0 + Math.random() * Config.PULSE_VARIABILITY.value);
      layer.scaleFactor = 0.0;
      pulseAnimations.push(
        TweenMax.to(layer, pulsePeriod, {
          scaleFactor: pulseDepth,
          repeat: -1,
          yoyo: true,
          ease: Power3.easeIn,
        })
      );

      world.add(layer);
    }

    return world;
  }

  function render() {
    requestAnimationFrame(render);
    if (paused) {
        return;
    }

    const currentVolume = window.currentVolume || 0.0;
    const silenceTreshold = 0.01;

    if (currentVolume < silenceTreshold && !currentVolumeIsZero) {
      // When the music stops, play the default pulsing animations
      currentVolumeIsZero = true;
        if (opacityAnimation) {
          opacityAnimation.play();
        }
        if (pulseAnimations) {
          _.forEach(pulseAnimations, (pa) => pa.play());
        }
    } else if (currentVolume > silenceTreshold && currentVolumeIsZero) {
      // When the music is plays, pause the default pulsing animations
      currentVolumeIsZero = false;
      if (opacityAnimation) {
        opacityAnimation.pause();
      }
      if (pulseAnimations) {
        _.forEach(pulseAnimations, (pa) => pa.pause());
      }
    }

    _.forEach(world.children, function(layer, index) {
      const layerConfig = layerConfigs[index];
      layer.rotation.x += layerConfig.rotX;
      layer.rotation.y += layerConfig.rotY;
      layer.rotation.z += layerConfig.rotZ;

      layer.scale.set(
        1.0 * (1.0 + layer.scaleFactor +
          Config.AUDIO_SENSITIVITY.value * currentVolume),
        1.0 * (1.0 + layer.scaleFactor +
          Config.AUDIO_SENSITIVITY.value * currentVolume),
        1.0 * (1.0 + layer.scaleFactor +
          Config.AUDIO_SENSITIVITY.value * currentVolume)
      );

      material.opacity =
        material.baseOpacity *
        (0.8 + 8 * Config.AUDIO_SENSITIVITY.value * currentVolume);
    });

    renderer.render(scene, camera);
  }

  function initVisibilityStateListener() {
      var hidden, visibilityChange;
      if (typeof document.hidden !== 'undefined') {
        hidden = 'hidden';
        visibilityChange = 'visibilitychange';
      } else if (typeof document.msHidden !== 'undefined') {
        hidden = 'msHidden';
        visibilityChange = 'msvisibilitychange';
      } else if (typeof document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden';
        visibilityChange = 'webkitvisibilitychange';
      }

      var videoElement = document.getElementById('videoElement');

      function handleVisibilityChange() {
        if (document[hidden]) {
          paused = true;
        } else {
          paused = false;
        }
      }

      document.addEventListener(visibilityChange, handleVisibilityChange, false);
  }

  initScene();
  initControls();
  initVisibilityStateListener();
}
