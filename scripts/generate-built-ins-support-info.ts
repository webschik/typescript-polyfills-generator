// @ts-ignore
import compatEnvs from 'compat-table/environments';
// @ts-ignore
import {versions as electronToChromiumVersions} from 'electron-to-chromium';
import * as fs from 'fs';
import {flattenDeep, pickBy} from 'lodash';
import * as path from 'path';
import * as semver from 'semver';
import {promisify} from 'util';
import semverify from '../src/semverify';

const features: {[key: string]: any} = require('../data/built-in-features');

interface TestResult {
    name: string;
    res: {[key: string]: any};
}

interface Test {
    name: string;
    res: {[key: string]: any};
    subtests?: Test[];
    [key: string]: any;
}

interface TestSource {
    tests: Test[];
    browsers: {[key: string]: any};
}

interface FeatureOptions {
    features: string[];
}

const writeFile = promisify(fs.writeFile);
const unreleasedLabels = {
    safari: 'tp'
};
const environments = ['chrome', 'opera', 'edge', 'firefox', 'safari', 'node', 'ie', 'android', 'ios'];
const electronToChromiumKeys = Object.keys(electronToChromiumVersions).reverse();
const chromiumToElectronMap = electronToChromiumKeys.reduce((all, electron) => {
    all[electronToChromiumVersions[electron]] = +electron;
    return all;
}, {});
const chromiumToElectronVersions: string[] = Object.keys(chromiumToElectronMap);
const findClosestElectronVersion = (targetVersion: number): string | void => {
    const chromiumVersionsLength = chromiumToElectronVersions.length;
    const maxChromium: number = +chromiumToElectronVersions[chromiumVersionsLength - 1];

    if (targetVersion > maxChromium) {
        return;
    }

    const closestChrome: string | void = chromiumToElectronVersions.find((version: string) => {
        return targetVersion <= Number(version);
    });

    return closestChrome && chromiumToElectronMap[closestChrome as string];
};
const chromiumToElectron = (chromium: string) => {
    return chromiumToElectronMap[chromium] || findClosestElectronVersion(+chromium);
};
const byTestSuite = (suite: string) => (browser: {test_suites: string[]}) => {
    return Array.isArray(browser.test_suites) ? browser.test_suites.indexOf(suite) > -1 : true;
};
const renameTests = (tests: Test[], getName: (name: string) => string, category: string): Test[] => {
    return tests.map((test: Test) => {
        return Object.assign({}, test, {
            name: getName(test.name),
            category
        });
    });
};
const compatSources: TestSource[] = ['es5', 'es6', 'es2016plus', 'esnext'].reduce((result: TestSource[], source) => {
    const data: TestSource = require(`compat-table/data-${source}`);

    data.browsers = pickBy(compatEnvs as {[key: string]: any}, byTestSuite(source));
    result.push(data);

    return result;
}, []);
const compatibilityTests = flattenDeep(
    compatSources.map((data: TestSource) => {
        return data.tests.map((test: Test) => {
            return test.subtests
                ? [test, renameTests(test.subtests, (name) => test.name + ' / ' + name, test.category)]
                : test;
        });
    })
);
const getLowestImplementedVersion = ({features}: FeatureOptions, env: string) => {
    const tests: TestResult[] = compatibilityTests
        .filter((test: Test) => {
            return (
                features.indexOf(test.name) >= 0 ||
                // for features === ["DataView"]
                // it covers "DataView (Int8)" and "DataView (UInt8)"
                (features.length === 1 && test.name.indexOf(features[0]) === 0)
            );
        })
        .reduce((result: TestResult[], test: Test) => {
            if (!test.subtests) {
                result.push({
                    name: test.name,
                    res: test.res
                });
            } else {
                test.subtests.forEach((subtest) => {
                    result.push({
                        name: `${test.name}/${subtest.name}`,
                        res: subtest.res
                    });
                });
            }

            return result;
        }, []);

    const unreleasedLabelForEnv: string = unreleasedLabels[env];
    const envTests = tests.map(({res}: TestResult, i: number) => {
        return (
            Object.keys(res)
                .filter((test: string) => {
                    return test.startsWith(env) && (tests[i].res[test] === true || tests[i].res[test] === 'strict');
                })
                // normalize some keys and get version from full string.
                .map((test: string) => test.replace('_', '.').replace(env, ''))
                // version must be label from the unreleasedLabels (like tp) or number.
                .filter((version: string) => unreleasedLabelForEnv === version || !isNaN(parseFloat(version)))
                .shift()
        );
    });

    const envFiltered = envTests.filter((test: string | void) => test);

    if (envTests.length > envFiltered.length || envTests.length === 0) {
        return;
    }

    return envTests.map((test: string) => test.replace(env, '')).reduce((version: string, label: string) => {
        if (label === unreleasedLabelForEnv) {
            return label;
        }

        return semver.lt(semver.coerce(version) as any, semver.coerce(label) as any) ? label : version;
    });
};

const builtInsSupportInfo = {
    'es6.fetch': {
        chrome: '42.0.0',
        edge: '14.0.0',
        opera: '29.0.0',
        firefox: '39.0.0',
        ios: '10.0.0',
        safari: '10.0.0',
        electron: chromiumToElectron('42')
    }
};

for (const feature in builtInsSupportInfo) {
    if (Object.prototype.hasOwnProperty.call(builtInsSupportInfo, feature)) {
        const supportInfo = builtInsSupportInfo[feature];

        if (supportInfo.chrome) {
            const electronVersion = chromiumToElectron(supportInfo.chrome.split('.')[0]);

            if (electronVersion) {
                supportInfo.electron = semverify(String(electronVersion));
            }
        }
    }
}

Object.keys(features)
    .sort()
    .forEach((feature) => {
        let options: string | FeatureOptions = features[feature];

        if (!(options as FeatureOptions).features) {
            options = {
                features: [options as string]
            };
        }

        const supportInfo: {[key: string]: string} = Object.create(null);

        environments.forEach((env: string) => {
            const version: string | void = getLowestImplementedVersion(options as FeatureOptions, env);

            if (version !== undefined) {
                supportInfo[env] = String(version);
            }
        });

        if (supportInfo.chrome) {
            // add opera
            if (Number(supportInfo.chrome) >= 28) {
                supportInfo.opera = (+supportInfo.chrome - 13).toString();
            } else if (Number(supportInfo.chrome) === 5) {
                supportInfo.opera = '12';
            }

            // add electron
            const electronVersion = chromiumToElectron(supportInfo.chrome);

            if (electronVersion) {
                supportInfo.electron = electronVersion.toString();
            }
        }

        if (supportInfo.ie && !supportInfo.edge) {
            supportInfo.edge = '12';
        }

        for (const env in supportInfo) {
            if (Object.prototype.hasOwnProperty.call(supportInfo, env)) {
                supportInfo[env] = semverify(supportInfo[env] as string);
            }
        }

        builtInsSupportInfo[feature] = supportInfo;
    });

writeFile(path.resolve(__dirname, '../data/built-ins.json'), JSON.stringify(builtInsSupportInfo, null, 2)).catch(
    console.error
);
