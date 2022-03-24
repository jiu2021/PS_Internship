import Mock from 'mockjs';
import imgList from './imgList.json';

//mock数据  第一个参数：请求地址 第二个参数：请求数据
Mock.mock("/mock/imgList", { code: 200, data: imgList });