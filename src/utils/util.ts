const utils = {
  getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  },

  getRandomPercent() {
    return Math.random() * 100;
  },

  getPercentFired(percent) {
    return this.getRandomPercent() <= percent;
  },

  getRandomRange(min, max) {
    let randomNumber = 0;
    if (window && window.crypto) {
      const randomBuffer = new Uint32Array(1);
      window.crypto.getRandomValues(randomBuffer);
      randomNumber = randomBuffer[0] / (0xffffffff + 1);
    } else {
      randomNumber = Math.random();
    }

    return Math.floor(randomNumber * (max - min + 1)) + min;
  },
};

export { utils };
