const canvas = document.querySelector('canvas');

let score_element = document.querySelector('#score');

let score_element1 = document.querySelector('#highest_score');

const c = canvas.getContext('2d');

canvas.width = 1024

canvas.height = 576

// Player
class Player {
    constructor() {
        this.position = {
            x: canvas.width / 2 - this.width / 2,
            y: 200
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0;
        this.opacity = 1;
        const image = new Image()
        image.src = './assets/spaceship.png'
        image.onload = () => {
            const scale = 0.15
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale

            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 40
            }
        }
        this.particles = [];
        this.frames = 0;
    }


    draw() {

        c.save()
        c.globalAlpha = this.opacity;
        c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
        c.rotate(this.rotation)
        c.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)

        if (this.image)
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)

        c.restore()
    }

    update() {
        if (!this.image) return
        this.draw()
        this.position.x += this.velocity.x

        if (player.opacity !== 1) return

        // player boost
        this.frames++;

        if (this.frames % 2 === 0) {

            this.particles.push(new Particle({
                position: {
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height
                },
                velocity: {
                    x: (Math.random() - 0.5) * 1.3,
                    y: 1
                },
                radius: Math.random() * 2,
                color: 'red',
                fades: true
            }))

        }
    }
}

// Projectile/Bullet
class Projectile {
    constructor({ position, velocity }) {

        this.position = position;
        this.velocity = velocity;

        this.radius = 4;

    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'red';
        c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

// Particle
class Particle {
    constructor({ position, velocity, radius, color, fades }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.opacity = 1;
        this.fades = fades;
    }

    draw() {
        c.save();
        c.globalAlpha = this.opacity;
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        c.restore();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.fades) {
            this.opacity -= 0.01;
        }
    }
}

// Invader Projectile/Bullet
class InvaderProjectile {
    constructor({ position, velocity }) {

        this.position = position;
        this.velocity = velocity;
        this.width = 3;
        this.height = 10;

    }

    draw() {
        c.fillStyle = 'white';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

// Invader
class Invader {
    constructor({ position }) {

        this.position = {
            x: canvas.width / 2 - this.width / 2,
            y: 200
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image()
        image.src = './assets/invader.png'
        image.onload = () => {

            const scale = 1
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale

            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }

    draw() {
        if (this.image)
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update({ velocity }) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }

    // invader shooting
    shoot(InvaderProjectiles) {

        audio.enemyShoot.play();
        InvaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))

    }
}


// Grid of invaders
class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 2,
            y: 0
        }

        this.invaders = []
        const rows = Math.floor(Math.random() * 5 + 2);
        const columns = Math.floor(Math.random() * 10 + 5);
        this.width = columns * 30;

        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                this.invaders.push(new Invader({
                    position: {
                        x: i * 30,
                        y: j * 30
                    }
                }))
            }
        }
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y = 0;
        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 30;
        }
    }
}

let player = new Player()
let projectiles = []
let grids = []
let invaderProjectiles = []
let particles = []

let keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    z: {
        pressed: false
    },
    space: {
        pressed: false
    }

}

let frames = 0
let randomInterval = Math.floor((Math.random() * 500) + 500)
let game = {
    over: false,
    active: true
}
let score = 0;

function initialise() {
    player = new Player()
    projectiles = []
    grids = []
    invaderProjectiles = []
    particles = []

    score_element.innerHTML = 0;

    keys = {
        a: {
            pressed: false
        },
        d: {
            pressed: false
        },
        w: {
            pressed: false
        },
        z: {
            pressed: false
        },
        space: {
            pressed: false
        }
    }

    frames = 0
    randomInterval = Math.floor((Math.random() * 500) + 500)
    game = {
        over: false,
        active: true
    }
    score = 0;

    // particles/stars in galaxy
    for (let i = 0; i < 100; i++) {

        particles.push(new Particle({
            position: {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            },
            velocity: {
                x: 0,
                y: 0.3
            },
            radius: Math.random() * 2,
            color: 'white'
        }))
    }
}


function createParticles({ object, color, fades }) {

    // explosions when shot
    for (let i = 0; i < 15; i++) {

        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 2,
            color: color || '#BAA0DE',
            fades: fades
        }))
    }
}


