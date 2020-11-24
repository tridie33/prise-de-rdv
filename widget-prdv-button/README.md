# Rollup
https://rollupjs.org/guide/en/#creating-your-first-bundle

## Tutorial
### Creating Your First Bundle
You can save the bundle as a file like so:

```rollup src/main.js -o bundle.js -f cjs```

To use the config file, we use the --config or -c flag:

``` rm bundle.js # so we can check the command works!``` 
``` rollup -c```


You can override any of the options in the config file with the equivalent command line options:

```rollup -c -o bundle-2.js # `-o` is equivalent to `--file` (formerly "output")```

Note: Rollup itself processes the config file, which is why we're able to use export default syntax – the code isn't being transpiled with Babel or anything similar, so you can only use ES2015 features that are supported in the version of Node.js that you're running.

You can, if you like, specify a different config file from the default rollup.config.js:

```rollup --config rollup.config.dev.js```
```rollup --config rollup.config.prod.js```
