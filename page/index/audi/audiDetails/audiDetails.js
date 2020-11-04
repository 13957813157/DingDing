let app = getApp();
//内网穿透工具介绍:
// https://open-doc.dingtalk.com/microapp/debug/ucof2g
//替换成开发者后台设置的安全域名
//let domain = "http://localhost:3000";
let url = "https://xdsp.ncbank.cn";

Page({
  data: {
    corpId: '',
    authCode: '',
    userId: '',
    userName: '',
    title: '',
    info: '',
    point: '',
    action: '',
    value: [0, 0],
    isdisabled: false
  },
  formSubmit: function (e) {
    if (app.globalData.value[0] == 0) {
      dd.alert({ content: "请选择节点", buttonText: '确认', });
      return;
    }
    this.setData({
      isdisabled: true,
    })
    let userid = '';
    let roleid = '';
    if (app.globalData.action[app.globalData.value[0]].length > 0) {

      userid = app.globalData.action[app.globalData.value[0]][app.globalData.value[1]].UserID;
      roleid = app.globalData.action[app.globalData.value[0]][app.globalData.value[1]].RoleID;
    }
    dd.httpRequest({
      url: url + "/dealAudi1",
      method: 'POST',
      data: {
        title: app.globalData.title, pointValue: app.globalData.point[app.globalData.value[0]], userid: userid, roleid: roleid,
        BusinessSum: e.detail.value.BusinessSum, ExposureSum: e.detail.value.ExposureSum, advice: e.detail.value.advice, condition: e.detail.value.condition, requests: e.detail.value.requests, remarks: e.detail.value.remarks, subOrRet: "submit"
      },
      dataType: 'json',
      success: (res) => {
        dd.alert({
          content: res.data.msg,
          buttonText: '确认',
        });
        // dd.navigateTo({
        //   url: '/page/index/index',
        // })
        dd.navigateBack({
          delta: 2
        })
      },
      fail: (res) => {
        console.log("httpRequestFail---", res)
        dd.alert({ content: JSON.stringify(res) });
      },
      complete: (res) => {


      }
    });
  },
  formReset: function (e) {
    this.setData({
      isdisabled: true,
    })
    dd.httpRequest({
      url: url + "/dealAudi1",
      method: 'POST',
      data: { title: app.globalData.title, advice: "退回上一步", subOrRet: "return" },
      dataType: 'json',
      success: (res) => {
        dd.alert({ content: res.data.msg, buttonText: '确认', });
        dd.navigateBack({
          delta: 2
        })
      },
      fail: (res) => {
        console.log("httpRequestFail---", res)
        dd.alert({ content: JSON.stringify(res) });
      },
      complete: (res) => {

      }
    });
    // dd.device.notification.alert({
    //   message:res.data.msg ,
    //   buttonName:"收到",
    //   onSuccess:function(result){
    //     dd.biz.navigation.close({})
    //   },onFail:function(err){}
    // })
  },
  onChange(e) {
    console.log(e.detail.value);
    // dd.alert({content:this.actionArr});
    // let action = actionArr[index],
    this.setData({
      value: e.detail.value,
      // action: action, 
    });
    app.globalData.value = e.detail.value
    // dd.alert({ content: app.globalData.value });
  },
  onLoad(query) {
    app.globalData.value = [0, 0]
    dd.httpRequest({
      url: url + "/showAudi1",
      method: 'POST',
      data: { title: query.title },
      dataType: 'json',
      success: (res) => {
        //dd.alert({ content: JSON.stringify(res) });
        let info = res.data;
        if (info.result == false) {

          dd.navigateTo({
            url: '/page/index/index',
          })
          dd.alert({ content: info.msg, buttonText: '确认', });
        } else {
          let pointArr = ['请选择节点(上下滑动选择)'];
          let actionArr = [{ '': '' }];
          app.globalData.title = query.title;
          info.pointList.map(item => {
            pointArr.push(item.point);
            actionArr.push(item.action);
            // action = item.action[0],
          });
          //  dd.alert({ content: JSON.stringify(actionArr) });
          this.setData({
            title: query.title,
            info: info,
            action: actionArr,
            point: pointArr,
            // actionArr :actionArr,
          })
          app.globalData.point = pointArr;
          app.globalData.action = actionArr;
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
})