export default class Vector3 {
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }
    static bothXYZ(n) {
        return new Vector3(n, n, n)
    }
    add(v, getNew = false) {
        if (!getNew) {
            this.x += v.x
            this.y += v.y
            this.z += v.z
        } else {
            let newVec = new Vector3(this.x + v.x, this.y + v.y, this.z + v.z)
            return newVec
        }
    }
    sub(v, getNew = false) {
        if (!getNew) {
            this.x -= v.x
            this.y -= v.y
            this.z -= v.z
        } else {
            let newVec = new Vector3(this.x - v.x, this.y - v.y, this.z - v.z)
            return newVec
        }
    }
    mul(n, getNew = false) {
        if (!getNew) {
            this.x *= n
            this.y *= n
            this.z *= n
        } else {
            let newVec = new Vector3(this.x * n, this.y * n, this.z * n)
            return newVec
        }
    }
    mulVec(v, getNew = false) {
        if (!getNew) {
            this.x *= v.x
            this.y *= v.y
            this.z *= v.z
        } else {
            let newVec = new Vector3(this.x * v.x, this.y * v.y, this.z * v.z)
            return newVec
        }
    }
    dev(n, getNew = false) {
        if (!getNew) {
            this.x /= n
            this.y /= n
            this.z /= n
        } else {
            let newVec = new Vector3(this.x / n, this.y / n, this.z / n)
            return newVec
        }
    }
    clone() {
        return new Vector3(this.x, this.y, this.z)
    }
    length() {
        let x = this.x
        let y = this.y
        let z = this.z
        return Math.sqrt(x * x + y * y + z * z)
    }
    lengthSqr() {
        return this.x ** 2 + this.y ** 2 + this.z ** 2
    }
    normalize() {
        let length = this.length()
        this.dev(length)
    }
    getNormalized() {
        let v = this.clone()
        v.normalize()
        return v
    }
    distance(v) {
        return this.sub(v, true).length()
    }
    cross(v) {
        return new Vector3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x)
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z
    }
    invert(getNew = false) {
        if (!getNew) {
            this.x = -this.x
            this.y = -this.y
            this.z = -this.z
        } else {
            return new Vector3(-this.x, -this.y, -this.z)
        }

    }
    toString() {
        return "[" + this.x + "," + this.y + "," + this.z + "]"
    }
    clamp255() {
        if (this.x > 255) {
            this.x = 255
        }
        if (this.y > 255) {
            this.y = 255
        }
        if (this.z > 255) {
            this.z = 255
        }
    }
}