import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import mockData from './mockData'

import { TreeList } from '../../index';
import '../style/index';


const { rootNode, firstLevel, secondLevel } = mockData

const fetchChildren = id => Promise.resolve(
  id === 'root' ? firstLevel : secondLevel,
)


class TreeListWrapper extends React.Component {
  constructor() {
    super()
    this.state = {
      value: [],
    }
  }
  onChange = (value) => {
    this.setState({ value })
  }
  render() {
    const { value } = this.state
    return (
      <TreeList
        current={rootNode}
        value={value}
        fetchChildren={fetchChildren}
        showSelect
        onChange={this.onChange}
      />
    )
  }
}


storiesOf('TreeList', module)
  .add('three level tree list', withInfo({
    // text: 'three level tree list ',
  })(() => <TreeList current={rootNode} fetchChildren={fetchChildren} showSelect={false} />),
  )
  .add('with select', withInfo({
    // text: 'with select',
  })(() => <TreeListWrapper />),
  );
