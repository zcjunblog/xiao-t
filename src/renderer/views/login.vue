<template>
  <div class="page-login">
    <div class="box">
      <img
              class="logo"
              src="../assets/logo.png"
              alt=""
      />
      <div class="desc">
        <span>易齿平台客户端</span>
      </div>
      <div class="login-content">
        <div class="qrcode">
          <img v-if="QRCode" class="img" :src="QRCode" alt="">
          <img v-else class="loading" src="../assets/loading.gif" alt="">
        </div>
        <div class="desc" @click="$router.push('/land')">本平台只对授权用户开放，请确保您的账号已在个人中心绑定微信。</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getLoginCode, getLoginStatus } from "@renderer/api/login";
export default defineComponent({
  data: () => ({
    QRCode:'',
  }),
  computed: {

  },
  created() {
    getLoginCode('Default').then(res=>{
      console.log(res)
      this.QRCode = 'data:image/png;base64,' + res.aCode
    })
  },
  mounted() {
    // setTimeout(()=>{this.checkLoginStatus()},3000)
    this.$m.vuex('vuex_menuIndex', '0')
    this.$m.vuex('vuex_version', packageInfo.version)
  },
  methods: {
    checkLoginStatus(){
      getLoginStatus(112).then(res=>{
        if(res.status){
          this.$router.replace('/index')
          return
        }
        setTimeout(()=>{this.checkLoginStatus()},3000)
      })
    }
  },
});
</script>

<style lang="scss" scoped>
  .page-login {
    height: 100vh;
    width: 100vw;
    position: relative;
    background-color: #2f3447;
    /*background: url("../assets/login_bg.png") 100% 100%;*/

    .box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 500px;
      width: 500px;
      position: absolute;
      left: calc(50% - 250px);
      top: calc(50% - 250px);

      .logo {
        height: 50px;
        margin-bottom: 20px;
      }

      .desc {
        color: #ccc;
        font-size: 12px;
        margin-bottom: 30px;
        letter-spacing: 1px;
        span{
          cursor: pointer;
        }
        .active{
          color: #4165d7;
        }
      }

      .submit-btn {
        margin-top: 40px;
        border-radius: 30px;
        padding: 10px 40px;
        color: #000;
      }
    }
  }
  .login-content{
    height: 650px;
    text-align: center;
    .desc{
      margin-top: 30px;
    }
  }
  .qrcode{
    width: 200px;
    height: 200px;
    border: 0.5px solid #eee;
    margin: auto;
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    .loading{
      position: absolute;
      width: 32px;
      height: 32px;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      margin: auto;
    }
    .img{
      width: 100%;
      height: 100%;
    }
  }
</style>
