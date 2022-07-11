cd src/$1
npm install --omit=dev
npm run build
cd ../..
mkdir -p dist
cp src/$1/dist/extension.js dist/$1.min.js
