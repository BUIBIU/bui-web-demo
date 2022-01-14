import Vector3 from "./Vector3.js";

export class Entity {
  constructor(materialData = null) {
    this.materialData = {
      // color: new Vector3(1, 1, 1),
      diffusion: new Vector3(1, 1, 1),
      specular: new Vector3(0, 0, 0),
      specularK: 10,
      smoothness: new Vector3(0, 0, 0),
    };
    if (materialData) {
      // if (materialData.color) {
      //     this.materialData.color = materialData.color
      // }
      if (materialData.diffusion) {
        this.materialData.diffusion = materialData.diffusion;
      }
      if (materialData.specular) {
        this.materialData.specular = materialData.specular;
      }
    }
  }
}

export class Wall extends Entity {
  constructor(pos, normal) {
    super();
    this.pos = pos;
    this.normal = normal.getNormalized();
  }
  isHit(startPos, direction) {
    let dir = direction.getNormalized();
    let dot = dir.dot(this.normal);
    // console.log(dot);
    if (dot >= 0) {
      return null;
    }
    let v = startPos.sub(this.pos, true);
    let k = -v.dot(this.normal) / dot;
    if (k < 0) {
      return null;
    }
    let hitPos = startPos.add(direction.mul(k, true), true);
    let hitPoint = {
      hitPos: hitPos,
      hitNormal: this.normal,
      hitEntity: this,
    };
    return [hitPoint];
  }
}

export class Triangle extends Entity {
  constructor(p0, p1, p2) {
    super();
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
  }
  isHit(startPos, direction) {
    let p0 = this.p0;
    let p1 = this.p1;
    let p2 = this.p2;
    let dir = direction.getNormalized();
    let T = startPos.sub(p0, true);
    let e1 = p1.sub(p0, true);
    let e2 = p2.sub(p0, true);
    let hitNormal = e1.cross(e2).getNormalized();
    if (hitNormal.dot(dir) >= 0) {
      return null;
    }
    let m = dir.cross(e2);
    let del = m.dot(e1);
    if (Math.abs(del) == 0) {
      return null;
    }
    let k = T.cross(e1);
    let t = k.dot(e2) / del;
    if (t <= 0) {
      return null;
    }
    let u = m.dot(T) / del;
    let v = k.dot(dir) / del;
    if (u < 0 || v < 0 || u + v > 1) {
      return null;
    }
    let q = startPos.add(dir.mul(t, true), true);
    let hitPoint = {
      hitPos: q,
      hitNormal: hitNormal,
      hitEntity: this,
    };
    return [hitPoint];
  }
}

export class Ball extends Entity {
  constructor(pos, radius) {
    super();
    this.pos = pos;
    this.radius = radius;
  }
  isHit(startPos, direction) {
    let HitPoint = [];
    let v1 = this.pos.sub(startPos, true);
    let dot = v1.dot(direction);
    let length = v1.length();
    if (dot > 0 && length > this.radius) {
      let v1 = direction.mul(dot, true);
      let l1 = v1.length();
      let v2 = v1.add(startPos, true);
      let v3 = v2.sub(this.pos, true);
      let l2 = v3.length();
      if (l2 <= this.radius) {
        let l3 = Math.sqrt(this.radius ** 2 - l2 ** 2);
        let hit1 = startPos.add(direction.mul(l1 - l3, true), true);
        let hit2 = startPos.add(direction.mul(l1 + l3, true), true);
        let hitNormal1 = hit1.sub(this.pos, true);
        hitNormal1.normalize();
        let hitNormal2 = hit2.sub(this.pos, true);
        hitNormal2.normalize();
        HitPoint.push({
          hitPos: hit1,
          hitNormal: hitNormal1,
          hitEntity: this,
        });
        HitPoint.push({
          hitPos: hit2,
          hitNormal: hitNormal2,
          hitEntity: this,
        });
        return HitPoint;
      }
    }
    return null;
  }
}

export class PointLight {
  constructor(pos, color) {
    this.pos = pos;
    this.color = color;
  }
}

export class Trace {
  constructor(startPos, direction, length = -1) {
    this.startPos = startPos;
    this.direction = direction.getNormalized();
    this.length = length;
    this.ignore = null;
  }
  getHit(entitys) {
    let minDistence = null;
    let firstHit = null;
    let length = entitys.length;
    for (let i = 0; i < length; i++) {
      const entity = entitys[i];
      if (this.ignore && entity == this.ignore) {
        continue;
      }
      let hitData = entity.isHit(this.startPos, this.direction);
      if (hitData) {
        let length = hitData.length;
        for (let i = 0; i < length; i++) {
          let hit = hitData[i];
          if (!firstHit) {
            let hitPos = hit.hitPos;
            let distence = hitPos.distance(this.startPos);
            if (this.length < 0 || distence <= this.length) {
              minDistence = distence;
              firstHit = hit;
            }
          }
          let distence = hit.hitPos.distance(this.startPos);
          if (
            (this.length < 0 || distence <= this.length) &&
            distence < minDistence
          ) {
            firstHit = hit;
            minDistence = distence;
          }
        }
      }
    }
    if (!firstHit) {
      return null;
    }
    return firstHit;
  }
}

