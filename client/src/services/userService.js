import axios from "axios";

const url = "https://blogify-back-end.herokuapp.com/api/users/";

class UserService {
  static profile(token, id) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`${url}profile`, {
          headers: {
            "x-auth-token": token,
            id: id,
          },
        });
        const data = res.data;
        if (!data.fname) {
          resolve(
            data.map((blog) => ({
              ...blog,
              createdAt: new Date(blog.createdAt),
            }))
          );
        } else resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static me(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`${url}me`, {
          headers: {
            "x-auth-token": token,
          },
        });
        const data = res.data;
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static createUser(user, token) {
    return axios.post(url, user, {
      headers: {
        "x-auth-token": token,
      },
    });
  }

  static addFollowing(id, token) {
    return axios.patch(
      `${url}me`,
      { id: id },
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
  }

  static getFollowing(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`${url}following`, {
          headers: {
            "x-auth-token": token,
          },
        });
        const data = res.data;
        resolve(
          data.map((blog) => ({
            ...blog,
            createdAt: new Date(blog.createdAt),
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default UserService;
