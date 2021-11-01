'use strict';

const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

// const diagnostic = require('./src/devices/servo-plugins/diagnostic');
// const ld27mg = require('./src/devices/servo-plugins/ld27mg');
// const Servo = require('./src/devices/Servo');

const DispatchOperator = require('./src/DispatchOperator');

async function main(options) {

  let config = options.configFile
    ? await fs.promises.readFile(
          path.join(__dirname, 'config', `${options.configFile}.yaml`))
    : null;
  
  console.log(config);
  console.log(config.toString());

  config = config ? YAML.parse(config.toString()) : {};
    
  new DispatchOperator(config);

  // const plugin = debugMode.diagnosticPlugin ? diagnostic : ld27mg;
  // const servoOptions = {
  //   plugin,
  //   pin:17,
  //   outStream: debugMode.outStream
  // };

  // const servo = new Servo(servoOptions);

  // if (options.debugMode.testPattern) {
  //   while(true) {
  //     servo.angleZero();
  //     await delay(2000);
  //     servo.angleMax();
  //     await delay(2000);
  //   }
  // } else {
  //   console.log('zero');
  //   servo.angleZero();
  //   await delay(1000);
  //   console.log('max');
  //   servo.angleMax();
  //   let θ = 270;
  //   do {
  //     await delay(500);
  //     θ-=15;
  //     console.log(θ);
  //     servo.angle(θ);
  //   } while(θ > 0);
  // }
} 

function parseCommandLine() {
  
  // let debugMode = {
  //   outStream: null,
  //   diagnosticPlugin: false,
  //   testPattern: false
  // };
  
  // debugMode.diagnosticPlugin = false;
  // debugMode.testPattern = false;

  let hasErrors = false;
  // let debugLevel = 0;
  // let isDebugLevelSet = false;
  let configFile = null;

  // let outstreamSet = false;

  for (let i = 2; i < process.argv.length; i++) {

    let argMatch = process.argv[i].match(/([^=]+)(=(.*))?/);
    let p = argMatch[1];
    let v = argMatch[3];

    console.log(`{p, v} == {${p}, ${v}}`);

    switch (p) {
    case '--config':
      configFile = v;
      break;

    // case '--debug':
    //   if (!isDebugLevelSet) {
    //     debugMode.diagnosticPlugin = true;
    //     debugMode.testPattern = true;
    //     debugMode.outStream = '-';
    //   }
    //   break;
    // case '--debugLevel':
    //   isDebugLevelSet = true;
    //   if (v === undefined) {
    //     v = process.argv[++i];
    //   }
    //   try {
    //     debugLevel = Number.parseInt(v);
    //   } catch(e) {
    //     console.error(`debug level "${v}" invalid`);
    //     hasErrors = true;
    //   }
    //   debugLevel = Math.abs(debugLevel);
      
    //   switch(debugLevel) {
    //   case 0:
    //     break;
    //   case 1:
    //     debugMode.testPattern = true;
    //     break;
    //   case 2: 
    //     debugMode.testPattern = true;
    //     debugMode.diagnosticPlugin = true;
    //     break;
    //   default: // case 3 or higher
    //     debugMode.testPattern = true;
    //     debugMode.diagnosticPlugin = true;
    //     outstreamSet || (debugMode.outStream = '-');
    //   }
    //   break;
    // case '--outStream':
    //   debugMode.outStream = v;
    //   outstreamSet = true;
    //   break;
    default:
      console.error('unknown option', p);
      hasErrors = true;
      break;
    }

  }

  if (hasErrors) {
    process.exit(1);
  }

  return {configFile /*, debugMode */};

}


main(parseCommandLine());
