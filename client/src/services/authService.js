import axios from "axios";

const url = "https://blogify-back-end.herokuapp.com/api/auth/";

class AuthService {
  static loginRequest(data) {
    return axios.post(url, data);
  }
}

export default AuthService;
