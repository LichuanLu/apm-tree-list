export default {
  rootNode: {
    id: 'root',
    label: '根节点',
    children: true,
  },
  firstLevel: [
    {
      id: 'child1',
      label: 'child1节点',
      children: true,
    },
    {
      id: 'child2',
      label: 'child2节点',
      children: false,
    },
  ],
  secondLevel: [
    {
      id: 'grandchild1',
      label: 'grandchild1节点',
      children: false,
    },
    {
      id: 'grandchild2',
      label: 'grandchild2节点',
      children: false,
    },
  ],
}
