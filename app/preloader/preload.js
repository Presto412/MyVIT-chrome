(function preload() {
    if($('#preLoader,#preBody').length)
        return;
    let colors=['#6a1b9a','#ad1457','#ff5252','#283593','#00695c','#9e9d24','#00e5ff','#3d5afe','#d84315','#558b2f'];
    let loaders=[
        `<style type="text/css">.preload-contain{position:absolute;width:100%;top:50%;transform:translateY(-50%)}.sk-chasing-dots { margin: 40px auto; width: 90px; height: 90px; position: relative; text-align: center; -webkit-animation: sk-chasingDotsRotate 2s infinite linear; animation: sk-chasingDotsRotate 2s infinite linear; } .sk-chasing-dots .sk-child { width: 60%; height: 60%; display: inline-block; position: absolute; top: 0; background-color: ${colors[Math.floor(Math.random()*(colors.length))]}; border-radius: 100%; -webkit-animation: sk-chasingDotsBounce 2s infinite ease-in-out; animation: sk-chasingDotsBounce 2s infinite ease-in-out; } .sk-chasing-dots .sk-dot2 { top: auto; bottom: 0; -webkit-animation-delay: -1s; animation-delay: -1s; } @-webkit-keyframes sk-chasingDotsRotate { 100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); } } @keyframes sk-chasingDotsRotate { 100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); } } @-webkit-keyframes sk-chasingDotsBounce { 0%, 100% { -webkit-transform: scale(0); transform: scale(0); } 50% { -webkit-transform: scale(1); transform: scale(1); } } @keyframes sk-chasingDotsBounce { 0%, 100% { -webkit-transform: scale(0); transform: scale(0); } 50% { -webkit-transform: scale(1); transform: scale(1); } } </style><div class="preload-contain"><div class="sk-chasing-dots"> <div class="sk-child sk-dot1"></div> <div class="sk-child sk-dot2"></div> </div></div>`,
        `<style type="text/css">.preload-contain{position:absolute;width:100%;top:50%;transform:translateY(-50%)}.sk-double-bounce { width: 90px; height: 90px; position: relative; margin: 40px auto; } .sk-double-bounce .sk-child { width: 100%; height: 100%; border-radius: 50%; background-color: ${colors[Math.floor(Math.random()*(colors.length))]}; opacity: 0.6; position: absolute; top: 0; left: 0; -webkit-animation: sk-doubleBounce 2s infinite ease-in-out; animation: sk-doubleBounce 2s infinite ease-in-out; } .sk-double-bounce .sk-double-bounce2 { -webkit-animation-delay: -1.0s; animation-delay: -1.0s; } @-webkit-keyframes sk-doubleBounce { 0%, 100% { -webkit-transform: scale(0); transform: scale(0); } 50% { -webkit-transform: scale(1); transform: scale(1); } } @keyframes sk-doubleBounce { 0%, 100% { -webkit-transform: scale(0); transform: scale(0); } 50% { -webkit-transform: scale(1); transform: scale(1); } } </style> <div class="preload-contain"> <div class="sk-double-bounce"> <div class="sk-child sk-double-bounce1"></div> <div class="sk-child sk-double-bounce2"></div> </div> </div>`,
        `<style type="text/css">.preload-contain{position:absolute;width:100%;top:50%;transform:translateY(-50%)} .sk-three-bounce { margin: 40px auto; width: 160px; text-align: center; } .sk-three-bounce .sk-child { width: 40px; height: 40px; background-color: ${colors[Math.floor(Math.random()*(colors.length))]}; border-radius: 100%; display: inline-block; -webkit-animation: sk-three-bounce 1.4s ease-in-out 0s infinite both; animation: sk-three-bounce 1.4s ease-in-out 0s infinite both; } .sk-three-bounce .sk-bounce1 { -webkit-animation-delay: -0.32s; animation-delay: -0.32s; } .sk-three-bounce .sk-bounce2 { -webkit-animation-delay: -0.16s; animation-delay: -0.16s; } @-webkit-keyframes sk-three-bounce { 0%, 80%, 100% { -webkit-transform: scale(0); transform: scale(0); } 40% { -webkit-transform: scale(1); transform: scale(1); } } @keyframes sk-three-bounce { 0%, 80%, 100% { -webkit-transform: scale(0); transform: scale(0); } 40% { -webkit-transform: scale(1); transform: scale(1); } } </style> <div class="preload-contain"> <div class="sk-three-bounce"> <div class="sk-child sk-bounce1"></div> <div class="sk-child sk-bounce2"></div> <div class="sk-child sk-bounce3"></div> </div> </div>`,
        `<style type="text/css">.preload-contain{position:absolute;width:100%;top:50%;transform:translateY(-50%)} .sk-rotating-plane { width: 90px; height: 90px; background-color: ${colors[Math.floor(Math.random()*(colors.length))]};margin: 40px auto; -webkit-animation: sk-rotatePlane 1.2s infinite ease-in-out; animation: sk-rotatePlane 1.2s infinite ease-in-out; } @-webkit-keyframes sk-rotatePlane { 0% { -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg); transform: perspective(120px) rotateX(0deg) rotateY(0deg); } 50% { -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg); transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg); } 100% { -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg); transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg); } } @keyframes sk-rotatePlane { 0% { -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg); transform: perspective(120px) rotateX(0deg) rotateY(0deg); } 50% { -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg); transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg); } 100% { -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg); transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg); } } </style> <div class="preload-contain"> <div class="sk-rotating-plane"></div> </div>`,
        `<style type="text/css">.preload-contain{position:absolute;width:100%;top:50%;transform:translateY(-50%)}.sk-cube-grid { width: 90px; height: 90px; margin: 40px auto; } .sk-cube-grid .sk-cube { width: 33.33%; height: 33.33%; background-color: ${colors[Math.floor(Math.random()*(colors.length))]}; float: left; -webkit-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out; animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out; } .sk-cube-grid .sk-cube1 { -webkit-animation-delay: 0.2s; animation-delay: 0.2s; } .sk-cube-grid .sk-cube2 { -webkit-animation-delay: 0.3s; animation-delay: 0.3s; } .sk-cube-grid .sk-cube3 { -webkit-animation-delay: 0.4s; animation-delay: 0.4s; } .sk-cube-grid .sk-cube4 { -webkit-animation-delay: 0.1s; animation-delay: 0.1s; } .sk-cube-grid .sk-cube5 { -webkit-animation-delay: 0.2s; animation-delay: 0.2s; } .sk-cube-grid .sk-cube6 { -webkit-animation-delay: 0.3s; animation-delay: 0.3s; } .sk-cube-grid .sk-cube7 { -webkit-animation-delay: 0.0s; animation-delay: 0.0s; } .sk-cube-grid .sk-cube8 { -webkit-animation-delay: 0.1s; animation-delay: 0.1s; } .sk-cube-grid .sk-cube9 { -webkit-animation-delay: 0.2s; animation-delay: 0.2s; } @-webkit-keyframes sk-cubeGridScaleDelay { 0%, 70%, 100% { -webkit-transform: scale3D(1, 1, 1); transform: scale3D(1, 1, 1); } 35% { -webkit-transform: scale3D(0, 0, 1); transform: scale3D(0, 0, 1); } } @keyframes sk-cubeGridScaleDelay { 0%, 70%, 100% { -webkit-transform: scale3D(1, 1, 1); transform: scale3D(1, 1, 1); } 35% { -webkit-transform: scale3D(0, 0, 1); transform: scale3D(0, 0, 1); } } </style> <div class="preload-contain"> <div class="sk-cube-grid"> <div class="sk-cube sk-cube1"></div> <div class="sk-cube sk-cube2"></div> <div class="sk-cube sk-cube3"></div> <div class="sk-cube sk-cube4"></div> <div class="sk-cube sk-cube5"></div> <div class="sk-cube sk-cube6"></div> <div class="sk-cube sk-cube7"></div> <div class="sk-cube sk-cube8"></div> <div class="sk-cube sk-cube9"></div> </div> </div>`

    ];
    $('body').eq(-1).append(`<div id="preLoader" style="margin: 0;height: 100vh;width: 100vw;position: absolute;top: 0;left: 0;z-index: 1000;background: none white;overflow: hidden;">${loaders[Math.floor(Math.random()*(loaders.length))]}</div>`);
    console.log('Preloaded !');
})();