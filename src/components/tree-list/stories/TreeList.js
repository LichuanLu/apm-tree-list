import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import axios from 'axios';
import mockData from './mockData'

import { TreeList } from '../../index';
import '../style/index';

const { rootNode, firstLevel, secondLevel } = mockData

// local mock data
const fetchLocalChildren = id => Promise.resolve(
  id === 'root' ? firstLevel : secondLevel,
)

// fetch from server , 需要配置storybook middleware
const fetchChildren = (id) => {
  return axios.get(`/api/children?ID=${id}`).then((res) => {
    return res.data
  })
}


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
