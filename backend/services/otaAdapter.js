/**
 * OTA Integration Adapter Architecture
 *
 * Provides a standardized adapter interface for property channel management.
 * In this initial implementation, VIA OTA and VIA OTA EXCHANGE operate as verified
 * source channels and external ID mappings without assuming speculative live sync endpoints.
 */

export const OTA_SOURCES = {
  VIA_OTA: 'VIA_OTA',
  VIA_OTA_EXCHANGE: 'VIA_OTA_EXCHANGE',
}

export const SYNC_STATUS = {
  NOT_APPLICABLE: 'NOT_APPLICABLE',
  PENDING: 'PENDING',
  SYNCED: 'SYNCED',
  FAILED: 'FAILED',
}

export class BaseOTAProviderAdapter {
  constructor(sourceType) {
    this.sourceType = sourceType
  }

  /**
   * Validate external property ID format
   */
  validateExternalId(externalId) {
    if (!externalId) return { valid: true }
    const cleaned = String(externalId).trim()
    if (cleaned.length > 80) {
      return { valid: false, error: 'External ID cannot exceed 80 characters' }
    }
    return { valid: true, cleaned }
  }

  /**
   * Check connection / integration status
   * Currently returns informative label status without claiming live syncing
   */
  async checkSyncCapability() {
    return {
      source: this.sourceType,
      isLiveSyncConfigured: false,
      message: `${this.sourceType} mapping active. Real-time external synchronization requires carrier API configuration.`,
      status: SYNC_STATUS.NOT_APPLICABLE,
    }
  }
}

class ViaOTAAdapter extends BaseOTAProviderAdapter {
  constructor() {
    super(OTA_SOURCES.VIA_OTA)
  }
}

class ViaOTAExchangeAdapter extends BaseOTAProviderAdapter {
  constructor() {
    super(OTA_SOURCES.VIA_OTA_EXCHANGE)
  }
}

export const otaAdapters = {
  [OTA_SOURCES.VIA_OTA]: new ViaOTAAdapter(),
  [OTA_SOURCES.VIA_OTA_EXCHANGE]: new ViaOTAExchangeAdapter(),
}

export const getOTAAdapter = (source) => {
  return otaAdapters[source] || new BaseOTAProviderAdapter(source)
}
