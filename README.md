# isoComic extensions

## What is isoComic?

Similar to [**Tachiyomi**](https://github.com/tachiyomiorg/tachiyomi), isoComic is a plugin-based manga reader in **browser**. Thanks to the browser's cross-platform ability, you can read any comic from any source on many platforms in isoComic.

## What is isoComic-extension?

Similar to [**Tachiyomi-extensions**](https://github.com/tachiyomiorg/tachiyomi-extensions), an isoComic extension is just a single javascript file, which defines what and how the data is fetched from the network.

## Extensions in the repo

- [template](https://raw.githubusercontent.com/isomerase/isocomic-extensions/repo/dist/template.min.js): extension template, you can copy it and develop a new extension
- [tachidesk](https://raw.githubusercontent.com/isomerase/isocomic-extensions/repo/dist/tachidesk.min.js): a client for [Tachidesk-Server](https://github.com/Suwayomi/Tachidesk-Server), (depend on your browser's [security policy](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content), you might need to enable HTTPS on your tachidesk server)
- [mangadex](https://raw.githubusercontent.com/isomerase/isocomic-extensions/repo/dist/mangadex.min.js): a more complex extension to show how isocomic-extension work

## How to use isoComic-extension?

isoComic can load extensions by url, so you just need to open the add-source-button in home pape, input the url, and then start using the extension
(Considering your data security, only extensions from the official repository or local network(localhost, 192.168._._, 127.0.0.1) are allowed)

# How to develop isoComic-extension?

You need to implement interface `Source` and `SourceMetadata` defined in `types` directory

## Feedback

- GitHub issues
- send email to [isocomic@pronton.me](mailto:isocomic@pronton.me)

## Acknowledgement

This project is inspired by [tachiyomi](https://github.com/tachiyomiorg/tachiyomi) and [tachiyomi-extensions](https://github.com/tachiyomiorg/tachiyomi-extensions).
