import React from 'react';
import {render /* , mount */, shallow} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import TreeList from '../TreeList';

import mockData from '../stories/mockData';

describe('TreeList', () => {
  describe('render', () => {
    const {rootNode, firstLevel, secondLevel} = mockData;
    const fetchChildren = id =>
      Promise.resolve(id === 'root' ? firstLevel : secondLevel);
    const treelist = (
      <TreeList current={rootNode} fetchChildren={fetchChildren} />
    );

    it('render mock data correctly', () => {
      const wrapper = render(React.cloneElement(treelist, {showSelect: true}));
      expect(renderToJson(wrapper)).toMatchSnapshot();
    });
  });
});
