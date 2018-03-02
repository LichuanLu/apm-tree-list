import sinon from 'sinon-sandbox';
import { getStore, getSameLevelFromCache } from '../TreeListUtils';


describe('TreeListUtils', () => {
  const mockTreeMap =  {
    CCD0000057: {
      id: 'CCD0000057',
      parent: 'CCD0000001',
      label: '信用卡中心办公室',
      data: {
      },
      children: ['CCD01','CCD02'],
      type: 'root',
    },
    CCD01: {
      id: 'CCD01',
      parent: 'CCD0000057',
      label: '信用卡中心办公室下属',
      data: {
      },
      children: false,
      type: 'others',
    },
  }

  it('getSameLevelFromCache with store', () => {
    const store = getStore()
    sinon.stub(store, 'get').returns(mockTreeMap)
    const res = getSameLevelFromCache('CCD01')
    expect(res).toEqual(['CCD01','CCD02'])
  })
})

