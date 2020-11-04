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
    hideList: false,
    info: '',
    searchinfo: '',
    array: ['新增', '资产重组', '叙作', '复议', '变更', '表外业务修改'],
    pickindex: 0,
    userid: '',

    tabs2: [
      {
        title: '待办处理',

        showBadge: false,
        badge: {
          arrow: false,
          stroke: true,
        },
      },
      {
        title: '业务流程查询',


        showBadge: false,
        badge: {
          arrow: true,
        },
      }

    ],
    activeTab2: 0,
  },
  onPullDownRefresh() {
    this.onShow();
    dd.stopPullDownRefresh();
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);

    this.setData({
      pickindex: e.detail.value,
    });
  },
  handleTabClick({ index, tabsName }) {
    this.setData({
      [tabsName]: index,
    });
    if (index == 0) {
      this.onShow();
    };

  },
  handleTabChange({ index, tabsName }) {
    this.setData({
      [tabsName]: index,
    });
  },

  onShow() {

    dd.showLoading({
      content: '正在查询...',
      //delay:'1000', 

    });

    dd.getAuthCode({
      success: (res) => {
        this.setData({
          authCode: res.authCode

        })
        dd.httpRequest({
          url: url + "/login",
          method: 'POST',
          data: {
            authCode: res.authCode,
            type: "login"
          },
          dataType: 'json',
          success: (res) => {
            console.log('success----', res)
            let userid = res.data.result.userId;
            this.setData({
              userid: userid
            })

            dd.httpRequest({

              url: url + "/selectAudInfoByMobile",
              method: 'POST',
              data: { userid: userid },
              dataType: 'json',
              success: (res) => {


                let info = res.data;



                // dd.alert({ content: info[0].OrgName});
                this.setData({
                  info: info

                })
                if (null == info || info == '') {
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


          }
        });
      },

    })

  },
  formSubmit: function (e) {

    dd.showLoading({
      content: '正在查询...',
      //delay:'1000',
    });


    dd.httpRequest({
      url: url + "/selectAudInfo",
      method: 'POST',
      data: { CustomerName: e.detail.value.CustomerName, MrchFlg: e.detail.value.MrchFlg, BusinessTypeName: e.detail.value.BusinessTypeName, OccurTypeName: e.detail.value.OccurTypeName },
      dataType: 'json',
      success: (res) => {


        let searchinfo = res.data.info;
        // dd.alert({ content: info[0].OrgName});
        this.setData({
          searchinfo: searchinfo
        })
        if (null == searchinfo || searchinfo == '') {
          dd.alert({ content: "查询无结果" });
        }
      },
      fail: (res) => {
        console.log("httpRequestFail---", res)
        dd.alert({ content: JSON.stringify(res) });
      },
      complete: (res) => {
        dd.hideLoading();
      }
    });

  }

});

// Page({
//   data: {
//     userid:''
//   },



//   onShow() {



//     dd.getAuthCode({
//       success: (res) => {
//         this.setData({
//           authCode: res.authCode

//         })
//         dd.httpRequest({
//           url: url+"/login",
//           method: 'POST',
//           data: {
//             authCode: res.authCode,
//             type:"login"
//           },
//           dataType: 'json',
//           success: (res) => {
//             console.log('success----', res)
//              let userid = res.data.result.userid;
//           },
//           fail: (res) => {
//             console.log("httpRequestFail---", res)
//             dd.alert({ content: JSON.stringify(res) });
//           },
//           complete: (res) => {


//           }
//         });
//       },

//     })
//   },



// })