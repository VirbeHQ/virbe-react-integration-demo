function hostName(host?: string): string | undefined {
  return host?.split(':')[0];
}

function extractHostName(url: string): string | undefined {
  try {
    const parsedUrl = new URL(url);
    return hostName(parsedUrl.host.toLowerCase());
  } catch (_error) {
    return undefined;
  }
}

function originHostName(): string | undefined {
  return window.origin ? extractHostName(window.origin) : undefined;
}

function locationHostName(): string | undefined {
  return window.location?.host ? extractHostName(window.location.host) : undefined;
}

function parentLocationHostName(): string | undefined {
  return window.parent?.location?.host ? extractHostName(window.parent.location.host) : undefined;
}

function documentLocationHostName(): string | undefined {
  return document.location?.host ? extractHostName(document.location.host) : undefined;
}

export function getHost() {
  return originHostName() || locationHostName() || parentLocationHostName() || documentLocationHostName() || 'undefined';
}
