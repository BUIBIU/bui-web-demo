import Vector3 from "./Vector3.js";
import * as Render from "./Render.js";

var angle = 200;
var render = new Render.Render();
var Ball1 = new Render.Ball(new Vector3(0, 2, 2), 2);
Ball1.materialData.diffusion = new Vector3(0, 0, 0);
Ball1.materialData.specular = new Vector3(1, 1, 1);
Ball1.materialData.smoothness = new Vector3(1, 0, 0);
render.entitys.push(Ball1);

var Ball2 = new Render.Ball(new Vector3(0, -2, 2), 2);
Ball2.materialData.diffusion = new Vector3(0, 0, 0);
Ball2.materialData.specular = new Vector3(1, 1, 1);
Ball2.materialData.smoothness = new Vector3(0, 1, 0);
Ball2.materialData.specularK = 100;
render.entitys.push(Ball2);

var Ball3 = new Render.Ball(new Vector3(-Math.sqrt(3) * 2, 0, 2), 2);
Ball3.materialData.diffusion = new Vector3(0, 0, 0);
Ball3.materialData.specular = new Vector3(1, 1, 1);
Ball3.materialData.smoothness = new Vector3(0, 0, 1);
Ball3.materialData.specularK = 200;
render.entitys.push(Ball3);

var Ball4 = new Render.Ball(
  new Vector3(-2 / Math.sqrt(3), 0, Math.sqrt(32 / 3) + 2),
  2
);
Ball4.materialData.diffusion = new Vector3(0, 0, 0);
Ball4.materialData.smoothness = new Vector3(1, 1, 1);
Ball4.materialData.specularK = 200;
render.entitys.push(Ball4);

let floor = new Render.Wall(new Vector3(0, 0, 0), new Vector3(0, 0, 1));
floor.materialData.diffusion = new Vector3(0.5, 0.5, 0.5);
// floor.materialData.diffusion = new Vector3(0, 0, 0)
floor.materialData.smoothness = new Vector3(0.5, 0.5, 0.5);
render.entitys.push(floor);

// let triangle = new Render.Triangle(new Vector3(0, -2, 0), new Vector3(0, -2, 4), new Vector3(0, 2, 4))
// triangle.materialData.smoothness = new Vector3(1, 0, 0)
// triangle.materialData.diffusion = new Vector3(0, 0, 0)
// render.entitys.push(triangle)
// let triangle2 = new Render.Triangle(new Vector3(0, -2, 0), new Vector3(0, 2, 4), new Vector3(0.001, -2, 4))
// triangle2.materialData.smoothness = new Vector3(1, 0, 0)
// // triangle2.materialData.smoothness = new Vector3(0.5, 0.5, 0.5)
// render.entitys.push(triangle2)

// render.entitys.push(...getBox(new Vector3(4.5, 0, 0.5), new Vector3(1, 10, 1)))
// render.entitys.push(...getBox(new Vector3(-4.5, 0, 0.5), new Vector3(1, 10, 1)))
// render.entitys.push(...getBox(new Vector3(0,4.5, 0.5), new Vector3(10, 1, 1)))
// render.entitys.push(...getBox(new Vector3(0, -4.5, 0.5), new Vector3(10, 1, 1)))
// render.entitys.push(...getBox(new Vector3(4.5, 0, 9.5), new Vector3(1, 10, 1)))
// render.entitys.push(...getBox(new Vector3(-4.5, 0, 9.5), new Vector3(1, 10, 1)))
// render.entitys.push(...getBox(new Vector3(0,4.5, 9.5), new Vector3(10, 1, 1)))
// render.entitys.push(...getBox(new Vector3(0, -4.5, 9.5), new Vector3(10, 1, 1)))
// render.entitys.push(...getBox(new Vector3(4.5, 4.5, 5), new Vector3(1, 1, 10)))
// render.entitys.push(...getBox(new Vector3(4.5, -4.5, 5), new Vector3(1, 1, 10)))
// render.entitys.push(...getBox(new Vector3(-4.5, 4.5, 5), new Vector3(1, 1, 10)))
// render.entitys.push(...getBox(new Vector3(-4.5, -4.5, 5), new Vector3(1, 1, 10)))

// render.entitys.push(...getBox(new Vector3(0, 0, 2.5), new Vector3(5, 5, 5), {
//     smoothness: new Vector3(0, 0, 0),
//     diffusion: new Vector3(1, 0, 0)
// }))

