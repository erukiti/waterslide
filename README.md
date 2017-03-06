# waterslider

Waterslider is a CLI tool that easily sets up a modern JavaScript project and takes care of troublesome compilation (webpack, babel...).

## Insatll

```sh
$ npm install -g waterslider
```

## Use

How to create project:

```sh
$ waterslider new <target> [projectDir]
```

`target` is the environment name you want to create like `electron` and `node`.

If you omit `projectDir` specification, created a project directory with random name. Even if you do not consider the name of the project, you can easily create a project and experiment.

How to excute project:

```sh
$ cd projectDir
$ npm start
```

## License

The license of the waterslider itself is Apache-2.0. Software license created using Waterslider can be set freely.
