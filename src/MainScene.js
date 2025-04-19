import Phaser from 'phaser';
import Customer from './Customer';

const { log } = console;
const ORDER_LIST = ['참치', '김치', '치즈']; // 🔧 분리된 상수

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
    this.activeCustomers = [];
  }

  create() {
    const { width, height } = this.scale;

    const mainText = this.add.text(width / 2, height / 2, 'MainScene입니다!', {
      fontSize: '24px',
      color: '#00ff00',
    }).setOrigin(0.5);

    this.scale.on('resize', (gameSize) => {
      mainText.setPosition(gameSize.width / 2, gameSize.height / 2);
    });

    this.startCustomerTimer();
  }

  startCustomerTimer() {
    this.time.addEvent({
      delay: Phaser.Math.Between(3000, 6000),
      callback: () => {
        if (this.activeCustomers.length < 3) {
          this.spawnCustomer();
        }
        this.startCustomerTimer();
      },
      callbackScope: this,
    });
  }

  spawnCustomer() {
    const x = Phaser.Math.Between(100, 700);
    const y = 400;
    const order = ORDER_LIST[Phaser.Math.Between(0, ORDER_LIST.length - 1)];
    const count = Phaser.Math.Between(1, 3);
    const orderText = `${order}김밥 x${count}`;

    const customer = new Customer(this, x, y, 'customer', orderText);
    this.activeCustomers.push(customer);
    log(`손님 등장! 주문: ${orderText}`);
  }
}
