import axios from "axios";

const url = "http://127.0.0.1:3000/api/blogs/";

class BlogService {
    // get
    static getBlogs(token){
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                const data = res.data;
                resolve(
                    data.map(blog => ({
                        ...blog,
                        createdAt: new Date(blog.createdAt)
                    }))
                );
            } catch (err) {
                reject(err)
            }
        })
    }
      
    //post 
    static createBlog(blog, token){
        return axios.post(url, blog, {
            headers: {
                'x-auth-token': token
            }
        });
    }

    static searchBlogs(text, token){
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(`${url}${text}`, {
                    headers: {
                        'x-auth-token': token,
                    }
                });
                const data = res.data;
                resolve(
                    data.map(blog => ({
                        ...blog,
                        createdAt: new Date(blog.createdAt)
                    }))
                );
            } catch (err) {
                reject(err)
            }
        });
    }

    //delete
    static deleteBlog(id){
        return axios.delete(`${url}${id}`);
    }
}

export default BlogService;