export class Render {
  constructor() {
    this.entitys = [];
    this.lights = [];
    this.camera = {
      pos: new Vector3(0, 0, 0),
      forward: new Vector3(1, 0, 0),
      up: new Vector3(0, 0, 1),
      fovH: 70,
      fovV: 70,
    };
    this.camera.right = this.camera.up.cross(this.camera.forward);
    this.canvas = null;
    this.height = 0;
    this.width = 0;
  }
  bindCanvas(canvas) {
    this.canvas = canvas.getContext("2d");
    this.height = canvas.height;
    this.width = canvas.width;
    // console.log(this.width, this.height);
  }
  startRender() {
    const camera = this.camera;
    camera.right = camera.forward.cross(new Vector3(0, 0, -1));
    camera.up = camera.forward.cross(camera.right);
    let startYaw = -camera.fovH / 2;
    let startPitch = camera.fovV / 2;
    let dh = camera.fovH / this.width;
    let dv = camera.fovV / this.height;

    let imageData = this.canvas.getImageData(0, 0, this.width, this.height);
    for (let v = 0; v < this.height; v++) {
      let pitch = startPitch - dv * v;
      for (let h = 0; h < this.width; h++) {
        let yaw = startYaw + dh * h;
        let dir = new Vector3(0, 0, 0);

        dir.add(camera.forward.mul(70, true));
        dir.add(camera.up.mul(pitch, true));
        dir.add(camera.right.mul(yaw, true));
        dir.normalize();
        let color = this.getColor(camera.pos, dir, 4);
        Render.setpixel(imageData, this.width, h, v, {
          r: color.x,
          g: color.y,
          b: color.z,
          a: 255,
        });
      }
    }
    this.canvas.putImageData(imageData, 0, 0);
  }
  getColor(cameraPos, cameraDir, count) {
    let trace = new Trace(cameraPos, cameraDir);
    let hit = trace.getHit(this.entitys);
    let outColor = new Vector3(0, 0, 0);
    if (hit != null) {
      let materialData = hit.hitEntity.materialData;
      let smoothness = materialData.smoothness;
      let diffusion = materialData.diffusion;
      let specular = materialData.specular;
      let specularK = materialData.specularK;
      let length = this.lights.length;

      let dot2 = cameraDir.invert(true).dot(hit.hitNormal);
      let cameraReflex = cameraDir.add(hit.hitNormal.mul(dot2 * 2, true), true);

      for (let i = 0; i < length; i++) {
        let light = this.lights[i];
        let lightTo = hit.hitPos.sub(light.pos, true);
        let lightLength = lightTo.length();
        lightTo.normalize();
        let lightFrom = lightTo.invert(true);
        trace.startPos = hit.hitPos;
        trace.direction = lightFrom;
        trace.length = lightLength;
        // trace.ignore = hit.hitEntity
        let lightRay = trace.getHit(this.entitys);
        let c = new Vector3(0, 0, 0);

        if (!lightRay) {
          let dot = lightFrom.dot(hit.hitNormal);
          if (dot < 0) {
            dot = 0;
          }
          // let materialData = hit.hitEntity.materialData
          let lightColor = light.color;
          c.add(lightColor.mulVec(diffusion, true).mul(dot, true));
          let dot3 = cameraReflex.dot(lightFrom);
          if (dot3 > 0) {
            dot3 **= specularK;
            c.add(lightColor.mulVec(specular, true).mul(dot3, true));
          }
        }
        outColor.add(c);
      }
      if (count > 0 && smoothness.length() != 0) {
        let reflexColor = this.getColor(hit.hitPos, cameraReflex, count - 1);
        reflexColor.mulVec(smoothness);
        outColor.add(reflexColor);
      }
      outColor.clamp255();
    } else {
      outColor = new Vector3(50,50,50);
    }
    return outColor;
  }
  static setpixel(canvasData, width, x, y, color) {
    let index = (width * y + x) * 4;
    canvasData.data[index] = color.r;
    index++;
    canvasData.data[index] = color.g;
    index++;
    canvasData.data[index] = color.b;
    index++;
    canvasData.data[index] = color.a;
  }
}
