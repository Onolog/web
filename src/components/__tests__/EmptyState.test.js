import { shallow } from 'enzyme';
import React from 'react';

import EmptyState from '../EmptyState.react';

describe('<EmptyState/>', () => {
  it('renders the component', () => {
    const wrapper = shallow(<EmptyState />);
    expect(wrapper.find('.emptyState').length).toBe(1);
  });

  it('renders with children', () => {
    const wrapper = shallow(
      <EmptyState>
        <div className="unique" />
      </EmptyState>
    );
    expect(wrapper.contains(<div className="unique" />)).toBe(true);
  });
});
