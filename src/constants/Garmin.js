/**
 * Garmin-related constants
 */

export const API_KEY = '2b3f4a3a13900af73dd5a19c1c8f77e3';

export const BASE_IMG_URL = 'https://static.garmincdn.com/com.garmin.connect/content/images/device-images/';

export const BASE_STORE_URL = 'https://buy.garmin.com/shop/shop.do';

export const METRICS = {
  SUM_ELAPSED_DURATION: 'sumElapsedDuration',
  LATITUDE: 'directLatitude',
  SUM_MOVING_DURATION: 'sumMovingDuration',
  UNCORRECTED_ELEVATION: 'directUncorrectedElevation',
  ELEVATION: 'directElevation',
  HEART_RATE: 'directHeartRate',
  SUM_DURATION: 'sumDuration',
  SUM_DISTANCE: 'sumDistance',
  TIMESTAMP: 'directTimestamp',
  CORRECTED_ELEVATION: 'directCorrectedElevation',
  SPEED: 'directSpeed',
  LONGITUDE: 'directLongitude',
  VERTICAL_SPEED: 'directVerticalSpeed',
};

// URL for downloading activities
// https://connect.garmin.com/modern/proxy/download-service/export/{type}/activity/{activityId}

export const PRODUCT_ID = {
  forerunner: {
    '910xt': 90671,
    620: 122785,
    610: 84374,
    '310xt': 27335,
    305: null,
    220: 129397,
    210: 83280,
    110: 63511,
    10: 107143,
  },
};

export const TCX_SCHEMA_TAGS = {
  activities: 'Activities',
  activity: 'Activity',
  activityId: 'Id',
  activitySport: 'Sport',
  author: 'Author',
  course: 'Course',
  courses: 'Courses',
  courseName: 'Name',
  creator: 'Creator',
  creatorName: 'Name',
  creatorUnitID: 'UnitId',
  creatorProductID: 'ProductID',
  elevationGain: 'ElevationGain',
  lap: 'Lap',
  lapAverageHeartRate: 'AverageHeartRateBpm',
  lapCadence: 'Cadence',
  lapCalories: 'Calories',
  lapDistance: 'DistanceMeters',
  lapElevationChange: 'ElevationChange',
  lapIntensity: 'Intensity',
  lapMaxHeartRate: 'MaximumHeartRateBpm',
  lapMaxSpeed: 'MaximumSpeed',
  lapNotes: 'Notes',
  lapStartTime: 'StartTime',
  lapTotalTime: 'TotalTimeSeconds',
  lapTriggerMethod: 'TriggerMethod',
  multiSportSession: 'MultiSportSession',
  nextSport: 'NextSport',
  position: 'Position',
  positionLatitude: 'LatitudeDegrees',
  positionLongitude: 'LongitudeDegrees',
  track: 'Track',
  trackPoint: 'Trackpoint',
  trackPointCadence: 'Cadence',
  trackPointDistance: 'DistanceMeters',
  trackPointElevation: 'AltitudeMeters',
  trackPointHeartRate: 'HeartRateBpm',
  trackPointHeartRateValue: 'Value',
  trackPointSensorState: 'SensorState',
  trackPointTime: 'Time',
  version: 'Version',
  versionBuildMajor: 'BuildMajor',
  versionBuildMinor: 'BuildMinor',
  versionMajor: 'VersionMajor',
  versionMinor: 'VersionMinor',
};
