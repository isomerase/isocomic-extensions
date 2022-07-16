cd src/$1
npm install --omit=dev
npx webpack --config ../../webpack.config.js
cd ../..
mkdir -p dist
cp src/$1/dist/extension.js dist/$1.min.js
