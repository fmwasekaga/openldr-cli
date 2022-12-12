#! /usr/bin/env node

const yargs = require("yargs");
const chalk = require('chalk'); 
const boxen = require('boxen');
const figlet = require('figlet');
const fs = require('fs');
const path = require('path');

yargs
    //choices: ['mssql', 'mysql', 'mongodb', 'postgresql', 'sqlite']
    .option("c", {alias:"connection", describe: "Connection string to database engine", type: "", demandOption: false })
    .option("d", {alias:"database", describe: "Type of database engine", type: "", demandOption: false }) 
    .option("s", {alias:"config", describe: "Configuration file", type: "", demandOption: false }) 
    .version(false)
    .help(false)
    .argv;

const logo = chalk.yellow(figlet.textSync('OPENLDR', { horizontalLayout: 'full' }));

const argv = require('yargs/yargs')(process.argv.slice(2)).argv;

const trimmer = (item) =>{
    if(item != undefined && item != null && typeof item == "string"){        
        return item.toString().trim();
    }
    return null;
}

const configFile =  trimmer(argv.s) || trimmer(argv.config);

const config = {
    connection: trimmer(argv.c) || trimmer(argv.connection),
    database: trimmer(argv.d) || trimmer(argv.database)
};

const print_screen = (text) =>{
    console.log(logo);
    console.log(boxen(chalk.red(text), {padding: 1, borderColor: 'red', dimBorder: true}) + "\n");
    yargs.showHelp();
}

if(configFile != null){
    if(fs.existsSync(configFile)){
        const ext = path.extname(configFile);
        if(ext && ext == '.json'){
            const _config = require(configFile);
            if(_config){
                config.connection = trimmer(_config?.connection);
                config.database = trimmer(_config?.database);
            }            
        }
        else{
            print_screen(`Unsupported file format`);
            return;
        }
    }
    else{
        print_screen(`File not found: ${configFile}`);
        return;
    }
}

if(config.connection == null || config.database == null){
    //check default config file if exists
    const _configFile = path.join(__dirname, '../openldr.config.json');     
    if(fs.existsSync(_configFile)){
        const ext = path.extname(_configFile);        
        if(ext && ext == '.json'){            
            const _config = require(_configFile);
            if(_config){
                config.connection = trimmer(_config?.connection);
                config.database = trimmer(_config?.database);
            }
            
            if(config.connection == null || config.database == null){
                print_screen(`Check settings`);
                return;
            }
        }
        else{
            print_screen(`Unsupported file format`);
            return;
        }
    }
    else {
        print_screen(`Check settings`);
        return;
    }
}

const supportedEngines = ['mssql', 'mysql', 'mongodb', 'postgresql', 'sqlite'];
if(config.database && !supportedEngines.includes(config.database)){
    print_screen(`Supported database engines are: mssql, mysql, mongodb, postgresql, sqlite`);
    return;
}

//Proceed