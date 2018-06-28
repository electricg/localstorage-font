# LocalStorage Fonts

Convers Google fonts and locale font files into JSON.

Original source: http://crocodillon.com/blog/non-blocking-web-fonts-using-localstorage.

## Install

```bash
git clone https://github.com/electricg/localstorage-font.git
cd localstorage-font
npm install
```

## Configure

config.json:

```json
{
  "google": [
    {
      "name": "Rubik",
      "display": "swap"
    },
    {
      "name": "Lato",
      "formats": ["300", "300i", "400"]
    }
  ],
  "local": [
    {
      "name": "Digory",
      "file": "digory.woff",
      "weight": "700",
      "style": "italic",
      "display": "fallback"
    }
  ]
}
```

Properties:

- `google` - settings for the [Google Fonts](https://fonts.google.com/) files. It's always `woff` format at the moment. It's value is an array of fonts:
  - `name` - name of the font, spaces are allowed, using Google names
  - `formats` - array of formats for said font, using Google label, where `400` usually is regular, `700` is **bold**, `400i` is regular _italic_, `700i` is **_bold italic_**
  - `display` - indicate the `font-display` value to use when creating the css
- `local` - settings for local files that must be put in the folder of this module. It's value is an array of fonts:
  - `name` - indicate the name to give to the font
  - `file` - filename, must include extension
  - `weight` - indicate the weight of the font ( bold | normal | 100 | 200... 900)
  - `style` - indicate the style of the font (italic | normal)
  - `display` - indicate the `font-display` value to use when creating the css

The generated CSS font-family names created have automatically a `FF` (followed by a space) prefix added to the name indicated in the config, as to make sure that the CSS will use these generate fonts and not system fonts.

## Run

```bash
npm start
```

It will create a file with the format `ff-fonts${md5}.json` and it will output in the terminal the value of `md5`.
