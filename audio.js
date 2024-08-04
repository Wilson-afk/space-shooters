Howler.volume(0.3)
const audio = {
    backgroundMusic: new Howl({
        src: 'assets/audio/backgroundMusic.wav',
        loop: true,
        volume: 0.1
    }),
    enemyShoot: new Howl({
        src: 'assets/audio/enemyShoot.wav',
        volume: 0.01
    }),
    explode: new Howl({
        src: 'assets/audio/explode.wav',
        volume: 0.1
    }),
    gameOver: new Howl({
        src: 'assets/audio/gameOver.mp3',
        volume: 0.01
    }),
    select: new Howl({
        src: 'assets/audio/select.mp3',
        volume: 0.1
    }),
    shoot: new Howl({
        src: 'assets/audio/shoot.wav',
        volume: 0.1
    }),
    start: new Howl({
        src: 'assets/audio/start.mp3',
        volume: 0.1
    })
}