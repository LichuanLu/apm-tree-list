import React from 'react';
import { render/* , mount */ } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import TreeList from '../TreeList';

import mockData from '../stories/mockData';

describe('TreeList', () => {
  it('renders correctly', () => {
    const { rootNode, firstLevel, secondLevel } = mockData

    const fetchChildren = id => Promise.resolve(
      id === 'root' ? firstLevel : secondLevel,
    )

    const wrapper = render(<TreeList current={rootNode} fetchChildren={fetchChildren} showSelect />);
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });
});

