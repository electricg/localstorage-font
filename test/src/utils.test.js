const utils = require('../../src/utils');

const {
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
} = utils;

describe('ff', () => {
  const o = [
    {
      desc: 'should succeed with a single find',
      input: "@font-face{font-family:'Test';",
      output: "@font-face{font-family:'FF Test';"
    },
    {
      desc: 'should succeed with multiple finds',
      input: "@font-face{font-family:'Test'}@font-face{font-family:'Test2'}",
      output:
        "@font-face{font-family:'FF Test'}@font-face{font-family:'FF Test2'}"
    },
    {
      desc: 'should succeed with no find',
      input: '@font-face{font-size:10px;',
      output: '@font-face{font-size:10px;'
    }
  ];

  o.forEach(item => {
    it(item.desc, done => {
      const output = ff(item.input);

      should.deepEqual(output, item.output);
      done();
    });
  });
});

describe('getFormatLocal', () => {
  const o = [
    {
      desc: 'should succeed with one dot in the filename',
      input: 'file.ext',
      output: 'ext'
    },
    {
      desc: 'should succeed with two dots in the filename',
      input: 'file.abc.def',
      output: 'def'
    },
    {
      desc: 'should succeed with one dot at the beginning the filename',
      input: '.ext',
      output: 'ext'
    },
    {
      desc: 'should succeed with one dot at the end the filename',
      input: 'file.',
      output: ''
    },
    {
      desc: 'should succeed with no dots in the filename',
      input: 'file',
      output: ''
    }
  ];

  o.forEach(item => {
    it(item.desc, done => {
      const output = getFormatLocal(item.input);

      should.deepEqual(output, item.output);
      done();
    });
  });
});

describe('generateLocalCss', () => {
  const o = [
    {
      desc: 'should succeed with name, format, data',
      input: {
        name: 'Name Abc',
        format: 'woff',
        data: 'fake data'
      },
      output:
        "@font-face{font-family:'Name Abc';src:url(data:application/font-woff;base64,fake data) format('woff')}"
    },
    {
      desc: 'should succeed with name, display, format, data',
      input: {
        name: 'Name Abc',
        display: 'block',
        format: 'woff',
        data: 'fake data'
      },
      output:
        "@font-face{font-family:'Name Abc';font-display:block;src:url(data:application/font-woff;base64,fake data) format('woff')}"
    },
    {
      desc: 'should succeed with name, weight, format, data',
      input: {
        name: 'Name Abc',
        weight: 'bold',
        format: 'woff',
        data: 'fake data'
      },
      output:
        "@font-face{font-family:'Name Abc';font-weight:bold;src:url(data:application/font-woff;base64,fake data) format('woff')}"
    },
    {
      desc: 'should succeed with name, style, format, data',
      input: {
        name: 'Name Abc',
        style: 'italic',
        format: 'woff',
        data: 'fake data'
      },
      output:
        "@font-face{font-family:'Name Abc';font-style:italic;src:url(data:application/font-woff;base64,fake data) format('woff')}"
    },
    {
      desc: 'should succeed with all the params',
      input: {
        name: 'Name Abc',
        display: 'block',
        weight: 'bold',
        style: 'italic',
        format: 'woff',
        data: 'fake data'
      },
      output:
        "@font-face{font-family:'Name Abc';font-display:block;font-weight:bold;font-style:italic;src:url(data:application/font-woff;base64,fake data) format('woff')}"
    },
    {
      desc: 'should return empty string with no name',
      input: {
        format: 'woff',
        data: 'fake data'
      },
      output: ''
    },
    {
      desc: 'should return empty string with no format',
      input: {
        name: 'Name Abc',
        data: 'fake data'
      },
      output: ''
    },
    {
      desc: 'should return empty string with no data',
      input: {
        name: 'Name Abc',
        format: 'woff'
      },
      output: ''
    }
  ];

  o.forEach(item => {
    it(item.desc, done => {
      const output = generateLocalCss(item.input);

      should.deepEqual(output, item.output);
      done();
    });
  });
});

describe('convertLocal', () => {
  const inputFolder = 'test/data/';
  const o = [
    {
      desc: 'should succeed',
      input: 'input.txt',
      output: 'Y2lhbwo='
    },
    {
      desc: 'should fail and return empty string when file is not found',
      input: 'noinput.txt',
      output: ''
    }
  ];

  o.forEach(item => {
    it(item.desc, done => {
      const output = convertLocal(item.input, inputFolder);

      should.deepEqual(output, item.output);
      done();
    });
  });
});

describe('generateGoogleUrl', () => {
  const o = [
    {
      desc: 'should succeed with passing multiple formats',
      input: {
        name: 'Lato Test',
        formats: ['300', '300i', '400']
      },
      output: 'Lato Test:300,300i,400'
    },
    {
      desc: 'should succeed with passing no formats',
      input: {
        name: 'Lato Test'
      },
      output: 'Lato Test'
    },
    {
      desc: 'should succeed with passing one format',
      input: {
        name: 'Lato Test',
        formats: ['300']
      },
      output: 'Lato Test:300'
    }
  ];

  o.forEach(item => {
    it(item.desc, done => {
      const output = generateGoogleUrl(item.input);

      should.deepEqual(output, item.output);
      done();
    });
  });
});

