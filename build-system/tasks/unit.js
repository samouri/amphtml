/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'using strict';

const argv = require('minimist')(process.argv.slice(2));
const {
  maybePrintArgvMessages,
  shouldNotRun,
} = require('./runtime-test/helpers');
const {
  RuntimeTestRunner,
  RuntimeTestConfig,
} = require('./runtime-test/runtime-test-base');
const {compileAmpScriptWorker} = require('./extension-helpers.js');
const {compileJison} = require('./compile-jison');
const {css} = require('./css');
const {getUnitTestsToRun} = require('./runtime-test/helpers-unit');

class Runner extends RuntimeTestRunner {
  constructor(config) {
    super(config);
  }

  /** @override */
  async maybeBuild() {
    if (argv.nobuild) {
      return;
    }

    await Promise.all([css(), compileJison(), compileAmpScriptWorker()]);
  }
}

async function unit() {
  if (shouldNotRun()) {
    return;
  }

  maybePrintArgvMessages();

  if (argv.local_changes && !getUnitTestsToRun()) {
    return;
  }

  const config = new RuntimeTestConfig('unit');
  const runner = new Runner(config);

  await runner.setup();
  await runner.run();
  await runner.teardown();
}

module.exports = {
  unit,
};

unit.description = 'Runs unit tests';
unit.flags = {
  'chrome_canary': '  Runs tests on Chrome Canary',
  'chrome_flags': '  Uses the given flags to launch Chrome',
  'coverage': '  Run tests in code coverage mode',
  'firefox': '  Runs tests on Firefox',
  'files': '  Runs tests for specific files',
  'grep': '  Runs tests that match the pattern',
  'headless': '  Run tests in a headless Chrome window',
  'ie': '  Runs tests on IE',
  'local_changes':
    '  Run unit tests directly affected by the files changed in the local branch',
  'nobuild': '  Skips build step',
  'nohelp': '  Silence help messages that are printed prior to test run',
  'safari': '  Runs tests on Safari',
  'saucelabs': '  Runs tests on saucelabs (requires setup)',
  'testnames': '  Lists the name of each test being run',
  'verbose': '  With logging enabled',
  'watch': '  Watches for changes in files, runs corresponding test(s)',
};
