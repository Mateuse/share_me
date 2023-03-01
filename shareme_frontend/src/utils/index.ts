import axios from 'axios';
import jwt_decode from 'jwt-decode';

export const createOrGetUser = async (res: any) => {
    const decoded = jwt_decode(res.credential);
}