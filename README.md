# brandy-bella-babe

This was originally written as a simple way to control simple animatronics for Halloween decorations but it became a simple framework to control a lot of simple things from simple inputs as you would for home automation.

This was written to work in Node v10 because this is the last version of NodeJS that will run on ARMv6 such as the Raspberry Pi Zero W. It was also written hastily, so there may be big breaking changes in the future.

## Running

```sh
sudo $(which node) . --config=<name of config>
```

The config files are in the `config folder`. Use `--config=babe` for the `babe.yaml` config.

## Components

There are four types of components that are all tied together via a configuration, and the components are all classes that extend an eponymous superclass.

* `inputs` are things that gather information. For example an API, a motion sensor, a break-beam, polling a web service, MQTT listener, etc
* `effects` are things you want to happen. For example moving a servo, sending a message to a web service, flashing lights, etc
* `devices` are things that an effect can act upon. For example if the effect is moving a servo, the device is the servo you're moving. Not all effects require devices.
* `dispatchers` are things that decide if and how to cause an effect based on the input provided.

The `config`s define how `inputs`, `effects`, `devices`, and `dispatchers` work together for a particular machine.

## The future

This is, of course, a hastily written framework but I'm quite proud of the simplicity. I've found a few things I would like to change already

* The dispatcher operator needs to load the classes more intelligently, so I don't have to write a require for every module and I don't have to load unused code
* I should be able to eliminate `pi-blaster` from the servos code as the `rpgpio` module can deal with the pwm myself.



