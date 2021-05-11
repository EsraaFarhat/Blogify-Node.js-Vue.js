import axios from "axios";

const url = "http://127.0.0.1:3000/api/blogs/";

class BlogService {
  static getBlogs(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url);
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

  static createBlog(blog, token) {
    return axios.post(url, blog, {
      headers: {
        "x-auth-token": token,
      },
    });
  }

  static searchBlogs(key, token) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`${url}search/${key}`, {
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

  static getById(key, token) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`${url}${key}`, {
          headers: {
            "x-auth-token": token,
          },
        });
        const data = res.data;
        resolve({
          ...data,
          createdAt: new Date(data.createdAt),
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  static editBlog(token, id, blog) {
    return axios.patch(`${url}${id}`, blog, {
      headers: {
        "x-auth-token": token,
      },
    });
  }

  static deleteBlog(token, id) {
    return axios.delete(`${url}${id}`, {
      headers: {
        "x-auth-token": token,
      },
    });
  }
}

export default BlogService;
