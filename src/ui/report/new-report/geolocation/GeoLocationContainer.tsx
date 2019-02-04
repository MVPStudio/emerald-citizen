import * as React from 'react'
import { observer } from 'mobx-react';
import { NewReportFormStore } from '../NewReportFormStore';
import { GeoLocation } from './GeoLocation';

export const GeoLocationContainer = observer(() =>
	<GeoLocation {...NewReportFormStore.getInstance().geoLocationProps.get()} />
);