import {valid} from 'semver';

// Convert version to a semver value.
// 2.5 -> 2.5.0; 1 -> 1.0.0;
export default function semverify(version: string): string {
    if (valid(version)) {
        return version;
    }

    const parts: string[] = version.split('.');

    while (parts.length < 3) {
        parts.push('0');
    }

    return parts.join('.');
}
