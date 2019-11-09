#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2));
const touch = require('touch');
const mkdir = require('make-dir');
const path = require('path');
const figlet = require('figlet');
const pck = require('./package.json');
const fs = require('fs');
const chalk = require('chalk');
const template = require('./template');
const params = argv._;
const exec = require('child_process').exec;
// check if react project

if(params[0] === 'new') {
    createNewProject(params[1]);
    return;
}
if(params[0] === 'serve') {
    
    if(projectNotFound()) {
        console.log(params[0])
        return;
    } 
    serveProject();
    return;
}
if(params[0] === 'build') {
    if(projectNotFound()) 
        return;
    build(params[1]);
    return;
}
// if(!fs.existsSync(path.join(process.cwd(), 'src', 'index.js'))) {
//     console.log("React project not found");
//     return ;
// }
function readPckIfExist() {
    try {
        return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));
    } catch(err) {
        return false
    }
    
}

// check if not parameters present
if(params === undefined) {
    figlet("React Cli",(err, data) => {
        if(err) {
            console.log("something went wrong");
            return;
        } 
        console.log(data)
        console.log("version ", pck.version);
        return;
    })
}
// check for proper arguments
if(params && params.length === 1) {
    console.log("invalid number of arguments");
    return ;
} 
// prints the version of cli
else if (params && params.length === 0 ) {
    figlet("React Cli",(err, data) => {
        if(err) {
            console.log("something went wrong");
            return;
        } 
        console.log(chalk.blue(data))
        console.log("version ", pck.version);
        console.log("Available Commands");
        console.log(chalk.green("new create react project"));
        console.log(chalk.green("page (p) create component"));
        console.log(chalk.green("component (c) create component"));
        console.log(chalk.green("service (s) create service"));
        console.log(chalk.green("serve serve's project"));
        console.log(chalk.green("build build's project"));
        return;
    })
    
}
else {
    if(projectNotFound()) {
        return;
    }
    let type = params[0];
    if(type === 'c' || type === 'component') {
        type = 'component';
    }
    if(type === 's' || type === 'service') {
        type = 'service';
    }
    if(type === 'p' || type === 'page') {
        type = 'page';
    }
    if(!(type === "component" || type === 'service' || type === 'page')) {
        console.log(chalk.red('Invalid command'));
        return;
    }
    let option = params[1];
    
    filename = option.split("/").slice(-1)[0];
    (async () => {
        option = option.toLocaleLowerCase()
        const folder = await mkdir(path.join('src', type + 's', option));
        const File = path.join(folder, filename[0].toUpperCase() + filename.slice(1));
        const mainjs = File+ '.'+type+'.js';
        const maincss = File+ '.' + type + '.css';
        const modulecss = File + '.' + 'module.css';
        const testjs = File + '.' + type + '.test.js'
        if((type === 'page' || type === 'component') && argv.m) {
            fileCreateOperation(type, {'mainjs': mainjs, 'modulecss': modulecss, 'testjs': testjs});
        }
        else if(type === 'page' || type === 'component')
            fileCreateOperation(type, {'mainjs': mainjs, 'maincss': maincss, 'testjs': testjs});
        else if(type === 'service') {
            fileCreateOperation(type, {'servicejs': mainjs, 'testjs': testjs});
        }
    })();
}

async function createNewProject(appName) {
    console.log("Installing React app...");
    exec(`npx create-react-app ${appName}`).stdout.pipe(process.stdout);
}

async function serveProject() {
    console.log('serving project...');
    exec(`npm  start`).stdout.pipe(process.stdout);
}

async function build() {
    console.log('building project...');
    exec(`npm run build`).stdout.pipe(process.stdout);
}

async function fileCreateOperation(type, filesConfig) {
    // registry of files
    const filesToCreate = filesConfig
    for(i in filesToCreate) {
        if(!fs.existsSync(filesToCreate[i])) {
                if(i === 'mainjs') {
                    css = filesToCreate['maincss'] ? filesToCreate['maincss'].split('\\').slice(-1)[0] : filesToCreate['modulecss'].split('\\').slice(-1)[0];
                    className = css.split('.')[0];
                    cssType = filesToCreate['maincss'] ? 'maincss' : 'modulecss'
                    try {
                        fs.writeFileSync(filesToCreate[i], template.template(cssType, css, className))
                    } catch(err) {
                        console.log(err)
                    }
                    
                } else {    
                    touch(filesToCreate[i])
                }
        }
        else {
            console.log(chalk.magenta(`${type} already present`));
            return;
        }  
    }
    console.log(chalk.green(`${type} created successfull`));
}

function projectNotFound() {
    console.log(readPckIfExist().dependencies.react)
    if(!readPckIfExist() || !readPckIfExist().dependencies.react){
         console.log("react project not found");
         return true;
    } else {
        return false;
    }
}
