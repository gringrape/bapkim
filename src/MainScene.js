import Phaser from 'phaser';
import Customer from './Customer';

const { log } = console;
const ORDER_LIST = ['참치', '김치', '치즈'];

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
    this.activeCustomers = [];
    this.playerChoice = [];
    this.madeGimbaps = [];
  }

  create() {
    this.initGameVariables();
    this.createHUD();
    this.setupResizeHandler();
    this.startCustomerTimer();
    this.createIngredientButtons();

    // 신뢰도
    this.reputation = 100;
    this.reputationText = this.add.text(this.scale.width - 20, 50, '', {
      fontSize: '16px',
      color: '#ff6666',
      backgroundColor: '#222',
      padding: { x: 6, y: 4 },
    }).setOrigin(1, 0);
    this.updateReputationDisplay();
  }

  initGameVariables() {
    this.money = 0;
    this.playerChoice = [];
    this.madeGimbaps = [];
  }

  updateReputationDisplay() {
    this.reputationText.setText(`💔 신뢰도: ${this.reputation}`);
  }

  createHUD() {
    this.moneyText = this.add.text(this.scale.width - 20, 20, '', {
      fontSize: '16px',
      color: '#00ff00',
      backgroundColor: '#222',
      padding: { x: 6, y: 4 },
    }).setOrigin(1, 0);

    this.gimbapText = this.add.text(20, 20, '', {
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#222',
      padding: { x: 6, y: 4 },
    });

    this.updateMoneyDisplay();
    this.updateGimbapDisplay();
  }

  setupResizeHandler() {
    this.scale.on('resize', (gameSize) => {
      this.reputationText.setPosition(this.scale.width - 20, 50);
      this.mainText.setPosition(gameSize.width / 2, gameSize.height / 2);
      this.moneyText.setPosition(gameSize.width - 20, 20);
    });
  }

  startCustomerTimer() {
    this.time.addEvent({
      delay: Phaser.Math.Between(5000, 7000),
      callback: () => {
        if (this.activeCustomers.length < 3) {
          this.spawnCustomer();
        }
        this.startCustomerTimer();
      },
      callbackScope: this,
    });
  }

  isCustomerUnserved(customer) {
    return this.activeCustomers[0] === customer;
  }

  spawnCustomer() {
    const x = Phaser.Math.Between(100, 700);
    const y = 400;
    const item = ORDER_LIST[Phaser.Math.Between(0, ORDER_LIST.length - 1)];
    const count = Phaser.Math.Between(1, 2);
    const order = { item, count };

    const customer = new Customer(this, x, y, 'customer', order);
    this.activeCustomers.push(customer);

    log(`손님 등장! 주문: ${item}김밥 x${count}`);

    this.time.delayedCall(10000, () => {
      if (this.activeCustomers.includes(customer) && this.isCustomerUnserved(customer)) {
        this.handleCustomerTimeout(customer);
      }
    });
  }

  createIngredientButtons() {
    const ingredients = ['김', '밥', '참치', '김치', '치즈'];

    ingredients.forEach((name, index) => {
      const btn = this.add.text(100 + index * 100, 500, name, {
        fontSize: '20px',
        backgroundColor: '#eee',
        color: '#000',
        padding: { x: 10, y: 5 },
      }).setOrigin(0.5).setInteractive();

      btn.on('pointerdown', () => {
        this.playerChoice = [...this.playerChoice, name];
        log('현재 선택:', this.playerChoice);

        if (this.playerChoice.length % 3 === 0) {
          this.checkGimbapLine();
        }
      });
    });
  }

  checkGimbapLine() {
    if (!this.canCheckGimbap()) return;

    const customer = this.activeCustomers[0];
    const { item, count } = customer.order;

    const gimbap = this.playerChoice.slice(-3);
    const expected = ['김', '밥', item];
    const isCorrect = JSON.stringify(gimbap) === JSON.stringify(expected);

    if (!isCorrect) {
      this.onGimbapFail();
      return;
    }

    this.onGimbapSuccess(gimbap);

    if (this.madeGimbaps.length < count) return;

    this.handleCustomerSatisfied(customer);
  }

  canCheckGimbap() {
    return this.activeCustomers.length > 0 && this.playerChoice.length >= 3;
  }

  onGimbapSuccess(gimbap) {
    this.madeGimbaps = [...this.madeGimbaps, gimbap];
    this.showMessage('성공!');
    this.updateGimbapDisplay(); // 실시간 표시
    log('📝 현재 만든 김밥들:', this.madeGimbaps);
  }

  onGimbapFail() {
    this.showMessage('실패...');
    this.playerChoice = this.playerChoice.slice(0, -3);
  }

  handleCustomerSatisfied(customer) {
    this.showMessage(`손님 만족! x${this.madeGimbaps.length}`);
    customer.destroy();
    this.activeCustomers.shift();

    const profit = 4500 * this.madeGimbaps.length;
    this.money += profit;
    this.updateMoneyDisplay();

    this.playerChoice = [];
    this.madeGimbaps = [];
    this.updateGimbapDisplay();

    log(`💰 보상 지급: +${profit}원 → 총 매출: ${this.money}원`);
  }

  handleCustomerTimeout(customer) {
    this.showMessage('시간 초과! 손님이 떠났습니다!');
    customer.destroy();
    this.activeCustomers = this.activeCustomers.filter((c) => c !== customer);

    const reputationDecrease = 20;
    this.reputation = Math.max(0, this.reputation - reputationDecrease);
    this.updateReputationDisplay();

    log('⏰ 손님이 기다리다 떠났고, 신뢰도가 감소했습니다.');

    this.checkGameOver();
  }

  updateGimbapDisplay() {
    const lines = this.madeGimbaps.map((gimbap, i) => {
      const filling = gimbap[2];
      return `${i + 1}. ${filling}김밥`;
    });
    this.gimbapText.setText(['🍙 만든 김밥'].concat(lines).join('\n'));
  }

  showMessage(text) {
    const msg = this.add.text(400, 450, text, {
      fontSize: '24px',
      color: '#000',
      backgroundColor: '#fff',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5);

    this.time.delayedCall(1000, () => msg.destroy());
  }

  updateMoneyDisplay() {
    this.moneyText.setText(`💰 매출: ${this.money.toLocaleString()}원`);
  }

  checkGameOver() {
    if (this.reputation > 0) return;

    const { width } = this.scale;

    this.add.text(width / 2, 50, '당신은 알바에서 해고되었습니다!', {
      fontSize: '28px',
      color: '#ff0000',
      backgroundColor: '#fff',
      padding: { x: 10, y: 6 },
    }).setOrigin(0.5);

    this.time.delayedCall(3000, () => {
      this.scene.start('StartScene');
    });
  }
}
