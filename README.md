# Waterslide

Waterslide is a CLI tool that easily sets up a modern JavaScript project and takes care of troublesome compilation (webpack, babel...).

## Install and setup

```sh
$ npm install -g waterslide
$ ws config
```

`ws config` is default setting configuration tool.

## Create project

```sh
$ ws new <target> [projectDir]
```

`target` is the environment name you want to create like `electron`, `node`, `browser`.

If you omit `projectDir` specification, created a project directory with random name. Even if you do not consider the name of the project, you can easily create a project and experiment.

## In project

```sh
$ cd projectDir
$ npm start
```

* `npm start` is run project
* `npm run build` is build project
* `npm test` is test project

## For example

For example, create React-Redux eletcron project with ava, eslint:

```sh
$ ws new --use react-redux,ava,eslint electron [projectDir]
$ cd <projectDir>
$ npm start
```

Build distribution pacakge of the Electron application:

```sh
$ npm run build
```

## License

The license of the waterslide itself is Apache-2.0. Software license created using waterslide can be set freely.
