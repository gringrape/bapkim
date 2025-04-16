import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    const { width, height } = this.scale;

    // 중앙 텍스트 생성
    const mainText = this.add.text(width / 2, height / 2, 'MainScene입니다!', {
      fontSize: '24px',
      color: '#00ff00',
    }).setOrigin(0.5);

    // 창 리사이즈 시 위치 재조정
    this.scale.on('resize', (gameSize) => {
      mainText.setPosition(gameSize.width / 2, gameSize.height / 2);
    });
  }
}
