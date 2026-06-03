const React = require('react');

const CredoAgentProvider = ({ children }) => React.createElement(React.Fragment, null, children);

module.exports = CredoAgentProvider;
module.exports.default = CredoAgentProvider;
module.exports.useAgent = jest.fn(() => ({ agent: null }));
