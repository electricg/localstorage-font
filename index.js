const fs = require("fs");
const crypto = require("crypto");
const fontStore = require("font-store/lib/fontStore");

const googleOptions = { format: "woff" };
const googleUrl = "https://fonts.googleapis.com/css?family=";
const config = require("./config");

const convertLocal = file => {
  const data = fs.readFileSync(file);

  return data.toString("base64");
};

const generateLocalCss = ({ name, weight, style, format, data }) => {
  const _start = `@font-face{font-family:'${name}';`;
  const _weight = weight ? `font-weight:${weight};` : "";
  const _style = style ? `font-style:${style};` : "";
  const _src = `src:url(data:application/font-${format};base64,${data}) format('${format}')}`;

  return `${_start}${_weight}${_style}${_src}`;
};

const getFormatLocal = file => {
  const dot = file.lastIndexOf(".");

  return file.slice(dot + 1);
};

const generateLocal = config => {
  const { name, file, weight, style } = config;
  const data = convertLocal(file);
  const format = getFormatLocal(file);
  const css = generateLocalCss({ name, weight, style, format, data });

  return css;
};

const generateLocals = config => {
  return config.map(font => generateLocal(font)).join(" ");
};

const generateGoogleUrl = config => {
  const { name, formats = [] } = config;
  const _formats = formats.join(",");

  return `${name}${_formats ? ":" + _formats : ""}`;
};

const generateGoogleUrls = (config, googleUrl) => {
  return googleUrl + config.map(font => generateGoogleUrl(font)).join("|");
};

const generateMd5 = data => {
  return crypto
    .createHash("md5")
    .update(data)
    .digest("hex");
};

const ff = data => {
  const search = "@font-face{font-family:'";
  const regSearch = new RegExp(search, "g");
  const replace = search + "FF ";

  return data.replace(regSearch, replace);
};

const doIt = (config, googleOptions, googleUrl) => {
  const { google = [], local = [] } = config;
  const url = generateGoogleUrls(google, googleUrl);
  const localFonts = generateLocals(local);

  fontStore(url, googleOptions, (err, fileName, json) => {
    if (err) {
      console.log("Oops. An error occurred:", err.message);
      process.exit(1);
    }

    const { md5, value } = json;

    const newValue = `${value}${localFonts}`;
    const newMd5 = generateMd5(newValue);
    const newJson = { md5: newMd5, value: ff(newValue) };
    const newFilename = ["ff-fonts", newMd5, "json"].join(".");

    fs.unlinkSync(fileName);
    fs.writeFileSync(newFilename, JSON.stringify(newJson));

    console.log(newMd5);
  });
};

doIt(config, googleOptions, googleUrl);
