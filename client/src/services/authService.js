import axios from "axios";

const url = "http://127.0.0.1:3000/api/auth/";

class AuthService {

    static loginRequest(data){
        return axios.post(url, data);
    }
}

export default AuthService;