// collision when enemy touches player
function RectangularCollision({
    rectangular1,
    rectangular2
}) {
    return (rectangular1.position.y + rectangular1.height >= rectangular2.position.y &&
        rectangular1.position.x + rectangular1.width >= rectangular2.position.x &&
        rectangular1.position.x <= rectangular2.position.x + rectangular2.width)

}

function endGame() {

    audio.gameOver.play();
    audio.backgroundMusic.stop();

    // makes player disappear
    setTimeout(() => {
        player.opacity = 0;
        game.over = true;
    }, 0)

    // stops game
    setTimeout(() => {
        game.active = false;
        document.querySelector("#endScreen").style.display = 'flex';
    }, 2000)

    createParticles({
        object: player,
        color: 'white',
        fades: true
    });
};


let spawnTimer = 500


function animate() {

    if (!game.active) return
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update();

    // booster particles on player
    for (let i = player.particles.length - 1; i >= 0; i--) {
        const particle = player.particles[i];
        particle.update();
        if (particle.opacity === 0) player.particles[i].splice(i, 1)
    }

    particles.forEach((particle, i) => {
        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width;
            particle.position.y = -particle.radius;
        }

        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0);
        } else {
            particle.update();
        }
    });

    invaderProjectiles.forEach((invaderProjectile, index) => {

        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
        } else {
            invaderProjectile.update();
        }

        if (RectangularCollision({ rectangular1: invaderProjectile, rectangular2: player })) {
            invaderProjectiles.splice(index, 1);
            endGame();
        }
    });


    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        } else {
            projectile.update();
        }
    });


    grids.forEach((grid, gridIndex) => {
        grid.update();
        // spawn projectiles
        if (frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        }

        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity });

            // projectiles hit enemy
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >= invader.position.x &&
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y
                ) {
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find((invader2) => invader2 === invader);
                        const projectileFound = projectiles.find((projectile2) => projectile2 === projectile);

                        // remove projectile and invader when shot
                        if (invaderFound && projectileFound) {
                            score += 100;
                            score_element.innerHTML = score;

                            score_element1.innerHTML = score;

                            console.log('score:', score);

                            createParticles({
                                object: invader,
                                fades: true
                            });

                            audio.explode.play();
                            grid.invaders.splice(i, 1);
                            projectiles.splice(j, 1);

                            if (grid.invaders.length > 0) {

                                const firstInvader = grid.invaders[0];
                                const lastInvader = grid.invaders[grid.invaders.length - 1];

                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;

                                grid.position.x = firstInvader.position.x;

                            } else {
                                grids.splice(gridIndex, 1)
                            }
                        }
                    }, 0)
                }
            });

            // removing player if touched by enemy
            if (RectangularCollision({ rectangular1: invader, rectangular2: player }) && !game.over) {
                endGame();
            }
        })
    })

    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -5;
        player.rotation = -0.15;
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = +5;
        player.rotation = +0.15;
    } else {
        player.velocity.x = 0;
        player.rotation = 0;
    }

    // spawning enenmies
    if (frames % randomInterval === 0) {

        if (spawnTimer < 0) {
            spawnTimer = 100;
            grids.push(new Grid());
            randomInterval = Math.floor((Math.random() * 500) + spawnTimer);
            frames = 0;
        } else {
            grids.push(new Grid());
            randomInterval = Math.floor((Math.random() * 500) + spawnTimer);
            spawnTimer -= 100;
            frames = 0;
        }
    }

    frames++;
}

document.querySelector('#startButton').addEventListener('click', () => {
    audio.backgroundMusic.play();
    audio.start.play();
    document.querySelector('#startScreen').style.display = 'none';
    document.querySelector('#scoreboard').style.display = 'block';
    initialise();
    animate();
});

document.querySelector('#restartButton').addEventListener('click', () => {
    audio.select.play();
    audio.backgroundMusic.play();
    document.querySelector('#endScreen').style.display = 'none';
    initialise();
    animate();
});

addEventListener('keydown', ({ key }) => {

    if (game.over) return

    switch (key) {
        case 'a':
            keys.a.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
        case ' ':
            keys.space.pressed = true;
            audio.shoot.play();
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y,
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            }))
            break
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case ' ':
            keys.space.pressed = false
            break
    }
})