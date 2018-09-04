if (typeof location !== 'undefined' && !location.origin) {
    (location as any).origin = `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}`;
}
