
const WIDTH = screen.width;
const WIDTH2 = 1200;
const HEIGT = screen.height * 0.85;
let text = document.getElementsByClassName('class');
// kích thước 1 hạt
const PARTICLE_SIZE = 7;
// thay đổi size 1 hạt
const PARTICLE_CHANGE_SIZE_SPEED = 0.1;
// thay đổi tốc 1 hạt bắn ra
const PARTICLE_CHANGE_SPEED = 0.5;
// gia tốc bắn, tốc độ rơi
const ACCELERATION = 0.12;
// giảm dần size của các hạt sau khi bắn ra
const DOT_CHANGE_SIZE_SPEED = 0.2;
// độ mờ đi nhanh của các hạt sau khi bắn ra
const DOT_CHANGE_ALPHA_SPEED = 0.07;
// tốc độ bắn ít nhất (trong bài từ 10 đến 14)
const PARTICLE_MIN_SPEED = 10;
// số lượng hạt ban đầu bắn ra
const NUMBER_PARTICLE_PER_BULLET = 25;
const TIME = 1500;

class particle {
    constructor(bullet, deg) {
        this.bullet = bullet;
        this.ctx = this.bullet.ctx;
        this.deg = deg;
        this.x = this.bullet.x;
        this.y = this.bullet.y;
        this.color = this.bullet.color;
        this.size = PARTICLE_SIZE;
        this.speed = Math.random() * 4 + PARTICLE_MIN_SPEED;
        this.speedX = 0;
        this.speedY = 0;
        this.fallSpeed = 0;

        this.dots = [];

    }
    update() {
        // giảm vận tốc hạt bắn
        this.speed -= PARTICLE_CHANGE_SPEED;
        if (this.speed < 0) {
            this.speed = 0;
        }

        // giới hạn khoảng bắn, sau đó cho rơi
        this.fallSpeed += ACCELERATION;

        this.speedX = this.speed * Math.cos(this.deg);
        this.speedY = this.speed * Math.sin(this.deg) + this.fallSpeed;

        this.x += this.speedX;
        this.y += this.speedY;
        // thay đổi kích thước 1 hạt
        if (this.size > PARTICLE_CHANGE_SIZE_SPEED) {
            this.size -= PARTICLE_CHANGE_SIZE_SPEED;
        }
        if (this.size > 0) {
            this.dots.push({
                x: this.x,
                y: this.y,
                alpha: 1,
                size: this.size
            });
        }
        this.dots.forEach(dot => {
            dot.size -= DOT_CHANGE_SIZE_SPEED;
            dot.alpha -= DOT_CHANGE_ALPHA_SPEED;
        })
        this.dots = this.dots.filter(dot => {
            return dot.size > 0;
        });
        if (this.dots.length == 0) {
            this.remove();
        }
    }
    remove() {
        this.bullet.particles.splice(this.bullet.particles.indexOf(this), 1);
    }
    draw() {
        this.dots.forEach(dot => {
            this.ctx.fillStyle = 'rgba(' + this.color + ',' + dot.alpha + ')';
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }
}

class bullet {
    constructor(fireworks) {
        this.fireworks = fireworks;
        this.ctx = fireworks.ctx;
        this.x = Math.random() * WIDTH;
        this.y = Math.random() * HEIGT / 2;
        this.color = Math.floor(Math.random() * 255) + ','
            + Math.floor(Math.random() * 255) + ','
            + Math.floor(Math.random() * 255);
        this.particles = [];

        let bulletDeg = Math.PI * 2 / NUMBER_PARTICLE_PER_BULLET;
        for (let i = 0; i < NUMBER_PARTICLE_PER_BULLET; i++) {
            let newParticle = new particle(this, i * bulletDeg);
            this.particles.push(newParticle);
        }
    }
    remove() {
        this.fireworks.bullets.splice(this.fireworks.bullets.indexOf(this), 1);
    }
    update() {
        if (this.particles.length == 0) {
            this.remove();
        }
        this.particles.forEach(particle => particle.update());
    }
    draw() {
        this.particles.forEach(particle => particle.draw());
    }
}

class fireworks {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGT;
        document.body.appendChild(this.canvas);
        this.chu = this.canvas.width;
        this.time = TIME;
        this.checkTime();
        this.bullets = [];
        this.txt = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
        this.widthText = -500;

        setInterval(() => {
            let newBullet = new bullet(this);
            this.bullets.push(newBullet);
        }, this.time);
        setInterval(() => {
            this.checkManHinh();
        }, 250);
        this.loop();

    }
    checkTime() {
        if (this.canvas.width >= 1280) {
            this.time = 250;
        } else {
            this.time = 1500;
        }
    }
    checkManHinh() {
        this.width = screen.width;
        if (this.width != this.canvas.width) {
            window.location.href = window.location.pathname + window.location.search + window.location.hash;
        }
    }
    loop() {
        this.bullets.forEach(bullet => bullet.update());
        this.draw();
        this.chu = this.chu - 2;
        if (this.chu  < - this.widthText ) {
            this.chu = this.canvas.width;
        }
        setTimeout(() => this.loop(), 20);
    }


    clearScreen() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, WIDTH, HEIGT);
        this.ctx.font = "30px Comic Sans MS";
        this.ctx.fillStyle = "red";
        this.ctx.fillText(this.txt, this.chu, this.canvas.height * 0.99);
        this.widthText = this.ctx.measureText(this.txt).width;
    }

    draw() {
        this.clearScreen();
        this.bullets.forEach(bullet => bullet.draw());
    }
}

var f = new fireworks();