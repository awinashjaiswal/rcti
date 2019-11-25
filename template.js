module.exports.template = (cssType, cssName, className) => {
    return (
        `import React, { Component } from 'react';\n
import ${cssType === 'modulecss' ? 'styles from' : ''} './${cssName}';
    
export default class ${className} extends Component {
    render() {
        return (
        <div> ${className} </div>
        );
    }
}

`
    )
}

module.exports.testTemplate = (compName, className) => {
    return (`
import React from 'react';
import ReactDOM from 'react-dom';
import ${className} from './${compName}';

it('renders without crashing', () => {
const div = document.createElement('div');
ReactDOM.render(<${className} />, div);
ReactDOM.unmountComponentAtNode(div);
    });
    `)
}