# BarcodeGenerator
A second attempt of the barcode generator. We had an older version that was just one HTML page, but I decided to split out the JS portions to separate files and use some node_modules instead of importing through a CDN because then I could put it LabKey.

# Dev server notes

For webpack dev server, add the following to package.json
```
"scripts": {
  "start": "concurrently \"webpack --mode development --watch\" \"http-server -c-1\""
},
```
This also requires the concurrently and webpack-dev-server packages: `npm install concurrently --save-dev` and `npm install webpack-dev-server --save-dev`. 

You also need to add the following to your webpack.config.js:
```
devServer: {
  contentBase: path.resolve(__dirname, 'dist'),
  hot: true,
},
```
