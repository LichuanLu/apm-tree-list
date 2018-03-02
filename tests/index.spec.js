// 整体冒烟测试，避免一些升级的问题，可以不使用
// import pkg from '../package.json';

describe('component dist files', () => {

  it('exports modules correctly', () => {
    const components = require('../src/components'); // eslint-disable-line global-require
    expect(Object.keys(components)).toMatchSnapshot();
  });

});
