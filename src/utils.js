const fs = require('fs');
const crypto = require('crypto');

/**
 * Prefix font-family value with `FF `
 * @param {string} input
 * @returns {string}
 */
const ff = input => {
  const search = "@font-face{font-family:'";
  const regSearch = new RegExp(search, 'g');
  const replace = `${search}FF `;

  return input.replace(regSearch, replace);
};

/**
 * Get format of file from its extension
 * @param {string} file File name
 * @returns {string}
 */
const getFormatLocal = file => {
  const dot = file.lastIndexOf('.');

  if (dot < 0) {
    return '';
  }

  return file.slice(dot + 1);
};

/**
 * Generate css for @font-face
 * @param {Object} param0 parameters are passed as one object
 * @param {string} param0.name font-family value
 * @param {string} [param0.display] font-display value
 * @param {string} [param0.weight] font-weight value
 * @param {string} [param0.style] font-style value
 * @param {string} param0.format format value inside src value
 * @param {string} param0.data url value inside src value in base64
 * @returns {string}
 */
const generateLocalCss = ({ name, display, weight, style, format, data }) => {
  if (!name || !format || !data) {
    return '';
  }

  const _start = `@font-face{font-family:'${name}';`;
  const _display = display ? `font-display:${display};` : '';
  const _weight = weight ? `font-weight:${weight};` : '';
  const _style = style ? `font-style:${style};` : '';
  const _src = `src:url(data:application/font-${format};base64,${data}) format('${format}')}`;

  return `${_start}${_display}${_weight}${_style}${_src}`;
};

/**
 * Convert file in base64 data
 * @param {string} file file name
 * @param {string} folder file path
 * @returns {string}
 */
const convertLocal = (file, folder) => {
  try {
    const data = fs.readFileSync(`${folder}${file}`);

    return data.toString('base64');
  } catch (err) {
    return '';
  }
};

/**
 * Generate Google Fonts params
 * @param {Object} config
 * @param {string} config.name
 * @param {string[]} config.formats
 * @returns {string}
 */
const generateGoogleUrl = config => {
  const { name, formats = [] } = config;
  const _formats = formats.join(',');

  return `${name}${_formats ? `:${_formats}` : ''}`;
};

/**
 * Generate Google Fonts url
 * @param {Array} config
 * @param {string} googleUrl
 * @returns {string}
 */
const generateGoogleUrls = (config = [], googleUrl) => {
  return googleUrl + config.map(font => generateGoogleUrl(font)).join('|');
};

/**
 * Create md5 of a string
 * @param {string} input
 * @returns {string}
 */
const generateMd5 = input => {
  return crypto
    .createHash('md5')
    .update(input)
    .digest('hex');
};

/**
 * Create css for local font
 * @param {Object} config
 * @param {string} inputFolder
 * @return {string}
 */
const generateLocal = (config, inputFolder) => {
  const { name, file, display, weight, style } = config;
  const data = convertLocal(file, inputFolder);
  const format = getFormatLocal(file);
  const css = generateLocalCss({ name, display, weight, style, format, data });

  return css;
};

/**
 * Create css for local fonts
 * @param {Array} config
 * @param {string} inputFolder
 * @returns {string}
 */
const generateLocals = (config = [], inputFolder) => {
  return config.map(font => generateLocal(font, inputFolder)).join('');
};

/**
 * Add `font-display` to Google Fonts
 * @param {string} css
 * @param {Array} config
 * @returns {string}
 */
const addDisplayGoogleFonts = (css, config = []) => {
  return config.reduce((acc, currentValue) => {
    const { name, display } = currentValue;

    if (display) {
      const search = `@font-face{font-family:'${name}';`;
      const regSearch = new RegExp(search, 'g');
      const replace = `${search}font-display:${display};`;

      return acc.replace(regSearch, replace);
    }

    return acc;
  }, css);
};

module.exports = {
  ff,
  getFormatLocal,
  generateLocalCss,
  convertLocal,
  generateGoogleUrl,
  generateGoogleUrls,
  generateMd5,
  generateLocal,
  generateLocals,
  addDisplayGoogleFonts
};
