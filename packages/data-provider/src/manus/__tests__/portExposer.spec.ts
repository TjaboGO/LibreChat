import { PortExposer } from '../portExposer';

describe('Manus PortExposer', () => {
  let exposer: PortExposer;

  beforeEach(() => {
    exposer = new PortExposer('localhost');
  });

  it('exposes a valid local port with protocol and generated URLs', () => {
    const res = exposer.exposePort(5173, 'http', 30, 'Vite Dev Server');
    expect(res.success).toBe(true);
    expect(res.info.port).toBe(5173);
    expect(res.info.protocol).toBe('http');
    expect(res.info.localUrl).toBe('http://localhost:5173');
    expect(res.info.status).toBe('active');
    expect(exposer.isPortExposed(5173)).toBe(true);
  });

  it('rejects invalid port numbers outside 1-65535', () => {
    expect(() => exposer.exposePort(0)).toThrow(/Invalid port number/);
    expect(() => exposer.exposePort(70000)).toThrow(/Invalid port number/);
  });

  it('lists active exposed ports', () => {
    exposer.exposePort(3000);
    exposer.exposePort(8000);

    const ports = exposer.getExposedPorts();
    expect(ports).toHaveLength(2);
    expect(ports.map((p) => p.port)).toContain(3000);
    expect(ports.map((p) => p.port)).toContain(8000);
  });

  it('closes an active exposed port via deploy_close_port', () => {
    exposer.exposePort(4000);
    expect(exposer.isPortExposed(4000)).toBe(true);

    const closeRes = exposer.closePort(4000);
    expect(closeRes.success).toBe(true);
    expect(exposer.isPortExposed(4000)).toBe(false);
    expect(exposer.getExposedPorts()).toHaveLength(0);
  });
});
