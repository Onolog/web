import PropTypes from 'prop-types';
import React from 'react';

import Image from '../Image/Image.react';
import ImageBlock from '../ImageBlock/ImageBlock.react';
import Link from '../Link/Link.react';

import { getDeviceImageSrc, getDeviceProductPageURL } from '../../utils/GarminDeviceUtils';

/**
 * ActivityDeviceInfo.react
 *
 * Displays the the name and software version for a given device.
 */
const ActivityDeviceInfo = ({ deviceName, softwareVersion }) => (
  <ImageBlock
    align="middle"
    image={
      <Image
        className="activityDeviceImage"
        src={getDeviceImageSrc(deviceName)}
      />
    }>
    <h5 className="activityDeviceName">
      <Link href={getDeviceProductPageURL()}>
        {deviceName}
      </Link>
    </h5>
    <div className="activityDeviceVersion">
      {`Software Version: ${softwareVersion}`}
    </div>
  </ImageBlock>
);

ActivityDeviceInfo.propTypes = {
  deviceName: PropTypes.string.isRequired,
  softwareVersion: PropTypes.string.isRequired,
};

export default ActivityDeviceInfo;
