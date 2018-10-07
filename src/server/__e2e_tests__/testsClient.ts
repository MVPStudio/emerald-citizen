import { ApiClient } from 'shared/ApiClient';
import axios from 'axios';

export const testsClient = new ApiClient(axios.create({ baseURL: 'http://localhost:8080' }));