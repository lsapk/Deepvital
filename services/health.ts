import { Platform } from 'react-native';
import {
  initialize,
  requestPermission,
  readRecords,
  getSdkStatus,
  SdkStatus
} from 'react-native-health-connect';
import { getDatabase } from './database';

export class HealthService {
  static async checkStatus() {
    if (Platform.OS !== 'android') return SdkStatus.SDK_UNAVAILABLE;
    try {
      return await getSdkStatus();
    } catch (e) {
      console.warn("Health Connect not available on this device");
      return SdkStatus.SDK_UNAVAILABLE;
    }
  }

  static async setup() {
    if (Platform.OS !== 'android') return false;
    try {
      const status = await this.checkStatus();
      if (status === SdkStatus.SDK_AVAILABLE) {
        await initialize();
        return true;
      }
    } catch (e) {
      console.error("Health Connect initialization failed:", e);
    }
    return false;
  }

  static async requestPermissions() {
    if (Platform.OS !== 'android') return [];
    try {
      return await requestPermission([
        { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
        { accessType: 'read', recordType: 'BasalMetabolicRate' },
        { accessType: 'read', recordType: 'BodyFat' },
        { accessType: 'read', recordType: 'Distance' },
        { accessType: 'read', recordType: 'ExerciseSession' },
        { accessType: 'read', recordType: 'HeartRate' },
        { accessType: 'read', recordType: 'Height' },
        { accessType: 'read', recordType: 'Nutrition' },
        { accessType: 'read', recordType: 'OxygenSaturation' },
        { accessType: 'read', recordType: 'SleepSession' },
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'read', recordType: 'Vo2Max' },
        { accessType: 'read', recordType: 'Weight' },
      ]);
    } catch (e) {
      console.error("Permission request failed:", e);
      return [];
    }
  }

  static async syncData() {
    if (Platform.OS !== 'android') return;
    try {
      const db = await getDatabase();
      const now = new Date();
      const lastSyncResult = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_settings WHERE key = ?', ['last_health_sync']);
      const startTime = lastSyncResult ? lastSyncResult.value : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const endTime = now.toISOString();

      const recordTypes = [
        'HeartRate', 'Steps', 'ActiveCaloriesBurned', 'SleepSession',
        'OxygenSaturation', 'Vo2Max', 'Weight', 'Height'
      ] as const;

      for (const type of recordTypes) {
        try {
          const records = await readRecords(type, {
            timeRangeFilter: {
              operator: 'between',
              startTime,
              endTime,
            },
          });

          for (const record of records) {
            let value = 0;
            if ('value' in record) value = Number(record.value);
            else if ('count' in record) value = Number(record.count);
            else if ('energy' in record) value = Number(record.energy?.inCalories);

            const recordTime = (record as any).startTime || (record as any).time;

            await db.runAsync(
              'INSERT OR IGNORE INTO health_logs (type, value, unit, metadata, timestamp) VALUES (?, ?, ?, ?, ?)',
              [type, value, '', JSON.stringify(record), recordTime]
            );
          }
        } catch (error) {
          console.error(`Error syncing ${type}:`, error);
        }
      }

      await db.runAsync('INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)', ['last_health_sync', endTime]);
    } catch (e) {
      console.error("Critical sync error:", e);
    }
  }
}
