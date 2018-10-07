import * as React from 'react'
import { observer } from 'mobx-react';
import { NewReportFormStore } from '../NewReportFormStore';
import { GeoLocationComponent } from './GeoLocationComponent';

export const GeoLocation = observer(() =>
	<GeoLocationComponent {...NewReportFormStore.getInstance().geoLocationProps} />
);