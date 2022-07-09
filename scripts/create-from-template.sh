cp -r src/template src/$1
cd src/$1
sed -i '' s/template/$1/g src/*.ts metadata.json package.json