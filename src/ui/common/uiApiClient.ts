import axios from 'axios';
import { ApiClient } from 'shared/ApiClient';

export const uiApiClient = new ApiClient(axios.create());