import React from 'react';
import {render /* , mount */, shallow} from 'enzyme';
import {renderToJson} from 'enzyme-to-json';
import sinon from 'sinon-sandbox';
import {EventEmitter} from 'fbemitter';
import {Checkbox} from 'antd-mobile';

import TreeSelectorItem from '../TreeSelectorItem';

describe('TreeSelectorItem', () => {
  describe('render', () => {
    const rowData = {
      label: 'TreeSelectorItem text',
      children: true,
    };

    const emitter = new EventEmitter();

    const treeSelectorItem = (
      <TreeSelectorItem rowData={rowData} emitter={emitter} />
    );

    it('render mock data correctly', () => {
      const wrapper = render(React.cloneElement(treeSelectorItem));
      expect(renderToJson(wrapper)).toMatchSnapshot();
    });

    it('contains radio button if showSelect set true', () => {
      const wrapper = shallow(
        React.cloneElement(treeSelectorItem, {showSelect: true}),
      ).dive();
      expect(wrapper.find(Checkbox).length).toBe(1);
    });

    it('childlevel button show and can be click when have children params', () => {
      const toChildLevelStub = sinon.stub();
      const wrapper = shallow(
        React.cloneElement(treeSelectorItem, {
          showSelect: true,
          toChildLevel: toChildLevelStub,
        }),
      ).dive();
      const nextLevelBtn = wrapper.find('.next-level-btn');
      expect(nextLevelBtn.length).toBe(1);
      nextLevelBtn.simulate('click');
      expect(toChildLevelStub).toHaveProperty('callCount', 1);
    });
  });
});
