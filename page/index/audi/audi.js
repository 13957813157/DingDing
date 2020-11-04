 let app = getApp();


//内网穿透工具介绍:
// https://open-doc.dingtalk.com/microapp/debug/ucof2g
//替换成开发者后台设置的安全域名
//let domain = "http://localhost:3000";
let url = "https://xdsp.tscs.cc";
 
Page({
  data: {
     
    corpId: '',
    authCode: '',
    userid: '',
    userName: '',
    title:'',
    info: '',
     
 
  },
      
 
   onLoad(query) {
      dd.showLoading({
       content:'正在查询...',
          //delay:'1000', 
          
     });
 dd.getAuthCode({
      success: (res) => {
        this.setData({
          authCode: res.authCode

        })
        dd.httpRequest({ 
          url: url+"/login", 
          method: 'POST',
          data: {
            authCode: res.authCode,
            type:"login" 
          },
          dataType: 'json',
          success: (res) => {
            console.log('success----', res)
             let userid = res.data.result.userId;
           
             this.setData({
               userid: userid
             })
    
 //dd.alert({ content: userid });
        dd.httpRequest({
      url: url+"/selectAudInfoByMobile", 
      method: 'POST',
    data:{userid:userid},
      dataType: 'json',
      success: (res) => {
       
      
        let info = res.data;
       // dd.alert({ content: info[0].OrgName});
        this.setData({
          info: info
        })
        if(null==info||info==''){
 dd.alert({ content: "查询无结果" });
        }
      },
      fail: (res) => {
        console.log("httpRequestFail---", res)
        dd.alert({ content: JSON.stringify(res) });
          dd.hideLoading();
      },
      complete: (res) => {
        dd.hideLoading();
      }
    });

          },
          fail: (res) => {
            console.log("httpRequestFail---", res)
            dd.alert({ content: JSON.stringify(res) });
          },
          complete: (res) => {
             dd.hideLoading();
            
          }
        });
      },
      
    });



   

      
   
 

  },
  
 
})