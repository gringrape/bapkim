import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  create() {
    const { width, height } = this.scale;

    const startText = this.add.text(width / 2, height / 2, '게임 시작', {
      fontSize: '32px',
      color: '#ffffff',
    }).setOrigin(0.5);

    startText.setInteractive();
    startText.on('pointerdown', () => {
      this.scene.start('MainScene');
    });

    // ✅ 창 크기 변경 시에도 중앙으로 다시 정렬
    this.scale.on('resize', (gameSize) => {
      startText.setPosition(gameSize.width / 2, gameSize.height / 2);
    });
  }
}
