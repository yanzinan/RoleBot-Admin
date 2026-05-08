import axios from 'axios';
import swal from 'sweetalert';
import ZRouter from './router'

// 假设这是你的基础 URL
// const baseUrl = 'https://c110-114-93-118-179.ngrok-free.app';
const baseUrl = 'http://47.103.35.90:4202';

// 预定义的标记与 API 地址字典
const apiUrls = {
  'Auth-login': '/api/v1/Auth/login',
  'Auth-change': '/api/v1/Auth/change',
};

export function useAxios() {
  const addTokenToHeader = (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['token'] = token;
    }
    return config;
  };

  const getAbsoluteUrl = (tag) => {
    const relativeUrl = apiUrls[tag];
    if (!relativeUrl) {
      throw new Error(`No API URL found for the tag: ${tag}`);
    }
    return baseUrl + relativeUrl;
  };

  const post = async (tag, data) => {
    const absoluteUrl = getAbsoluteUrl(tag);
    const config = {
      method: 'POST',
      url: absoluteUrl,
      data,
      headers:{}
    };

    // 在发送请求之前，将 token 添加到请求头中
    const configWithToken = addTokenToHeader(config);

    try {
      const response = await axios.request(configWithToken);
      return response.data
    } catch (error) {
      console.error('Axios Error:', error);
      if(error.response.status == 401){
        swal('Token is missing or invalid!','Please click the button below to return to the login page!',"error",{
            buttons: {
              confirm: 'OK',
            }
        }).then((value) => {
          sessionStorage.clear();
          ZRouter.push('/login')
        });
      }
      throw error;
      
    }
  };

  return { post };
}

