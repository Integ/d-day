'use strict';

var userCount, userData, table, camera, scene, renderer;
var controls;

var objects = [];
var targets = {
    table: [],
    sphere: [],
    helix: [],
    grid: []
};


function init() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 3000;

    scene = new THREE.Scene();
    // table

    for (var i = 0; i < table.length; i += 5) {

        var element = document.createElement('div');
        element.className = 'element';
        element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

        var number = document.createElement('div');
        number.className = 'number';
        number.textContent = (i / 5) + 1;
        element.appendChild(number);

        var symbol = document.createElement('div');
        symbol.className = 'symbol';
        symbol.textContent = table[i];
        element.appendChild(symbol);

        var avatar = document.createElement('img');
        avatar.className = 'avatar';
        if(table[i + 2].indexOf('http://') !== 0) {
            avatar.src = 'http://' + table[i + 2];
        } else {
            avatar.src = table[i + 2];
        }
        element.appendChild(avatar);

        var details = document.createElement('div');
        details.className = 'details';
        details.innerHTML = table[i + 1];
        element.appendChild(details);

        //$(element).data('px', (table[i + 3] * 140) - 1330);
        //$(element).data('py', -(table[i + 4] * 140) + 990);

        var object = new THREE.CSS3DObject(element);
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        scene.add(object);

        objects.push(object);

        var object = new THREE.Object3D();
        object.position.x = (table[i + 3] * 140) - 1230;
        object.position.y = -(table[i + 4] * 140) + 990;

        targets.table.push(object);

    }

    // sphere

    var vector = new THREE.Vector3();

    for (var i = 0, l = objects.length; i < l; i++) {

        var phi = Math.acos(-1 + (2 * i) / l);
        var theta = Math.sqrt(l * Math.PI) * phi;

        var object = new THREE.Object3D();

        object.position.x = 1000 * Math.cos(theta) * Math.sin(phi);
        object.position.y = 1000 * Math.sin(theta) * Math.sin(phi);
        object.position.z = 1000 * Math.cos(phi);

        vector.copy(object.position).multiplyScalar(2);

        object.lookAt(vector);

        targets.sphere.push(object);

    }

    // helix

    var vector = new THREE.Vector3();

    for (var i = 0, l = objects.length; i < l; i++) {

        var phi = i * 0.175 + Math.PI;

        var object = new THREE.Object3D();

        object.position.x = 900 * Math.sin(phi);
        object.position.y = -(i * 8) + 1000;
        object.position.z = 900 * Math.cos(phi);

        vector.x = object.position.x * 2;
        vector.y = object.position.y;
        vector.z = object.position.z * 2;

        object.lookAt(vector);

        targets.helix.push(object);

    }

    // grid

    for (var i = 0; i < objects.length; i++) {

        var object = new THREE.Object3D();

        object.position.x = ((i % 7) * 400) - 1000;
        object.position.y = (-(Math.floor(i / 7) % 7) * 400) + 800;
        object.position.z = (Math.floor(i / 49)) * 1000 - 2000;

        targets.grid.push(object);

    }

    //

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    document.getElementById('container').appendChild(renderer.domElement);

    //

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;
    controls.minDistance = 500;
    controls.maxDistance = 7500;
    controls.addEventListener('change', render);

    var button = document.getElementById('shuffle');
    button.addEventListener('click', function(event) {
        var flag = Math.floor( Math.random()*3);
        switch(flag) {
            case 0:
                transform(targets.sphere, 2000);    //变球
                break;
            case 1:
                transform(targets.helix, 2000); //  环带
                break;
            case 2:
                transform(targets.grid, 2000);  // 卡片
                break;
        }
        setTimeout(function() {
            transform(targets.table, 2000); // 还原
        }, 4000);

        setTimeout(function() {
            var lucker, luckers = [];
            for(var i=0; i<3; i++) {
                lucker = Math.floor(Math.random() * userCount) - 1;
                luckers.push(lucker);
            }
            console.log(luckers);
            $('#container .number').each(function() {
                var $ele = $(this).parent('.element');
                if(luckers.indexOf( ~~$(this).text() ) === -1) {
                    $ele.fadeOut(2000);
                } else {
                    $(this).siblings('.symbol').fadeIn(2000, function() {
                        $ele.addClass('big');
                    });
                }
            });
        }, 6000);
    }, false);

    $('#reset').click(function() {
        $('.element').removeClass('big').show();
        $('.symbol').hide();
    });

    transform(targets.table, 5000);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function transform(targets, duration) {

    TWEEN.removeAll();

    for (var i = 0; i < objects.length; i++) {

        var object = objects[i];
        var target = targets[i];

        new TWEEN.Tween(object.position)
            .to({
                x: target.position.x,
                y: target.position.y,
                z: target.position.z
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        new TWEEN.Tween(object.rotation)
            .to({
                x: target.rotation.x,
                y: target.rotation.y,
                z: target.rotation.z
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

    }

    new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(render)
        .start();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();

}

function animate() {

    requestAnimationFrame(animate);

    TWEEN.update();

    controls.update();

}

function render() {

    renderer.render(scene, camera);

}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        sendResponse({status: "OK"});
        console.log(sender.tab ?
            "来自内容脚本：" + sender.tab.url :
            "来自扩展程序");

        userData = request.data;
        userCount = userData.length;
        table = [];
        userData.forEach(function(item) {
            item.forEach(function(i) {
                table.push(i);
            });
        });
        init();
        animate();
    }
);
