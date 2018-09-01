const versionPattern: RegExp = /^es[0-9]+\./;

export default function normalizeBuiltInName (name: string): string {
    return name.replace(versionPattern, '');
}