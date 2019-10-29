module.exports.template = (cssType, cssName, className) => {
    return (
        `import React, { Component } from 'react';\n
import ${cssType === 'modulecss' ? 'styles from': '' } './${cssName}';
    
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