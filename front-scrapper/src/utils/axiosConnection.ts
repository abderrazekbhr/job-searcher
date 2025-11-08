import axios from "axios";
import {ENV} from "./env"  

const BASE_URL=ENV.BASE_URL


export const axiosConnection = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
});