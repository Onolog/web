// @flow

export type Activity = {
  activityType: ?string,
  avgHr: ?number,
  calories: ?number,
  distance: number,
  duration: number,
  elevationGain: ?number,
  elevationLoss: ?number,
  friends?: string,
  garminActivityId: ?number,
  id?: number,
  maxHr: ?number,
  notes?: string,
  shoeId?: number,
  startDate: string,
  timezone: string,
  userId?: number,
};
