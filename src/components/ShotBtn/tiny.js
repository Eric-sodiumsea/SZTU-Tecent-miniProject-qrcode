import { gzip } from 'pako';
import tiny from "@mxsir/image-tiny";

// base64 -> File
/**
 * @author Levin
 * @param {Base64编码字符串} dataurl 
 * @param {文件对象命名} filename 
 * @returns 文件对象
 */
function dataURLtoFile(dataurl, filename) {
    // 获取到base64编码
    const arr = dataurl.split(',')
    // 将base64编码转为字符串
    // console.log(arr[1]);
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n) // 创建初始化为0的，包含length个元素的无符号整型数组
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, {
        type: 'image/png',
    })
}

/**
 * 
 * @param {Base64编码字符串} base64 
 * @returns 
 */
async function tinyCompress(base64) {
    // 将base64转换为文件对象
    let old_file = dataURLtoFile(base64, "test_000" + ".png");
    console.log(old_file);
    // tiny插件压缩 
    return await tiny(old_file, 1);
}

/**
 * @author Levin
 * @param {待压缩的字符串} str 
 * @returns 压缩后的字符串
 */
export function gzipStr(str) {
    return bin2Str(gzip(str));
}

/**
 * @author Levin
 * @param {字节数组} array 
 * @returns 字符串
 */
function bin2Str(array) {
    return String.fromCharCode.apply(String, array);
}

export default async function compress(base64) {
    let compress_pic_base64 = await compressPic(base64);
    compress_pic_base64 = compress_pic_base64.split(',')[1];
    // console.log('\n', compress_pic_base64)
    let res = gzipStr(compress_pic_base64);
    // console.log('res\n', res);
    // console.log(resStr);
    return res;
}

export async function compressPic(base64) {
    let file = await tinyCompress(base64);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise(rs => {
        reader.onload = () => {
            console.log('=======文件读取成功=======');
            rs(reader.result);
        }
    })
}

