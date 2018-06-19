import {expect} from 'chai';
import {shallow} from 'enzyme';
import React from 'react';

import EmptyState from '../EmptyState.react';

describe('<EmptyState/>', () => {
  it('renders the component', () => {
    const wrapper = shallow(<EmptyState />);
    expect(wrapper.find('.emptyState')).to.have.length(1);
  });

  it('renders with children', () => {
    const wrapper = shallow(
      <EmptyState>
        <div className="unique" />
      </EmptyState>
    );
    expect(wrapper.contains(<div className="unique" />)).to.equal(true);
  });
});
