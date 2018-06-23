import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});

const context = require.context(
  './', // Root directory
  true, // Include subdirectories
  /(?!.*\/node_modules).*__test__\/.*\.test\.js/
);

context.keys().forEach(context);
