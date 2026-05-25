import axios from 'axios';
import swal from 'sweetalert';
import ZRouter from './router'

// 假设这是你的基础 URL
// 封装请求地址
const isDev = import.meta.env.DEV
// 本地用代理前缀，生产用完整域名
// const baseUrl = isDev ? '/api' : 'http://www.kaoiki.com:8080'
const baseUrl = 'http://www.kaoiki.com:8080'


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
  'master-point-package':'/api/v1/master/point-package',
  'master-others':'/api/v1/master/others',
  'master-others-save':'/api/v1/master/others/save',
  'master-rtc-pat':'/api/v1/master/rtc-pat',
  'master-point-package-save':'/api/v1/master/point-package/save',
  "master-member-fee-bonus":"/api/v1/master/member-fee-bonus",
  "master-member-fee-bonus-save":"/api/v1/master/member-fee-bonus/save",
  "master-report-usage-count":"/api/v1/master/report-usage-count",
  "master-report-usage-count-save":"/api/v1/master/report-usage-count/save",
  "point-consume-resource-upload":"/api/v1/point/consume-resource/upload",
  "other-share-upload":"/api/v1/other/share/upload",
  "other-official-account-upload":"/api/v1/other/official-account/upload",
  "other-article-upload":"/api/v1/other/article/upload",
  "agent-save":"/api/v1/agent/save",
  "member-config-save":"/api/v1/member/config/save",
  "admin-logout":"/api/v1/admin/logout",
};

export function useAxios() {
  // 统一添加token到请求头
  const addTokenToHeader = (config) => {
    const token = localStorage.getItem('RoleBot-Admin-Token');
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

