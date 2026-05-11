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
    return await getSdkStatus();
  }

  static async setup() {
    const status = await this.checkStatus();
    if (status === SdkStatus.SDK_AVAILABLE) {
      await initialize();
      return true;
    }
    return false;
  }

  static async requestPermissions() {
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
  }

  static async syncData() {
    const db = await getDatabase();
    const now = new Date();
    const startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(); // Last 30 days
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

        // Store in SQLite
        for (const record of records) {
          // This is a simplified storage logic
          let value = 0;
          if ('value' in record) value = Number(record.value);
          else if ('count' in record) value = Number(record.count);
          else if ('energy' in record) value = Number(record.energy?.inCalories);

          await db.runAsync(
            'INSERT INTO health_logs (type, value, unit, metadata, timestamp) VALUES (?, ?, ?, ?, ?)',
            [type, value, '', JSON.stringify(record), (record as any).startTime || (record as any).time]
          );
        }
      } catch (error) {
        console.error(`Error syncing ${type}:`, error);
      }
    }
  }
}
