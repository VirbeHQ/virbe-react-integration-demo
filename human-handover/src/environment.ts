declare global {
  interface Window {
    env: { [key: string]: string };
  }
}

export interface Env {
  ss: string;
  streamerId: string;
  profileId: string;
  profileSecret: string;
  dashboardUrl: string;
  publicPath: string;
}

function fetchEnv(name: string, defaultValue = ''): string {
  return (import.meta.env[`VITE_${name}`] ?? (window['env'] ? window['env'][name] : null) ?? defaultValue) as string;
}

const environment: Env = {
  ss: fetchEnv('SIGNALING_SERVER_URL', 'wss://virbe-signaling.local'),
  streamerId: fetchEnv('STREAMER_ID', 'DefaultStreamer'),
  profileId: fetchEnv('PROFILE_ID', ''),
  profileSecret: fetchEnv('PROFILE_SECRET', ''),
  dashboardUrl: fetchEnv('DASHBOARD_URL', ''),
  publicPath: fetchEnv('PUBLIC_PATH', '/'),
};

export default environment;