render.lights.push(
  new Render.PointLight(new Vector3(-20, 10, 40), new Vector3(200, 200, 200))
);
// render.lights.push(new Render.PointLight(new Vector3(0, 12, 10), new Vector3(0, 200, 0)))
// render.lights.push(new Render.PointLight(new Vector3(0, 8, 10), new Vector3(0, 0, 200)))
// render.lights.push(new Render.PointLight(new Vector3(5, 10, 10),new Vector3(200, 200, 200)))
window.onload = () => {
  let canvas = document.getElementById("canvas");

  canvas.addEventListener("mousedown", (e) => {
    if (mouseControll) {
      if (e.button == 0) {
        document.exitPointerLock();
        mouseControll = false;
      }
    } else {
      canvas
        .requestPointerLock()
        .then((e) => {
          mouseControll = true;
        })
        .catch((e) => {});
    }
  });
  canvas.addEventListener("mousemove", (e) => {
    if (mouseControll) {
      viewAngle.pitch += -e.movementY / 5;
      if (viewAngle.pitch > 90) {
        viewAngle.pitch = 90;
      }
      if (viewAngle.pitch < -90) {
        viewAngle.pitch = -90;
      }
      viewAngle.yaw += e.movementX / 5;
    }
  });
  canvas.addEventListener("mousedown", (e) => {});
  document.addEventListener("pointerlockchange", (event) => {
    console.log(event);
    // if (mouseControll) {
    //   mouseControll = false;
    // }
  });
  document.addEventListener("keypress", (e) => {
    console.log(e);
    if (mouseControll) {
      let dir = angleToDir(viewAngle);
      let right = dir.cross(new Vector3(0, 0, 1));
      switch (e.key) {
        case "w":
          render.camera.pos.add(dir);
          break;
        case "s":
          render.camera.pos.sub(dir);
          break;
        case "a":
          render.camera.pos.add(right);
          break;
        case "d":
          render.camera.pos.sub(right);
          break;
        case " ":
          render.camera.pos.add(new Vector3(0, 0, 1));
          break;
        case "c":
          render.camera.pos.add(new Vector3(0, 0, -1));
          break;
      }
    }
  });

  canvas.height = 200;
  canvas.width = 200;
  render.bindCanvas(canvas);
  window.requestAnimationFrame(renderImage);
};

function renderImage() {
  angle += 1;
  let x = Math.cos((angle / 180) * Math.PI) * 15;
  let y = Math.sin((angle / 180) * Math.PI) * 15;
  // let center = new Vector3(-2 / Math.sqrt(3), 0, 0)
  let center = new Vector3(0, 0, 0);
  let pos = new Vector3(x, y, 20);
  pos.add(center);
  // console.log(pos);
  // let pos = new Vector3(-10,0,5)
  let dir = center.sub(pos, true);
  dir.normalize();
  render.camera.pos = pos;
  render.camera.forward = dir;
  render.startRender();
  window.requestAnimationFrame(renderImage);
}
let mouseControll = false;
let viewAngle = {
  pitch: -50,
  yaw: -140,
};
let pos = new Vector3(10, 10, 20);
render.camera.pos = pos;

function angleToDir(angle) {
  let pitch = (angle.pitch / 180) * Math.PI;
  let yaw = (angle.yaw / 180) * Math.PI;
  let z = Math.sin(pitch);
  let n = Math.cos(pitch);
  let x = Math.cos(yaw) * n;
  let y = Math.sin(yaw) * n;
  return new Vector3(x, y, z);
}

// function renderImage() {
//   let dir = angleToDir(viewAngle);
//   dir.normalize();
//   render.camera.forward = dir;
//   render.startRender();
//   window.requestAnimationFrame(renderImage);
// }

function getBox(pos, _size, materialData) {
  let size = _size.dev(2, true);
  let sizeX = size.x;
  let sizeY = size.y;
  let sizeZ = size.z;
  let points = [];
  points.push(pos.add(new Vector3(sizeX, sizeY, -sizeZ), true));
  points.push(pos.add(new Vector3(sizeX, -sizeY, -sizeZ), true));
  points.push(pos.add(new Vector3(-sizeX, -sizeY, -sizeZ), true));
  points.push(pos.add(new Vector3(-sizeX, sizeY, -sizeZ), true));
  points.push(pos.add(new Vector3(sizeX, sizeY, sizeZ), true));
  points.push(pos.add(new Vector3(sizeX, -sizeY, sizeZ), true));
  points.push(pos.add(new Vector3(-sizeX, -sizeY, sizeZ), true));
  points.push(pos.add(new Vector3(-sizeX, sizeY, sizeZ), true));
  let planes = [];
  planes.push(
    [4, 5, 0],
    [1, 0, 5],
    [5, 6, 1],
    [2, 1, 6],
    [6, 7, 2],
    [3, 2, 7],
    [7, 4, 3],
    [0, 3, 4],
    [6, 5, 7],
    [4, 7, 5],
    [3, 0, 2],
    [1, 2, 0]
  );
  let triangles = [];
  planes.forEach((plane) => {
    let triangle = new Render.Triangle(
      points[plane[1]],
      points[plane[2]],
      points[plane[0]]
    );
    triangle.materialData.smoothness = materialData.smoothness;
    triangle.materialData.diffusion = materialData.diffusion;
    triangles.push(triangle);
  });
  return triangles;
}
