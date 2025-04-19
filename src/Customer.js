import Phaser from 'phaser';

export default class Customer extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, order) {
    super(scene, x, y, texture);
    scene.add.existing(this);

    this.order = order; // ✅ 주문 정보 저장

    // ✅ 주문 텍스트 생성
    const orderText = `${order.item}김밥 x${order.count}`;

    // ✅ 말풍선 텍스트 생성
    this.orderLabel = scene.add.text(x, y - 40, orderText, {
      fontSize: '16px',
      color: '#000',
      backgroundColor: '#fff',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5);
  }

  destroy(fromScene) {
    this.orderLabel.destroy();
    super.destroy(fromScene);
  }
}
