"use strict";function selectTrack(e){var a=arguments.length>1&&void 0!==arguments[1]&&arguments[1],t=e.id,n=e.name,i=e.src,r=e.artSrc,o=r||"/music/art/charmonium-logo.jpg";currentTrack=e;var c=$("#player source");c.attr("src",i),$("#current-track-name").text(n),$(".track").removeClass("current"),$("#track-art").fadeOut(250),setTimeout(function(){$("#track-art").attr("src",o)},250),$("#track-art").on("load",function(){$(this).fadeIn(250)}),$("#music-content ol").removeClass("current"),$("#track-"+t).addClass("current"),$("#track-"+t).parent().addClass("current"),$("#player").get(0).load(),a&&$("#player").get(0).play()}function buildTracklists(e){e.map(function(e){var a=$("<ol/>");e.tracks.map(function(e){var t=$("<li/>",{class:"track",id:"track-"+e.id,click:function(){selectTrack(e,!0)}});t.text(e.name),a.append(t)});var t=$("<div>",{class:"tracklist"});t.append($("<h2>").text(e.name)),t.append(t),t.append(a),t.appendTo("#music-content")})}function initBackground(){$("<img/>").attr("src","/images/stars.png").on("load",function(){$(this).remove(),$("#background-top").css("background-image","url(/images/stars.png)"),$("#background-top").fadeIn(500),$("#background-bottom").css("background-image","url(/images/stars.png)"),$("#background-bottom").fadeIn(500)})}function hideLoadingAndInitVisualization(){$("#loading").fadeOut(500),$("#wrapper").fadeIn(500),initVisualization()}function initAudioAnalyser(){function e(){var a=new Uint8Array(window.analyser.frequencyBinCount);window.analyser.getByteFrequencyData(a);for(var t=0,n=0;n<a.length;n++){var i=parseFloat(a[n]);t+=i*i}t=Math.sqrt(t/a.length),t/=100,window.currentVolume=Math.max(t,window.currentVolume*window.averaging),requestAnimationFrame(e)}if(window.currentVolume=0,window.AudioContext?window.context=new window.AudioContext:window.webkitAudioContext&&(window.context=new window.webkitAudioContext),!window.context)return void console.log("No support for WebAudio");var a=context.createMediaElementSource(document.getElementById("player")),t=context.createAnalyser();t.smoothingTimeConstant=.9,t.fftSize=512,a.connect(t),t.connect(context.destination),window.currentVolume=0,window.averaging=.97,window.analyser=t,e()}function initVisualization(){function e(e){for(var a=[],t=1;t<=e.LAYERS.max;t+=1)a.push({rotX:t*e.ROTATION.value*(t%2===0?1:-1),rotY:t*e.ROTATION.value*(t%2===0?1:-1),rotZ:t*e.ROTATION.value*(t%2===0?1:-1),n:e.N.value,radius:e.RADIUS.value/Math.pow(t,e.RADIUS_POWER.value),radiusVariability:e.RADIUS_VARIABILITY.value/t,radiusVariabilityPower:e.RADIUS_VARIABILITY_POWER.value});return a}function a(){P=e(k),t()}function t(){v&&v.remove(T),T=s(),v.add(T)}function n(){S?(w.animate({opacity:0},150),setTimeout(function(){w.css({display:"none"})},150)):w.css({opacity:0,display:"block"}).animate({opacity:1},150),S=!S}function i(){y=!y;var e=$("#canvas").height(),a=$(window).height();y?($(".show-on-mouse-over-scene").animate({opacity:0},1e3),$(".hide-on-fullscreen").animate({opacity:0},250),setTimeout(function(){return $(".hide-on-fullscreen").css("display","none")},250),h=$("#scene").css("margin-top"),$("#scene").animate({"margin-top":(a-e)/2})):($(".hide-on-fullscreen").animate({opacity:1},250),$(".hide-on-fullscreen").css("display","block"),$("#scene").animate({"margin-top":h}))}function r(){w=$("#controls"),w.click(function(e){e.stopPropagation()}),$("#scene").mouseover(function(e){y||$(".show-on-mouse-over-scene").animate({opacity:.3},2e3)}),$("#scene").mouseleave(function(e){y||$(".show-on-mouse-over-scene").animate({opacity:0},250)}),$("#scene").click(function(e){e.altKey?n():i()}),$(document).keyup(function(e){27===e.keyCode&&y&&i()}),_.keys(k).map(function(e){var t=k[e],n=$("<label>"),i=$("<input>").attr(t).attr("type","range").on("change",function(t){var n=parseFloat(t.target.value);k[e].value=n,a()});n.append($("<div>").text(e)),n.append(i),w.append(n)})}function o(){m=$("#scene").width(),l=$("#scene").height(),p=new THREE.WebGLRenderer({alpha:!0,canvas:document.getElementById("canvas"),antialias:!1}),p.setSize(m,l),p.setPixelRatio(window.devicePixelRatio?window.devicePixelRatio:1),v=new THREE.Scene,I=new THREE.PerspectiveCamera(50,m/l,20,1e4),I.position.set(0,0,600),v.add(I),a(),requestAnimationFrame(u),window.addEventListener("resize",c)}function c(){m=$("#scene").width(),l=$("#scene").height(),I.aspect=m/l,I.updateProjectionMatrix(),p.setSize(m,l)}function s(){function e(e){var a=e.material,t=e.radius,n=e.rotX,i=e.rotY,r=e.rotZ,o=new THREE.EllipseCurve(0,0,t,t,0,2*Math.PI,!1,0),c=new THREE.Path(o.getPoints(20)),s=c.createPointsGeometry(20);_.forEach(s.vertices,function(e){e.xOriginal=e.x,e.yOriginal=e.y,e.zOriginal=e.z});var u=new THREE.Line(s,a);return u.rotation.x=n,u.rotation.y=i,u.rotation.z=r,u}function a(a){for(var t=a.material,n=(a.n,a.radius),i=a.radiusVariability,r=a.radiusVariabilityPower,o=new THREE.Object3D,c=0;c<k.N.value;++c){var s=2*(Math.random()-.5)*Math.PI,u=2*(Math.random()-.5)*Math.PI,d=2*(Math.random()-.5)*Math.PI,m=n+Math.pow(n*i*Math.random(),r)*(Math.random()>.5?1:-1);o.add(e({material:t,radius:m,rotX:s,rotY:u,rotZ:d}))}return o}f=new THREE.MeshBasicMaterial({color:"white",fog:!0,opacity:k.OPACITY.value,transparent:!0,depthWrite:!1}),f.baseOpacity=k.OPACITY.value;var t=k.OPACITY.value*(1+k.OPACITY_PULSE_DEPTH.value+Math.random()*k.OPACITY_VARIABILITY.value);A=TweenMax.to(f,k.OPACITY_PULSE_PERIOD.value,{baseOpacity:t,repeat:-1,yoyo:!0,ease:Power2.easeIn}),T=new THREE.Object3D,g=[];for(var n=0;n<k.LAYERS.value;++n){var i=P[n],r=a(Object.assign({material:f},i)),o=k.PULSE_PERIOD.value*(1+Math.random()*k.PULSE_VARIABILITY.value),c=k.PULSE_DEPTH.value*(1+Math.random()*k.PULSE_VARIABILITY.value);r.scaleFactor=0,g.push(TweenMax.to(r,o,{scaleFactor:c,repeat:-1,yoyo:!0,ease:Power3.easeIn})),T.add(r)}return T}function u(){if(requestAnimationFrame(u),!R){var e=window.currentVolume||0,a=.01;e<a&&!E?(E=!0,A&&A.play(),g&&_.forEach(g,function(e){return e.play()})):e>a&&E&&(E=!1,A&&A.pause(),g&&_.forEach(g,function(e){return e.pause()})),_.forEach(T.children,function(a,t){var n=P[t];a.rotation.x+=n.rotX,a.rotation.y+=n.rotY,a.rotation.z+=n.rotZ,a.scale.set(1*(1+a.scaleFactor+k.AUDIO_SENSITIVITY.value*e),1*(1+a.scaleFactor+k.AUDIO_SENSITIVITY.value*e),1*(1+a.scaleFactor+k.AUDIO_SENSITIVITY.value*e)),f.opacity=f.baseOpacity*(.8+8*k.AUDIO_SENSITIVITY.value*e)}),p.render(v,I)}}function d(){function e(){R=!!document[a]}var a,t;"undefined"!=typeof document.hidden?(a="hidden",t="visibilitychange"):"undefined"!=typeof document.msHidden?(a="msHidden",t="msvisibilitychange"):"undefined"!=typeof document.webkitHidden&&(a="webkitHidden",t="webkitvisibilitychange");document.getElementById("videoElement");document.addEventListener(t,e,!1)}var m,l,p,v,I,T,f,w,A,g,h,E=!0,y=!1,S=!1,R=!1,k={AUDIO_SENSITIVITY:{min:0,max:1,step:.001,value:.1},AUDIO_AVERAGING:{min:0,max:1,step:1e-4,value:.97},LAYERS:{min:1,max:10,step:1,value:3},N:{min:10,max:1500,step:10,value:230},RADIUS:{min:10,max:500,step:10,value:210},RADIUS_POWER:{min:.1,max:3,step:.01,value:.49},RADIUS_VARIABILITY:{min:0,max:2,step:.005,value:.08},RADIUS_VARIABILITY_POWER:{min:.2,max:4,step:.005,value:.805},OPACITY:{min:.01,max:.5,step:.001,value:.184},OPACITY_VARIABILITY:{min:0,max:2,step:.01,value:.2},OPACITY_PULSE_PERIOD:{min:.1,max:10,step:.01,value:.91},OPACITY_PULSE_DEPTH:{min:0,max:1,step:.01,value:.43},PULSE_DEPTH:{min:0,max:1,step:.001,value:.015},PULSE_PERIOD:{min:0,max:20,step:.01,value:.96},PULSE_VARIABILITY:{min:0,max:2,step:.01,value:0},ROTATION:{min:0,max:.005,step:5e-5,value:.0015},JITTER_PROBABILITY:{min:0,max:1,step:.01,value:0},JITTER_INTENSITY:{min:0,max:1,step:.01,value:0}},P=e(k);o(),r(),d()}var TRACKLISTS=[{name:"Recent Work",tracks:[{id:"everlasting-lights",name:"Everlasting Lights",src:"/music/everlasting-lights.mp3",artSrc:"/music/art/everlasting-lights.jpg"},{id:"dark-matter",name:"Dark Matter",src:"/music/dark-matter.mp3",artSrc:"/music/art/dark-matter.jpg"},{id:"space-dance",name:"Space Dance",src:"/music/space-dance.mp3",artSrc:"/music/art/space-dance.jpg"}]},{name:"Solar Wind",tracks:[{id:"mondreise",name:"Mondreise",src:"/music/mondreise.mp3",artSrc:"/music/art/mondreise.jpg"},{id:"beyond-return",name:"Beyond Return",src:"/music/beyond-return.mp3"},{id:"stardive",name:"Stardive",src:"/music/stardive.mp3",artSrc:"/music/art/stardive.jpg"},{id:"lunar-fields",name:"Lunar Fields",src:"/music/lunar-fields.mp3",artSrc:"/music/art/lunar-fields.jpg"},{id:"three-sided-truth",name:"Three-Sided Truth",src:"/music/three-sided-truth.mp3"}]},{name:"Jams / Others",tracks:[{id:"jam-in-d",name:"Spacerock Jam in D",src:"/music/jam-in-d.mp3",artSrc:"/music/art/jam-in-d.jpg"},{id:"funkturm-insomnia-jam",name:"Funkturm Insomnia Jam",src:"/music/funkturm-insomnia-jam.flac",artSrc:"/music/art/funkturm-jam.jpg"}]},{name:"Covers",tracks:[{id:"radioactive-toy",name:"Porcupine Tree - Radioactive Toy",src:"/music/radioactive-toy.mp3"}]}],DEFAULT_TRACK=TRACKLISTS[0].tracks[0],currentTrack=null;$(window).on("load",function(){initBackground(),buildTracklists(TRACKLISTS),selectTrack(DEFAULT_TRACK),initAudioAnalyser(),hideLoadingAndInitVisualization()});