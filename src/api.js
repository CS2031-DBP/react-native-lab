import axios from 'axios';

const API_URL = 'http://52.3.234.203:8080'; 

export const register = async (name, email, password, isTeacher) => {
  const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, isTeacher });
  return response.data;
};