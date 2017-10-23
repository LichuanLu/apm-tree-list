import React from 'react';
import { configure, addDecorator, setAddon } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';


import './css/storybook.less';


function getLink(href, text) {
  return `<a href=${href} rel="noopener noreferrer" target="_blank">${text}</a>`;
}

// const README = getLink('https://github.com/xxx/README.md', 'README');

const helperText = 'Apm Tree List组件';

addDecorator((story) => (
  <div style={{height: '100%'}}>
    <div
      style={{
        background: '#fff',
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        padding: '8px 40px 8px 8px',
        overflow: 'scroll'
      }}
      dangerouslySetInnerHTML={{ __html: 'test' }}
    />

    <div style={{ marginTop: 7 * 8, height: '100%' }} className="story-wrapper">
      {story()}
    </div>
  </div>
));

setOptions({
  name: 'Tree List',
  url: 'https://github.com/airbnb/react-dates',
});


function loadStories() {
  // requireGlob('../src/components/**/stories/*.js')
  //TODO: 可以在gulp脚本中按照glob先生成所需的文件列表，然后驱动storybook，不能直接用glob这里因为是webpack browser环境
  require('../src/components/tree-list/stories/TreeList');
}

configure(loadStories, module);
