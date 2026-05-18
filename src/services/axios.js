import axios from 'axios';
import swal from 'sweetalert';
import ZRouter from './router'

// 假设这是你的基础 URL
// const baseUrl = 'https://c110-114-93-118-179.ngrok-free.app'; 
const baseUrl = '/api';

// 预定义的标记与 API 地址字典
const apiUrls = {
  'admin-login':'/api/v1/admin/login',
  'voice-list':'/api/v1/voice/list',
  'agent-list':'/api/v1/agent/list',
  'agent-delete':'/api/v1/agent/delete',
  'master-rtc-m-cost':'/api/v1/master/rtc-m-cost',
  'master-model-update':'/api/v1/master/model-update',
  'master-rtc-m-cost-save':'/api/v1/master/rtc-m-cost/save',
  'master-rtc-pat-save':'/api/v1/master/rtc-pat/save',
  'master-model-update-save':'/api/v1/master/model-update/save',
};

export function useAxios() {
  // 统一添加token到请求头
  const addTokenToHeader = (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['token'] = token;
    }
    return config;
  };

  // 根据tag获取完整请求地址
  const getAbsoluteUrl = (tag) => {
    const relativeUrl = apiUrls[tag];
    if (!relativeUrl) {
      throw new Error(`No API URL found for the tag: ${tag}`);
    }
    return baseUrl + relativeUrl;
  };

  // POST请求（原有逻辑不变）
  const post = async (tag, data) => {
    const absoluteUrl = getAbsoluteUrl(tag);
    const config = {
      method: 'POST',
      url: absoluteUrl,
      data,
      headers:{}
    };

    const configWithToken = addTokenToHeader(config);

    try {
      const response = await axios.request(configWithToken);
      return response.data
    } catch (error) {
      console.error('Axios Error:', error);
      if(error.response?.status == 401){
        swal('Token is missing or invalid!','Please click the button below to return to the login page!',"error",{
            buttons: {
              confirm: 'OK',
            }
        }).then(() => {
          localStorage.clear();
          ZRouter.push('/login')
        });
      }
      throw error;
    }
  };

  // ==================== 新增 GET 请求 ====================
  // 支持自动拼接 ?page=1&pageSize=10 格式参数
  const get = async (tag, params = {}) => {
    const absoluteUrl = getAbsoluteUrl(tag);
    const config = {
      method: 'GET',
      url: absoluteUrl,
      params, // axios 会自动把 params 对象拼接成 ?key=value&xxx=xxx
      headers:{}
    };

    // 统一添加token
    const configWithToken = addTokenToHeader(config);

    try {
      const response = await axios.request(configWithToken);
      return response.data
    } catch (error) {
      console.error('Axios Error:', error);
      // 统一401处理
      if(error.response?.status == 401){
        swal('Token is missing or invalid!','Please click the button below to return to the login page!',"error",{
            buttons: {
              confirm: 'OK',
            }
        }).then(() => {
          localStorage.clear();
          ZRouter.push('/login')
        });
      }
      throw error;
    }
  };

  // 导出 post + get 两个方法
  return { post, get };
}