describe('generateGoogleUrls', () => {
  const googleUrl = 'https://fonts.googleapis.com/css?family=';
  const o = [
    {
      desc: 'should succeed with passing one font',
      input: [
        {
          name: 'Lato Test',
          formats: ['300']
        }
      ],
      output: 'https://fonts.googleapis.com/css?family=Lato Test:300'
    },
    {
      desc: 'should succeed with passing no fonts',
      input: [],
      output: 'https://fonts.googleapis.com/css?family='
    },
    {
      desc: 'should succeed with passing multiple fonts',
      input: [
        {
          name: 'Lato Test',
          formats: ['300', '300i']
        },
        {
          name: 'Rubik'
        }
      ],
      output: 'https://fonts.googleapis.com/css?family=Lato Test:300,300i|Rubik'
    }
  ];

  o.forEach(item => {
    it(item.desc, done => {
      const output = generateGoogleUrls(item.input, googleUrl);

      should.deepEqual(output, item.output);
      done();
    });
  });
});

describe('generateMd5', () => {
  const o = [
    {
      desc: 'should succeed',
      input: 'ciao',
      output: '6e6bc4e49dd477ebc98ef4046c067b5f'
    },
    {
      desc: 'should succeed with empty string',
      input: '',
      output: 'd41d8cd98f00b204e9800998ecf8427e'
    }
  ];

  o.forEach(item => {
    it(item.desc, done => {
      const output = generateMd5(item.input);

      should.deepEqual(output, item.output);
      done();
    });
  });
});

describe('generateLocal', () => {
  const inputFolder = 'test/data/';
  const o = [
    {
      desc: 'should succeed',
      input: {
        name: 'Name Abc',
        file: 'input.woff',
        weight: 'bold',
        style: 'italic',
        display: 'block'
      },
      output:
        "@font-face{font-family:'Name Abc';font-display:block;font-weight:bold;font-style:italic;src:url(data:application/font-woff;base64,Y2lhbwo=) format('woff')}"
    }
  ];

  o.forEach(item => {
    it(item.desc, done => {
      const output = generateLocal(item.input, inputFolder);

      should.deepEqual(output, item.output);
      done();
    });
  });
});

describe('generateLocals', () => {
  const inputFolder = 'test/data/';
  const o = [
    {
      desc: 'should succeed',
      input: [
        {
          name: 'Name Abc',
          file: 'input.woff',
          weight: 'bold',
          style: 'italic',
          display: 'block'
        },
        {
          name: 'Name Def',
          file: 'input.woff',
          weight: '200',
          style: 'oblique',
          display: 'fallback'
        }
      ],
      output:
        "@font-face{font-family:'Name Abc';font-display:block;font-weight:bold;font-style:italic;src:url(data:application/font-woff;base64,Y2lhbwo=) format('woff')}@font-face{font-family:'Name Def';font-display:fallback;font-weight:200;font-style:oblique;src:url(data:application/font-woff;base64,Y2lhbwo=) format('woff')}"
    }
  ];

  o.forEach(item => {
    it(item.desc, done => {
      const output = generateLocals(item.input, inputFolder);

      should.deepEqual(output, item.output);
      done();
    });
  });
});

describe('addDisplayGoogleFonts', () => {
  const o = [
    {
      desc: 'should succeed with one font with display',
      input: {
        css: "@font-face{font-family:'Lato';font-style:italic;",
        config: [
          {
            name: 'Lato',
            display: 'swap'
          }
        ]
      },
      output:
        "@font-face{font-family:'Lato';font-display:swap;font-style:italic;"
    },
    {
      desc: 'should succeed with multiple fonts both with display',
      input: {
        css:
          "@font-face{font-family:'Lato';font-style:italic;}@font-face{font-family:'Rubik';font-weight:bold;}",
        config: [
          {
            name: 'Lato',
            display: 'swap'
          },
          {
            name: 'Rubik',
            display: 'fallback'
          }
        ]
      },
      output:
        "@font-face{font-family:'Lato';font-display:swap;font-style:italic;}@font-face{font-family:'Rubik';font-display:fallback;font-weight:bold;}"
    },
    {
      desc: 'should succeed with multiple fonts both without display',
      input: {
        css:
          "@font-face{font-family:'Lato';font-style:italic;}@font-face{font-family:'Rubik';font-weight:bold;}",
        config: [
          {
            name: 'Lato'
          },
          {
            name: 'Rubik'
          }
        ]
      },
      output:
        "@font-face{font-family:'Lato';font-style:italic;}@font-face{font-family:'Rubik';font-weight:bold;}"
    },
    {
      desc: 'should succeed with multiple fonts only first with display',
      input: {
        css:
          "@font-face{font-family:'Lato';font-style:italic;}@font-face{font-family:'Rubik';font-weight:bold;}",
        config: [
          {
            name: 'Lato',
            display: 'swap'
          },
          {
            name: 'Rubik'
          }
        ]
      },
      output:
        "@font-face{font-family:'Lato';font-display:swap;font-style:italic;}@font-face{font-family:'Rubik';font-weight:bold;}"
    },
    {
      desc: 'should succeed with multiple fonts only last with display',
      input: {
        css:
          "@font-face{font-family:'Lato';font-style:italic;}@font-face{font-family:'Rubik';font-weight:bold;}",
        config: [
          {
            name: 'Lato'
          },
          {
            name: 'Rubik',
            display: 'fallback'
          }
        ]
      },
      output:
        "@font-face{font-family:'Lato';font-style:italic;}@font-face{font-family:'Rubik';font-display:fallback;font-weight:bold;}"
    }
  ];

  o.forEach(item => {
    it(item.desc, done => {
      const output = addDisplayGoogleFonts(item.input.css, item.input.config);

      should.deepEqual(output, item.output);
      done();
    });
  });
});
