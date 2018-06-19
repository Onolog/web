import {Children, cloneElement} from 'react';

const AppController = (props) => {
  return cloneElement(Children.only(props.children));
};

module.exports = AppController;
