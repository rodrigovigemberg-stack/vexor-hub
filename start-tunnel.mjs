import { startTunnel } from 'untun';

async function run() {
  try {
    const tunnel = await startTunnel({ port: 8888 });
    const url = await tunnel.getURL();
    console.log(`VEXOR_HUB_TUNNEL_URL: ${url}`);
  } catch (err) {
    console.error('Erro ao iniciar tunel:', err);
  }
}

run();
