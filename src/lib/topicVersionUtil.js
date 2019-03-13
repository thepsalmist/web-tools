import { snapshotIsUsable } from '../reducers/topics/selected/snapshots';
import { nullOrUndefined } from './formValidators';

export function getTopicVersionInfo(topicInfo) {
  // get latest version and status
  const snapshots = topicInfo.snapshots.list;
  const snapshotJobStatus = topicInfo.snapshots.jobStatus;

  const lastReadySnapshot = snapshots.filter(s => snapshotIsUsable(s)).sort((f1, f2) => {
    if (f1.snapshot_date < f2.snapshot_date) {
      return 1;
    }
    return -1;
  })[0];

  return ({
    versionList: snapshots,
    jobStatuses: snapshotJobStatus,
    lastReadySnapshot,
  });
}

export function getCurrentVersionFromSnapshot(topicInfo, currentSnapshotId) {
  // get latest version and status
  const snapshots = topicInfo.snapshots.list;
  if (!currentSnapshotId || nullOrUndefined(currentSnapshotId)) return '';
  const currentVersion = snapshots.find(s => s.snapshots_id === currentSnapshotId).note;

  return currentVersion;
}

export function getTotalVersions(topicInfo) {
  return topicInfo.snapshots.list.length;
}
