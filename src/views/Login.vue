<template>
  <div class="login_container">
    <div class="login_box">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="100px">
        <el-form-item
          label="用户名"
          prop="username">
          <el-input
            v-model="form.username"
            ref="username" />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password">
          <el-input
            type="password"
            v-model="form.password"
            @keyup.enter.native="submitForm('form')" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('form')"
            :loading="submitLoading">登 录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import API from './api';
import { setToken, setUsername } from 'utils/auth';

export default {
    data() {
        const validateUsername = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入用户名'));
            }
            callback();
        };
        const validatePassword = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入密码'));
            }
            if (value.length < 6 || value.length > 18) {
                callback(new Error('密码长度为6-18位'));
            }
            callback();
        };
        return {
            rules: {
                username: [
                    { validator: validateUsername, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePassword, trigger: 'blur' }
                ],
            },
            form: {
                username: '',
                password: '',
            },
            submitLoading: false,
        };
    },
    mounted() {
        this.$refs['username'].focus();
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.submitLoading = true;
                    API.Login(this.form).then(res => {
                        setToken(res.token);
                        setUsername(this.form.username);
                        this.$router.replace('/home');
                    }).catch(e => {
                        this.form.password = '';
                        // eslint-disable-next-line
                        console.log('catch err', e);
                    }).finally(() => {
                        this.submitLoading = false;
                    });
                } else {
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.login_container {
    height: 100%;
    position: relative;
    .login_box {
        width: 400px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
}
</style>

