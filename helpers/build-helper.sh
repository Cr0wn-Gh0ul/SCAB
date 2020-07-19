rm -rf app-build/*
cd app/client
npm run build
cd ../../
mv app/client/build/* ./app-build
cp -r ./app/electron ./app-build
cp app/ganacheServer.js ./app-build
cp contractInfo.json ./app-build
