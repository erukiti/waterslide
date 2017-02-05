# waterslider

*TODO: 全部英語で書く*

watersliderはモダンなJavaScriptのプロジェクト作成と面倒なコンパイル(webpack, babel...)を肩代わりしてくれるツールです。

## insatll

```sh
$ npm install -g waterslider
```

## use

```sh
$ waterslider new <target> [projectDir]
$ cd projectDir
$ npm start
```

`target`は、作成したいターゲットとなる環境名です。`electron`や`node`などを指定可能です。

`projectDir`を省略した場合、ランダムな名前のプロジェクトディレクトリが作成されます。実験的にコードを書きたいときに、いちいちプロジェクトの名前を考えるのは面倒な時でも、この機能で簡単にプロジェクトを作成して実験が可能です。

`waterslider new`が完了した後は一通り完了しているので、そのディレクトリに移って`npm start`すればアプリケーションが起動します。ターゲット環境が`electron`ならばElectronアプリが起動します。いわゆるwatchモードなので、ソースコードを変更したら即座に反映されます。

## License

waterslide自体のライセンスはApache-2.0とします。watersliderによる生成物のライセンスは特に規定しません。
