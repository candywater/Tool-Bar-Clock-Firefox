# Tool Bar Clock

Firefox extension that displays a clock on the toolbar.

## Features

- Supports all time zones available through the browser's IANA time zone data.
- Filters time zones with an input box.
- Defaults to the browser's local time zone.
- Saves the selected time zone and displays it in the toolbar clock.

This project is forked from the Firefox Add-ons version history for Tool Bar
Clock:

<https://addons.mozilla.org/en-US/firefox/addon/tool-bar-clock/versions/>

The forked extension page is available at:

<https://addons.mozilla.org/en-US/firefox/addon/tool-bar-clock-fork-version/>

## License

This fork is distributed under the Mozilla Public License Version 2.0
(MPL-2.0). See [LICENSE](./LICENSE) for the complete license text.

Source files in this project include an SPDX license identifier:

```text
SPDX-License-Identifier: MPL-2.0
```

For Chinese documentation, see [README.zh-CN.md](./README.zh-CN.md).

## Packaging

From the project directory, run:

```sh
rm -f tool-bar-clock.zip
zip tool-bar-clock.zip \
  LICENSE README.md README.zh-CN.md \
  background.js icon.png manifest.json \
  options.html options.js popup.html popup.js
```

The generated `tool-bar-clock.zip` can be used as the extension package. The
ZIP file is ignored by `.gitignore`.

## Data collection

This extension does not collect or transmit user data. The manifest declares
`browser_specific_settings.gecko.data_collection_permissions.required` as
`["none"]`.
