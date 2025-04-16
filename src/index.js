import Phaser from 'phaser';

import StartScene from './StartScene';
import MainScene from './MainScene';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#222222',
  scene: [StartScene, MainScene],
  scale: {
    mode: Phaser.Scale.RESIZE, // ✅ 창 크기에 맞게 리사이즈
    autoCenter: Phaser.Scale.CENTER_BOTH, // ✅ 자동 중앙 정렬
    width: '100%',
    height: '100%',
  },
};

window.game = new Phaser.Game(config);
