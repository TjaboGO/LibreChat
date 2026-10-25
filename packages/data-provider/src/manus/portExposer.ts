import type { ExposedPortInfo, PortProtocol } from './types';

/**
 * Deterministic Port Exposure Engine
 * Implements Manus-grade deploy_expose_port, deploy_get_exposed_ports, deploy_close_port.
 */
export class PortExposer {
  private exposedPorts: Map<number, ExposedPortInfo> = new Map();
  private baseProxyHost: string;

  constructor(baseProxyHost = 'localhost') {
    this.baseProxyHost = baseProxyHost;
  }

  /**
   * deploy_expose_port: Expose local port for preview and public access
   */
  public exposePort(
    port: number,
    protocol: PortProtocol = 'http',
    ttlMinutes = 60,
    targetService?: string,
  ): {
    success: boolean;
    info: ExposedPortInfo;
    message: string;
  } {
    if (port < 1 || port > 65535) {
      throw new Error(`Invalid port number: ${port}. Must be between 1 and 65535.`);
    }

    const now = Date.now();
    const expiresAt = ttlMinutes > 0 ? now + ttlMinutes * 60 * 1000 : undefined;

    const localUrl = `${protocol}://${this.baseProxyHost}:${port}`;
    const exposedUrl =
      this.baseProxyHost === 'localhost'
        ? localUrl
        : `${protocol}://port-${port}.${this.baseProxyHost}`;

    const info: ExposedPortInfo = {
      port,
      protocol,
      exposedUrl,
      localUrl,
      targetService: targetService || `Service running on port ${port}`,
      createdAt: now,
      expiresAt,
      status: 'active',
    };

    this.exposedPorts.set(port, info);

    return {
      success: true,
      info,
      message: `Port ${port} exposed successfully via ${exposedUrl} (Valid for ${ttlMinutes}m).`,
    };
  }

  /**
   * deploy_get_exposed_ports: List all currently active exposed ports
   */
  public getExposedPorts(): ExposedPortInfo[] {
    const now = Date.now();
    const active: ExposedPortInfo[] = [];

    for (const [port, info] of Array.from(this.exposedPorts.entries())) {
      if (info.expiresAt && now > info.expiresAt) {
        info.status = 'closed';
        continue;
      }
      if (info.status === 'active') {
        active.push({ ...info });
      }
    }

    return active.sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * deploy_close_port: Close an exposed port
   */
  public closePort(port: number): {
    success: boolean;
    message: string;
  } {
    const existing = this.exposedPorts.get(port);
    if (!existing) {
      return {
        success: false,
        message: `Port ${port} is not currently registered as exposed.`,
      };
    }

    existing.status = 'closed';
    this.exposedPorts.delete(port);

    return {
      success: true,
      message: `Port ${port} has been closed and forwarding has ceased.`,
    };
  }

  /**
   * Check if a specific port is actively exposed
   */
  public isPortExposed(port: number): boolean {
    const info = this.exposedPorts.get(port);
    if (!info || info.status !== 'active') {
      return false;
    }
    if (info.expiresAt && Date.now() > info.expiresAt) {
      info.status = 'closed';
      return false;
    }
    return true;
  }
}

/** Global default port exposer instance */
export const defaultPortExposer = new PortExposer();
