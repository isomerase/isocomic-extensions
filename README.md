# isoComic extensions

Extensions for [isocomic.com](https://isocomic.com)

## What is isoComic?

Similar to [**Tachiyomi**](https://github.com/tachiyomiorg/tachiyomi), isoComic is a plugin-based manga reader in **browser**. Thanks to the browser's cross-platform ability, you can read any comic from any source on many platforms in isoComic.

## What is isoComic-extension?

Similar to [**Tachiyomi-extensions**](https://github.com/tachiyomiorg/tachiyomi-extensions), an isoComic extension is just a single javascript file, which defines what and how the data is fetched from the network.

## Screenshots
| Home Page | Source Page | Manga Page | Reader Page |
|----|----|----|----|
|![Home Page](https://github.com/isomerase/isocomic-extensions/raw/repo/screenshots/isocomic.com_1.webp)|![Source Page](https://github.com/isomerase/isocomic-extensions/raw/repo/screenshots/isocomic.com_2.webp)|![Manga Page](https://github.com/isomerase/isocomic-extensions/raw/repo/screenshots/isocomic.com_3.webp)|![Reader Page](https://github.com/isomerase/isocomic-extensions/raw/repo/screenshots/isocomic.com_4.webp)|

## Extensions in the repo

- [template](https://isocomic.com/?install_url=https://raw.githubusercontent.com/isomerase/isocomic-extensions/repo/dist/template.min.js): extension template, you can copy it and develop a new extension
- [tachidesk](https://isocomic.com/?install_url=https://raw.githubusercontent.com/isomerase/isocomic-extensions/repo/dist/tachidesk.min.js): a client for [Tachidesk-Server](https://github.com/Suwayomi/Tachidesk-Server), (depend on your browser's [security policy](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content), you might need to enable HTTPS on your tachidesk server)
- [mangadex](https://isocomic.com/?install_url=https://raw.githubusercontent.com/isomerase/isocomic-extensions/repo/dist/mangadex.min.js): a more complex extension to show how isocomic-extension work

## How to install isoComic-extension?

isoComic can load extension from url directly. Open the link like https://isocomic.com/?install_url=https://raw.githubusercontent.com/isomerase/isocomic-extensions/repo/dist/mangadex.min.js, and then start to enjoy the extension.

Considering your data security, only extensions from the official repository or local network(localhost, 192.168.X.X, 127.0.0.1) are allowed

# How to develop isoComic-extension?
```bash
git clone https://github.com/isomerase/isocomic-extensions.git
cd isocomic-extensions
npm install

npm run create EXTENSION_NAME  # create a new extension from template
# then edit index.ts to implement interfaces

# build the extension
npm run build EXTENSION_NAME # build the extension
npm run serve # host dist.js in a local server
```

## Feedback

- GitHub issues
- Send email to [isocomic@pronton.me](mailto:isocomic@pronton.me)

## Acknowledgement

This project is inspired by [tachiyomi](https://github.com/tachiyomiorg/tachiyomi) and [tachiyomi-extensions](https://github.com/tachiyomiorg/tachiyomi-extensions).
