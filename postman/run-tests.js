#!/usr/bin/env node

/**
 * Postman Collection Test Runner
 *
 * This script runs Postman collections using Newman (Postman's command-line runner)
 *
 * Usage:
 *   node run-tests.js [collection-name] [environment]
 *
 * Examples:
 *   node run-tests.js                          # Run all tests
 *   node run-tests.js tests                    # Run test collection
 *   node run-tests.js main                     # Run main collection
 *   node run-tests.js tests local              # Run tests with local environment
 */

import newman from 'newman';
import path from 'path';
import fs from 'fs';

// Configuration
const config = {
  collections: {
    main: 'Risha-BE-Updated.postman_collection.json',
    tests: 'Risha-BE-Tests.postman_collection.json',
    legacy: 'Risha-BE.postman_collection.json',
  },
  environments: {
    local: 'Risha-BE-Environment.postman_environment.json',
  },
  defaultCollection: 'tests',
  defaultEnvironment: 'local',
};

// Parse command line arguments
const COMMAND_LINE_OFFSET = 2;
const args = process.argv.slice(COMMAND_LINE_OFFSET);
const collectionName = args[0] || config.defaultCollection;
const environmentName = args[1] || config.defaultEnvironment;

// Resolve file paths
const collectionPath = path.join(__dirname, config.collections[collectionName]);
const environmentPath = path.join(__dirname, config.environments[environmentName]);

// Validate files exist
if (!fs.existsSync(collectionPath)) {
  // eslint-disable-next-line no-console
  console.error(`❌ Collection not found: ${collectionPath}`);
  // eslint-disable-next-line no-console
  console.error(`Available collections: ${Object.keys(config.collections).join(', ')}`);
  process.exit(1);
}

if (!fs.existsSync(environmentPath)) {
  // eslint-disable-next-line no-console
  console.error(`❌ Environment not found: ${environmentPath}`);
  // eslint-disable-next-line no-console
  console.error(`Available environments: ${Object.keys(config.environments).join(', ')}`);
  process.exit(1);
}

// eslint-disable-next-line no-console
console.log(`🚀 Running Postman Collection: ${collectionName}`);
// eslint-disable-next-line no-console
console.log(`🌍 Using Environment: ${environmentName}`);
// eslint-disable-next-line no-console
console.log(`📁 Collection Path: ${collectionPath}`);
// eslint-disable-next-line no-console
console.log(`⚙️  Environment Path: ${environmentPath}`);
// eslint-disable-next-line no-console
console.log('');

// Newman options
const newmanOptions = {
  collection: collectionPath,
  environment: environmentPath,
  reporters: ['cli', 'json', 'html'],
  reporter: {
    html: {
      export: path.join(__dirname, 'test-results.html'),
    },
    json: {
      export: path.join(__dirname, 'test-results.json'),
    },
  },
  insecure: true, // Allow self-signed certificates
  timeout: 30000, // 30 second timeout
  delayRequest: 100, // 100ms delay between requests
  bail: false, // Don't stop on first failure
  verbose: true,
};

// Run Newman
newman.run(newmanOptions, function handleNewmanRun(err, summary) {
  if (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Collection run failed:', err);
    process.exit(1);
  }

  // Print summary
  // eslint-disable-next-line no-console
  console.log('\n📊 Test Summary:');
  // eslint-disable-next-line no-console
  console.log('================');
  // eslint-disable-next-line no-console
  console.log(`Total Requests: ${summary.run.stats.requests.total}`);
  // eslint-disable-next-line no-console
  console.log(`Passed: ${summary.run.stats.requests.total - summary.run.stats.requests.failed}`);
  // eslint-disable-next-line no-console
  console.log(`Failed: ${summary.run.stats.requests.failed}`);
  // eslint-disable-next-line no-console
  console.log(`Total Assertions: ${summary.run.stats.assertions.total}`);
  // eslint-disable-next-line no-console
  console.log(`Passed Assertions: ${summary.run.stats.assertions.total - summary.run.stats.assertions.failed}`);
  // eslint-disable-next-line no-console
  console.log(`Failed Assertions: ${summary.run.stats.assertions.failed}`);
  // eslint-disable-next-line no-console
  console.log(`Total Time: ${summary.run.timings.completed - summary.run.timings.started}ms`);

  // Print failed tests
  if (summary.run.failures && summary.run.failures.length > 0) {
    // eslint-disable-next-line no-console
    console.log('\n❌ Failed Tests:');
    // eslint-disable-next-line no-console
    console.log('================');
    summary.run.failures.forEach((failure, index) => {
      // eslint-disable-next-line no-console
      console.log(`${index + 1}. ${failure.source.name || 'Unknown'}`);
      // eslint-disable-next-line no-console
      console.log(`   Error: ${failure.error.message}`);
      if (failure.error.test) {
        // eslint-disable-next-line no-console
        console.log(`   Test: ${failure.error.test}`);
      }
      // eslint-disable-next-line no-console
      console.log('');
    });
  }

  // Print report locations
  // eslint-disable-next-line no-console
  console.log('\n📋 Reports Generated:');
  // eslint-disable-next-line no-console
  console.log('====================');
  // eslint-disable-next-line no-console
  console.log(`HTML Report: ${path.join(__dirname, 'test-results.html')}`);
  // eslint-disable-next-line no-console
  console.log(`JSON Report: ${path.join(__dirname, 'test-results.json')}`);

  // Exit with appropriate code
  const exitCode = summary.run.failures.length > 0 ? 1 : 0;
  // eslint-disable-next-line no-console
  console.log(`\n${exitCode === 0 ? '✅ All tests passed!' : '❌ Some tests failed!'}`);
  process.exit(exitCode);
});

// Handle process termination
const SIGINT_EXIT_CODE = 130;
process.on('SIGINT', function handleSIGINT() {
  // eslint-disable-next-line no-console
  console.log('\n🛑 Test run interrupted by user');
  process.exit(SIGINT_EXIT_CODE);
});

const SIGTERM_EXIT_CODE = 143;
process.on('SIGTERM', function handleSIGTERM() {
  // eslint-disable-next-line no-console
  console.log('\n🛑 Test run terminated');
  process.exit(SIGTERM_EXIT_CODE);
});
